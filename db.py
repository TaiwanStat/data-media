from utils.Mydb import Mydb
import csv
import json
import glob
import sys
import datetime

def read_json(filename):
    with open(filename) as data_file:
        return json.load(data_file)

def get_search_time(filename):
    file_time = filename[filename.rfind("_")+1:filename.rfind(".")]
    file_time = datetime.datetime.strptime(file_time,"%Y-%m-%d")
    search_date = file_time - datetime.timedelta(days=7)
    search_date = str(search_date)
    search_date = search_date.replace(" ",":")
    return search_date

data = read_json('config.json')

mydb = Mydb('postgresql', data["db_host"],  data["db_name"], data["db_user"], data["db_password"],5432)
table = data["db_table"]
directory = sys.argv[1]
folder_dir = glob.glob("{}/*.json".format(directory))

for json_file in folder_dir:
    search_date = get_search_time(json_file)
    f = read_json(json_file)
    for news_list in f:
        url = news_list["url"]
        column = list(news_list.keys())
        news = list(news_list.values())
        searched_column, searched_data = mydb.select("SELECT url FROM {} WHERE created_time >= '{}' and url = '{}'".format(table, search_date, url))
            
        if searched_data:
            continue
        else:
            mydb.insert(table, column, news)

mydb.close()
