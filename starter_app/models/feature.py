from . import db
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


class Property(db.Model):
    __tablename__ = 'properties'

    # id from sql - NOT dataset
    id = db.Column(db.Integer, primary_key=True)
    type_ids = db.Column(db.Integer)
    Latitude = db.Column(db.Float, nullable=False)
    Longitude = db.Column(db.Float, nullable=False)
    unverified = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)
    author = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    import_link = db.Column(db.String(100))
    hidden = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'type': 'Feature',
            'properties': {
                'id': self.id,
                'type_ids': self.type_ids,
                'Latitude': self.Latitude,
                'Longitude': self.Longitude,
                'unverified': self.unverified,
                'description': self.description,
                'author': self.author,
                'created_at': self.created_at,
                'updated_at': self.updated_at,
                'import_link': self.import_link,
                'hidden': self.hidden,
            },
            'geometry': {
                'type': 'Point',
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
