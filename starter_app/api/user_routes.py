from flask import Blueprint, jsonify, request
from starter_app.models import User
from flask_login import current_user, login_required, login_user


user_routes = Blueprint('users', __name__)


# maybe remove this
@user_routes.route('/')
@login_required
def index():
    response = User.query.all()
    return {"users": [user.to_dict() for user in response]}


@user_routes.route('/<int:id>', methods=['GET', 'POST'])
def user_detail(id):
    return {}
