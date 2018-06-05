## Intro

This is a simple app that allows you to upload an .stl file, slice it using Slic3r, then parse the GCode file in order to make some basic cost estimations on the model.

_It doesn't determine if the model metric used is `mm` or `inches`. Assumes `mm`_

## Prerequisites

I've developed this on Mac OSX, so the instructions are currently tailored to that platform.
(In an ideal world, I would have put it into a Docker/VM for reuse)

_Homebrew needs to be installed - https://brew.sh/ _

- Python3 - `brew install python`
- Pipenv - `brew install pipenv`
- Redis - `brew install redis`
- Slicer - `https://dl.slic3r.org/dev/mac/slic3r-1.3.1-dev-9856947.dmg`

## Setup

- Open a terminal window
- Run `redis-server /usr/local/etc/redis.conf`

- Open a second terminal window
- Go to the `msource-demo/backup` directory
- Run `pipenv install`
- Run `pipenv shell`
- Run `celery -A run.celery worker -c 1`

- Open a this terminal window
- Go to the `msource-demo/backup` directory
- Run `pipenv shell`
- Run `FLASK_APP=run.py flask run`

- Open the url `http://127.0.0.1:5000/` in the browser
