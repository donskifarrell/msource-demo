import os

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from werkzeug import secure_filename
from celery import Celery, current_task
from celery.result import AsyncResult
from src import estimation, helpers
from settings import CELERY_BROKER_HOST, UPLOAD_FOLDER

celery = Celery(os.path.splitext(__file__)[0],
                backend=CELERY_BROKER_HOST+'/1',
                broker=CELERY_BROKER_HOST+'/1')

app = Flask(__name__,
            static_folder='../frontend/build/static',
            template_folder='../frontend/build')
app.config.update(
    UPLOAD_FOLDER=UPLOAD_FOLDER,
)
CORS(app)


@celery.task
def generate_quote(filename):
    print('Route::generate_quote')
    current_task.update_state(state='IN_PROGRESS', meta={'filename': filename})

    slicer_output = estimation.convert_stl_to_gcode(filename)
    slicer_details = estimation.extract_slicer_details(slicer_output)

    gcode_output = estimation.load_gcode(filename)
    gcode_details = estimation.extract_gcode_details(gcode_output)

    current_task.update_state(state='SUCCESS', meta={
                              'filename': filename, 'details': gcode_details})
    return gcode_details


@app.route('/api/upload', methods=['POST'])
def upload():
    print('Route::Upload')

    if request.method == 'POST':
        files = request.files['stl']
        if files:
            filename = secure_filename(files.filename)
            filename = helpers.gen_file_name(filename)
            mime_type = files.content_type

            if not helpers.allowed_file(files.filename):
                response = {
                    'success': False,
                    'error': 'File type not allowed'
                }
                return jsonify(response)

            else:
                uploaded_file_path = os.path.join(
                    app.config['UPLOAD_FOLDER'], filename)
                files.save(uploaded_file_path)
                size = os.path.getsize(uploaded_file_path)

                job = generate_quote.delay(filename)

                response = {
                    'success': True,
                    'name': filename,
                    'jobId': job.id,
                }
                return jsonify(response)

    response = {
        'success': False,
        'error': 'No file provided'
    }
    return jsonify(response)


@app.route('/api/get-quote', methods=['GET'])
# Insecure - solved by using sessions + auth
# Also, crude polling to get progress
def progress():
    jobid = request.values.get('jobId')
    if jobid:
        job = AsyncResult(jobid, app=celery)
        print(job.state)
        print(job.result)
        if job.state == 'IN_PROGRESS':
            response = {
                'success': True,
                'state': job.state,
            }
            return jsonify(response)
        elif job.state == 'SUCCESS':
            response = {
                'success': True,
                'state': job.state,
                'details': job.result,
            }
            return jsonify(response)

    response = {
        'success': False
    }
    return jsonify(response)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def main(path):
    print('Route::Home')

    return render_template('index.html')
