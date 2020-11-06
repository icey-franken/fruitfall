from flask import Blueprint, jsonify
from starter_app.models import Property
from flask import json
feature_routes = Blueprint('feature', __name__)


@feature_routes.route('/')
def get_all():
    properties = Property.query.all()
    response = {'type': 'FeatureCollection', 'features': [
                          prop.to_dict() for prop in properties]}

    return json.dumps(response)


@feature_routes.route('/<int:id>', methods=['GET', 'POST'])
def user_detail(id):
    return {}
