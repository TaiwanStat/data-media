from utils.Mydb import Mydb
import json
import sys
import jieba
import pprint

with open('config.json') as data_file:
    data = json.load(data_file)
INDEX = ['url', 'title', 'date', 'content', 'category', 'website', 'created_time']

mydb = Mydb('postgresql', data['db_host'],
            data["db_name"], data['db_user'],
            data['db_password'], 5432)

jieba.set_dictionary('word2vec/dict.txt.big')

table = data['db_table']
searched_column, searched_data = mydb.select('SELECT * FROM {} limit 1'.format(table))
pprint.pprint(searched_data)
# print(searched_data)
# print(searched_column)
mydb.close()
titles = []
contents = []
news_has_empty = []

for news in searched_data:
    if news[1] and news[3]:
        titles.append(' '.join(jieba.cut(news[1], cut_all=False)))
        contents.append(' '.join(jieba.cut(news[3], cut_all=False)))
    else:
        news_has_empty.append(news_has_empty)

title_collection = "\n".join(titles)
content_collection = "\n".join(contents)

train_data = title_collection + '\n' + content_collection 

with open('word2vec/word2vec_train_data.txt', 'w') as outfile:
    outfile.write(train_data)
with open('word2vec/error_data.txt', 'w') as outfile:
    json.dump(news_has_empty, outfile)