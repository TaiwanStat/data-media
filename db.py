from utils.Mydb import Mydb
import csv
import json
import glob
import sys
import datetime

with open('config.json') as data_file:
    data = json.load(data_file)

mydb = Mydb('postgresql', data["db_host"],  data["db_name"], data["db_user"], data["db_password"],5432)
table = data["db_table"]
directory = sys.argv[1]
folder_dir = glob.glob("{}/*.csv".format(directory))

for csv_file in folder_dir:
    file_time = csv_file[csv_file.rfind("_")+1:csv_file.rfind(".")]
    file_time = datetime.datetime.strptime(file_time,"%Y-%m-%d")
    search_date = file_time - datetime.timedelta(days=7)
    search_date = str(search_date)
    search_date = search_date.replace(" ",":")
    with open(csv_file, 'r') as f:
        reader = csv.reader(f)
        news_list = list(reader)
        column = news_list[0]
        news_list.pop(0)
        
        url_pos = 0
        for i in range(0, len(column)):
            if column[i] == 'url':
                url_pos = i
                break

        print(csv_file)
        for news in news_list:
            url = news[url_pos]
            searched_column, searched_data = mydb.select("SELECT url FROM {} WHERE created_time >= '{}' and url = '{}'".format(table, search_date, url))

            if searched_data:
                continue
            else:
                mydb.insert(table, column, news)

mydb.close()
