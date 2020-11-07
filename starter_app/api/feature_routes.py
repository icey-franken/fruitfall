from flask import Blueprint, jsonify
from starter_app.models import Property
from flask import json
feature_routes = Blueprint('feature', __name__)


@feature_routes.route('/')
def get_all():
    properties = Property.query.all()
    response = {'type': 'FeatureCollection', 'features': [
        prop.for_map_just_coords_small() for prop in properties]}

    return json.dumps(response)


@feature_routes.route('/<int:id>')
def get_one(id):
    popup_info = Property.query.one_or_none(int(id))
    response = {'properties': popup_info.for_popup()}

    return json.dumps(response)


@feature_routes.route('/<int:id>', methods=['GET', 'POST'])
def user_detail(id):
    return {}
