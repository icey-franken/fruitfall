from . import db, Type, Access
from dataclasses import dataclass
from datetime import datetime
# @dataclass


# class Feature(db.Model):
#     __tablename__ = 'features'

#     id = db.Column(db.Integer, primary_key=True)

#     properties = db.relationship("Property", backref='features')

#     geometry = db.relationship('Geometry', backref='features')

#     def to_dict(self):
#         return {
#             'type': 'feature',
#             'properties': self.properties.to_dict(),
#             'geometry': self.geometry.to_dict()
#         }


# add defaults!
# add separate models for:
#   type_ids, season, access
class Property(db.Model):
    __tablename__ = 'properties'

    # id from sql - NOT dataset
    id = db.Column(db.Integer, primary_key=True)

    # change to type foreign key
    # falling fruit allows multiple types - we do not.
    type_ids = db.Column(db.ForeignKey('types.id', ondelete='cascade'))
    types = db.relationship('Type', backref='properties')

    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    unverified = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)

    # change to foreign key referencing a user
    # if anonymous - default to a "anonymous" user
    author = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    import_link = db.Column(db.String(200))
    hidden = db.Column(db.Boolean, default=False)
    no_season = db.Column(db.Boolean, default=False)

    date_visited = db.Column(db.DateTime, default=None)

    fruiting_status_id = db.Column(db.ForeignKey(
        'fruiting_statuses.id'), nullable=True, default=None)
    yield_id = db.Column(db.ForeignKey('yields.id'),
                         nullable=True, default=None)
    quality_id = db.Column(db.ForeignKey('qualities.id'),
                           nullable=True, default=None)

# we're not including address - lat/lon and description is plenty
# address = db.Column(db.Text)


    # change to season foreign key
    season_start_id = db.Column(db.ForeignKey(
        'seasons.id'), nullable=True, default=None)
    season_stop_id = db.Column(db.ForeignKey(
        'seasons.id'), nullable=True, default=None)
    season_stop = db.relationship('Season',  foreign_keys=[
        season_stop_id], backref='properties')
    season_start = db.relationship('Season',  foreign_keys=[
        season_start_id])

    # change to access foreign key
    access_id = db.Column(db.ForeignKey('accesses.id'), nullable=False)
    access = db.relationship('Access', backref='properties')

    # should we just send coords and convert to geojson on frontend?
    def for_map(self):
        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [self.longitude, self.latitude]
            },
            'properties': {
                'id': self.id,
            }
        }

    def for_map_just_coords(self):
        return{
            'id': self.id,
            'coordinates': [self.longitude, self.latitude]
        }

    def for_map_just_coords_small(self):
        return f'{self.id} {self.longitude} {self.latitude}'

    def for_popup(self):
        start_month = None
        stop_month = None

        if self.season_start_id:
            start_month = self.season_start.month
        if self.season_stop_id:
            stop_month = self.season_stop.month

        return {
            'properties': {
                'id': self.id,
                **self.types.to_dict(),
                'latitude': self.latitude,
                'longitude': self.longitude,
                'unverified': self.unverified,
                'description': self.description,
                'author': self.author,
                'created_at': self.created_at,
                'updated_at': self.updated_at,
                'import_link': self.import_link,
                'hidden': self.hidden,
                'no_season': self.no_season,
                'season_start': start_month,
                'season_stop': stop_month,
                'access': self.access.access,
            },
        }

    def for_all(self):
        return {
            'type': 'Feature',
            'properties': {
                'id': self.id,
                'type_ids': self.type_ids,
                'latitude': self.latitude,
                'longitude': self.longitude,
                'unverified': self.unverified,
                'description': self.description,
                'author': self.author,
                'created_at': self.created_at,
                'updated_at': self.updated_at,
                'import_link': self.import_link,
                'hidden': self.hidden,
                'no_season': self.no_season,
                'season_start': self.season_start,
                'season_stop': self.season_stop,
                'access': self.access,
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [self.longitude, self.latitude]
            }
        }

# class Geometry(db.Model):
#     __tablename__ = 'geometry'

#     id = db.Column(db.Integer, primary_key=True)

#     feature_id = db.Column(db.ForeignKey(
#         'features.id', ondelete='cascade'), nullable=False)

#     property_id = db.Column(db.ForeignKey())
#     properties = db.relationship('Property', backref='geometry')

#     def to_dict(self):
#         return {
#             'type': 'Point',
#             'coordinates': [
#                 self.properties.Latitude,
#                 self.properties.Longitude
#             ]
#         }
