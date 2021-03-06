
SLICER_PATH = '/Applications/Slic3r.app/Contents/MacOS/slic3r'
REDIS_SERVER_URL = 'localhost'
CELERY_BROKER_HOST = 'redis://%s:6379' % (REDIS_SERVER_URL)
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = set(['stl'])

PRICE_PER_HOUR = 2  # £ GBP
PRICE_PER_GRAM = 0.1  # £ GBP
