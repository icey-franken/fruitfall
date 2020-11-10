from flask import Blueprint, jsonify
from starter_app.models import db, Property, Access
from flask import json
feature_routes = Blueprint('feature', __name__)


@feature_routes.route('/')
def get_all():
    properties = Property.query.all()
    response = {'type': 'FeatureCollection', 'features': [
        prop.for_map() for prop in properties]}

    return response  # json.dumps(response)


@feature_routes.route('/<int:id>')
def get_one(id):
    print(id)
    popup_info = Property.query.filter(id == Property.id).one()
    response = popup_info.for_popup()

    return response
