from try_database import seed_features, seed_types
from starter_app.models import User, Property, Type, Season, Access, FruitingStatus, Quality, Yield
from starter_app import app, db
from dotenv import load_dotenv
load_dotenv()

with app.app_context():
    db.drop_all()
    db.create_all()

    ian = User(username='Ian', email='ian@aa.io')
    javier = User(username='Javier', email='javier@aa.io')
    dean = User(username='Dean', email='dean@aa.io')
    angela = User(username='Angela', email='angela@aa.io')
    soonmi = User(username='Soon-Mi', email='soonmi@aa.io')
    alissa = User(username='Alissa', email='alissa@aa.io')

    db.session.add(ian)
    db.session.add(javier)
    db.session.add(dean)
    db.session.add(angela)
    db.session.add(soonmi)
    db.session.add(alissa)

    db.session.commit()

# add visited components - fruiting status, quality, and yield
    value_arr = [
        "Unsure",
        "Poor",
        "Fair",
        "Good",
        "Great",
        "Excellent",
    ]
    for value in value_arr:
        q = Quality(value=value)
        y = Yield(value=value)
        db.session.add(q)
        db.session.add(y)

    status_arr = ["Unsure/Other",
                  "Flowers",
                  "Unripe Fruit",
                  "Ripe Fruit",
                  ]

    for status in status_arr:
        s = FruitingStatus(value=status)
        db.session.add(s)
    db.session.commit()

# add months
    month_arr = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
    for month in month_arr:
        entry = Season(month=month)
        db.session.add(entry)
    db.session.commit()

# add access
    access_arr = [
        "Source is on my property",
        "I have permission from the owner to add the source",
        "Source is on public land",
        "Source is on private property but overhangs public land",
        "Source is on private property (ask before you pick)",
        "Unknown",
    ]
    for access in access_arr:
        entry = Access(access=access)
        db.session.add(entry)
    db.session.commit()

# add types
    types_arr = seed_types()
    for types in types_arr:
        type_db = Type(**types)
        db.session.add(type_db)
    db.session.commit()

# add features (Properties)
    properties = seed_features()

    for prop in properties:
        prop_db = Property(**prop)
        db.session.add(prop_db)
    db.session.commit()

    # prop = Property(Latitude=50.1234567890, Longitude=-90.12345678901234567890)
    # db.session.add(prop)
    # db.session.commit()
