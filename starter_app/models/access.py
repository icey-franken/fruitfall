from . import db


class Access(db.Model):
    __tablename__ = 'accesses'

    id = db.Column(db.Integer, primary_key=True)
    access = db.Column(db.Text, nullable=False)
