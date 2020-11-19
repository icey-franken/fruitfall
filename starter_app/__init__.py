import os
from flask import Flask, render_template, request, session, jsonify
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_login import (
    LoginManager,
    current_user,
    login_user,
    logout_user,
    login_required
)

from starter_app.models import db, User
from starter_app.api import user_routes, feature_routes

from starter_app.config import Config

app = Flask(__name__)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(feature_routes, url_prefix='/api/features')

db.init_app(app)
login_manager = LoginManager(app)

# migrate = ---no need to save as var
MIGRATION_DIR = os.path.join('starter_app', 'models', 'migrations')
Migrate(app, db, directory=MIGRATION_DIR)

# Application Security
# CORS(app)
# cors or csrf protect?
CSRFProtect(app)

# remove this if we have csrfprotect?
# @app.after_request
# def inject_csrf_token(response):
#     response.set_cookie('csrf_token',
#                         generate_csrf(),
#                         secure=True if os.environ.get('FLASK_ENV') else False,
#                         samesite='Strict' if os.environ.get(
#                             'FLASK_ENV') else None,
#                         httponly=True)
#     print(response.headers)

#     return response


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


@app.route('/api/csrf/restore')
def restore_csrf():
    id = current_user.id if current_user.is_authenticated else None
    return {'csrf_token': generate_csrf(), 'current_user_id': id}

# move to user_routes?
# should only be post request?


@app.route('/login', methods=['GET', 'POST'])
def login():
    if not request.is_json:
        # return jsonify({"msg": "Missing JSON in request"}), 400
        return {"msg": "Missing JSON in request"}, 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return {'errors': ['Missing username/email or password']}, 400

    authenticated, user = User.authenticate_email(
        username, password) if '@' in username else User.authenticate_username(username, password)

    if authenticated:
        login_user(user)
        return {'current_user_id': current_user.id}
    else:
        if user is None:
            return {'errors': {'username': 'Invalid username/email'}}, 401
        else:
            return {'errors': {'password': 'Invalid password'}}, 401


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return {'msg': 'Successfully logged out'}, 200


@app.route('/signup', methods=['POST'])
def signup():
    email = request.json.get('email', None)
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not email or not username or not password:
        return {'errors': ['Missing email, username, or password']}, 400
    try:

        user = User(email=email, username=username, password=password)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return {'current_user_id': current_user.id}, 201
    except Exception as ex:
        if type(ex).__name__ == 'IntegrityError':
            return {'errors': ['That email or username is already in use. Please try again.']}
        else:
            return {'errors': ['An unknown error occurred. Please clear your cookies and refresh the page.']}
