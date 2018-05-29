import os
import requests
import sqlite3

from flask import g, Flask, render_template, jsonify, request, redirect, url_for
from random import *
from werkzeug.utils import secure_filename

DATABASE = ':memory:'
UPLOAD_FOLDER = '/tmp/'
ALLOWED_EXTENSIONS = set(['stl'])

app = Flask(__name__,
            static_folder="../frontend/build/static",
            template_folder="../frontend/build")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            response = {
                'success': False,
                'error': 'No File Part'
            }
            return jsonify(response)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            response = {
                'success': False,
                'error': 'No File Selected'
            }
            return jsonify(response)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            response = {
                'success': True,
                'filename': filename
            }
            return jsonify(response)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")
