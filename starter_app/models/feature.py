from . import db
from dataclasses import dataclass

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


class Property(db.Model):
    __tablename__ = 'properties'


    # id from sql - NOT dataset
    id = db.Column(db.Integer, primary_key=True)

    # feature_id = db.Column(db.ForeignKey(
    #     'features.id', ondelete='cascade'), nullable=False)

    # geometry_id = db.Column(db.ForeignKey(
    #     'geometry.id', ondelete='cascade'), nullable=False)
    Latitude = db.Column(db.Float, nullable=False)
    Longitude = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'type': 'Feature',
            'properties': {

                'id': self.id,
                'Latitude': self.Latitude,
                'Longitude': self.Longitude,
            },
            'geometry': {
                'type':'Point',
                'coordinates': [self.Latitude, self.Longitude]
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
