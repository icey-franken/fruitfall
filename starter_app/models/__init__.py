from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from .user import User
from .type import Type
from .access import Access
from .season import Season
from .feature import Property
