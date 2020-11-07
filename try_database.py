import json
from datetime import datetime


def read_in_chunks(file_object, chunk_size=1024):
    """Lazy function (generator) to read a file piece by piece.
    Default chunk size: 1k."""
    while True:
        data = file_object.read(chunk_size)
        if not data:
            break
        yield data


def seed_features():

    data = ''
    with open('locations_MN_array.txt', 'r') as f:
        for piece in read_in_chunks(f):
            # print(piece)
            data += piece
    python_data = json.loads(data)

    data_arr = python_data['FeatureList']
    property_arr = [data['properties'] for data in data_arr]

    set_of_props = set()
    for prop in property_arr:
        keys = list(prop.keys())

        for key in keys:
            set_of_props.add(key)

        # bad_property = property_arr[i]
        bool_vals = ['unverified', 'hidden', 'no_season']
        for bool_val in bool_vals:
            if bool_val in keys:
                prop[bool_val] = False if prop[bool_val] == 'FALSE' else True

        # type_id will become a foreign key
        int_vals = ['id', 'type_ids']
        for int_val in int_vals:
            if int_val in keys:
                if int_val == 'type_ids':
                    string = prop[int_val]
                    if ',' in string:
                        array = string.split(',')
                        int_array = [int(i) for i in array]
                        prop[int_val] = int_array
                    else:
                        prop[int_val] = [int(string)]
                else:
                    prop[int_val] = int(prop[int_val])
                # print(prop)

        float_vals = ['Latitude', 'Longitude']
        for float_val in float_vals:
            if float_val in keys:
                prop[float_val] = float(prop[float_val])

        # convert these to date time objects
        date_vals = ['created_at', 'updated_at']
        for date_val in date_vals:
            if date_val in keys:
                # cut off ' UTC'
                date_time_str = prop[date_val][:-4]
                date_time_obj = datetime.strptime(
                    date_time_str, '%Y-%m-%d %H:%M:%S')

                prop[date_val] = date_time_obj
        prop.pop('address')
        # for now we leave these as strings! Eventually convert to foreign key
        month_vals = ['season_start', 'season_stop']

        # converting access and author to foreign keys would be ideal
        string_vals = ['address', 'access',
                       'import_link', 'author', 'description']

    return property_arr
