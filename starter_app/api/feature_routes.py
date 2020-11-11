from flask import Blueprint, jsonify
from starter_app.models import db, Property, Access, Type, Season
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


@feature_routes.route('/add-location-form', methods=['GET'])
def get_form_fields():
    types = Type.query.with_entities(
        Type.id, Type.en_name).order_by(Type.en_name).all()
    print(types)
    months = Season.query.with_entities(
        Season.id, Season.month).order_by(Season.id).all()
    accesses = Access.query.with_entities(
        Access.id, Access.access).order_by(Access.id).all()
    return {'types': types, 'months': months, 'accesses': accesses}
