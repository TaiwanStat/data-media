from utils.Mydb import Mydb
import json
import sys

with open('config.json') as data_file:
    data = json.load(data_file)

mydb = Mydb('postgresql', data['db_host'],
            data["db_name"], data['db_user'],
            data['db_password'], 5432)

table = data['db_table']
searched_column, searched_data = mydb.select('SELECT * FROM {} limit 10'
                                             .format(table))
print(searched_data)
print(searched_column)
mydb.close()
