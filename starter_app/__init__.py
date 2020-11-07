import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from starter_app.models import db, User
from starter_app.api import user_routes, feature_routes

from starter_app.config import Config
MIGRATION_DIR = os.path.join('starter_app', 'models', 'migrations')

app = Flask(__name__)

app.config.from_object(Config)
CSRFProtect(app)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(feature_routes, url_prefix='/api/features')

db.init_app(app)
migrate = Migrate(app, db, directory=MIGRATION_DIR)

## Application Security
CORS(app)
@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')
@app.route('/api/csrf/restore')
def restore_csrf():
    return {'csrf_token': generate_csrf()}
