from . import db

class Season(db.Model):
    __tablename__='seasons'
    id = db.Column(db.Integer, primary_key=True)
    month = db.Column(db.String(10), nullable=False)
