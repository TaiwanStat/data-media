"""
Write media data from files to database.

Usage: python write_media_data_to_db.py <directory>
"""
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
    file_time = filename[filename.rfind('_')+1:filename.rfind('.')]
    file_time = datetime.datetime.strptime(file_time, '%Y-%m-%d')
    search_date = file_time - datetime.timedelta(days=7)
    search_date = str(search_date)
    search_date = search_date.replace(' ', ':')
    return search_date


def get_db(config_file):
    config = read_json(config_file)
    mydb = Mydb('postgresql', config['db_host'], config['db_name'],
                config['db_user'], config['db_password'], 5432)
    table = config["db_table"]
    return mydb, table


def main(directory, config_file):
    mydb, table = get_db(config_file)
    folder_dir = glob.glob("{}/*.json".format(directory))
    for json_file in folder_dir:
        search_date = get_search_time(json_file)
        f = read_json(json_file)
        for news_list in f:
            url = news_list["url"]
            column = list(news_list.keys())
            news = list(news_list.values())
            searched_column, searched_data = \
                mydb.select("SELECT url FROM {} WHERE created_time >= '{}'\
                             and url='{}'".format(table, search_date, url))
            if searched_data:
                continue
            else:
                mydb.insert(table, column, news)
    print('done.')
    mydb.close()


if __name__ == '__main__':
    directory = sys.argv[1]
    main(directory, config_file='config.json')
