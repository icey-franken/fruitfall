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


def load_data(file_string):
    data = ''
    with open(file_string, 'r') as f:
        for piece in read_in_chunks(f):
            data += piece
    python_data = json.loads(data)
    return python_data


def seed_types():
    data_arr = load_data('types-small.json')
    set_of_props = set()

    for data in data_arr:
        keys = list(data.keys())
        for key in keys:
            set_of_props.add(key)
        if 'id' not in keys:
            print('no id!')
        bool_vals = ['pending']
        for bool_val in bool_vals:
            if bool_val in keys:
                data[bool_val] = False if data[bool_val] == 'FALSE' else True
        del data['parent_id']
        # if data['parent_id'] == '':
        # data['parent_id'] = 0
        # int_vals = ['id', 'parent_id']
        # for int_val in int_vals:
        #     if int_val in keys:
        #         string = data[int_val]
        #         if ',' in string:
        #             array = string.split(',')
        #             int_array = [int(i) for i in array]
        #             # we only take the first type id
        #             data[int_val] = int_array[0]
        #         else:
        #             data[int_val] = int(string)

        # print(prop)
    # sorted_data_arr = sorted(data_arr, key=lambda i: i['id'], reverse=True)
    # for data in sorted_data_arr:
    #     if data['parent_id'] == 0:
    #         data['parent_id'] = None

    return data_arr
    # print(set_of_props)


seed_types()


def seed_features():
    python_data = load_data('locations_MN_under10000-geo.txt')

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
                        # we only take the first type id
                        prop[int_val] = int_array[0]
                    else:
                        prop[int_val] = int(string)
                else:
                    prop[int_val] = int(prop[int_val])
                # print(prop)

        float_vals = ['latitude', 'longitude']
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
        prop.pop('address', None)
        # for now we leave these as strings! Eventually convert to foreign key
        month_vals = ['season_start', 'season_stop']
        month_arr = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']
        for month_val in month_vals:
            if month_val in keys:
                month_idx = month_arr.index(prop[month_val])
                prop[month_val] = int(month_idx)
        access_arr_db = [
            "Added by owner",
            "Permitted by owner",
            "Public",
            "Private but overhanging",
            "Private",
            "I don't know",
        ]
        if 'access' in keys:
            access_idx = access_arr_db.index(prop['access'])+1
            prop['access'] = int(access_idx)
        else:
            prop['access'] = 6
        # converting access and author to foreign keys would be ideal
        string_vals = ['address',
                       'import_link', 'author', 'description']

    return property_arr


seed_features()
