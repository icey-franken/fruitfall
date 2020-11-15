from . import db

class FruitingStatus(db.Model):
    __tablename__='fruiting_statuses'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(15), nullable=False)

class Quality(db.Model):
    __tablename__='qualities'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(15), nullable=False)


class Yield(db.Model):
    __tablename__='yields'
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.String(15), nullable=False)
