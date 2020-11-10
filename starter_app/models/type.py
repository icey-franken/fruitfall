from . import db


class Type(db.Model):
    __tablename__ = 'types'

    id = db.Column(db.Integer, primary_key=True)

    # db_id = db.Column(db.Integer)

    # parent_id = db.Column(db.ForeignKey('types.id'))

    en_name = db.Column(db.String(200))
    en_synonyms = db.Column(db.String(200))
    en_wikipedia_url = db.Column(db.String(200))
    # change to fk to category table
    category_mask = db.Column(db.String(200))

    # the following are probably unnecessary
    scientific_name = db.Column(db.String(200))
    scientific_synonyms = db.Column(db.String(300))
    taxonomic_rank = db.Column(db.String(100))
    pending = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'type_name': self.en_name,
            'type_syn': self.en_synonyms,
            'type_url': self.en_wikipedia_url,
        }
