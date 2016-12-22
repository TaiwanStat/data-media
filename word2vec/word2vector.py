# -*- coding: utf-8 -*-
"""
argv[1] = folder path of data(*.csv), argv[2] = file path of output seg_data
"""
from os import listdir
from os.path import isfile, join
import os
import json
import re
import jieba
import jieba.analyse
import word2vec
import sys
import csv
import pprint
import time

media_list = ['聯合報', '蘋果日報', '自由時報', '中央通訊社']

# collect input data
mypath = sys.argv[1]

files_in_dir = [f for f in listdir(mypath) if isfile(join(mypath, f))]

csv_files = []
for filename in files_in_dir:
    if re.match('.*\.csv', filename):
        csv_files.append(filename)

data = []

for filename in csv_files:
    reader = csv.DictReader(open(mypath+filename, 'r'))
    old_len = len(data)
    for line in reader:
        data.append(line)

# set jieba
jieba.set_dictionary('dict.txt.big')
jieba.analyse.set_stop_words('stop_words.txt')

start_time = time.time()

with open('stop_words.txt', 'r') as f:
    stopwords = f.read().splitlines()

seg_data = data.copy()

for article in seg_data:
    seg_list = jieba.lcut(str(article['content']), cut_all=False)
    words_filtered = [word for word in seg_list if word not in stopwords]
    words_filtered = [word for word in words_filtered if len(word) > 1]
    words_filtered = [word for word in words_filtered if not word.isdigit()]
    article['content'] = ' '.join(words_filtered)

content_list = []
content = [obj['content'] for obj in seg_data]
content_newline = '\n'.join(content)
content = ' '.join(content)
content = content.split()

print('seg data is finished, cost:'+str(time.time()-start_time))
start_time = time.time()

hash = {}

for word in content:
    if word in hash:
        hash[word] += 1
    else:
        hash[word] = 1
hash = sorted(hash.items(), key=lambda x: x[1], reverse=True)
top_300_word = hash[:300]
pprint.pprint(top_300_word)
content_list.append(top_300_word)

with open('stop_words_toadd.txt', 'w') as outfile:
    for item in top_300_word:
        outfile.write("%s\n" % item[0])

with open(sys.argv[2], 'w') as outfile:
    json.dump(content_list, outfile)


print('Sort and dump data is finished, cost:' + str(time.time() - start_time))

start_time = time.time()

print('='*20+'關鍵詞提取'+'='*20)
print('-'*40)
print(' TF-IDF')
print('-'*40)
for x, w in jieba.analyse.extract_tags(content_newline, withWeight=True):
    print('%s %s' % (x, w))

print('TF-IDF is finished, cost:'+str(time.time()-start_time))

start_time = time.time()
print('-'*40)
print(' TextRank')
print('-'*40)
for x, w in jieba.analyse.textrank(content_newline, withWeight=True):
    print('%s %s' % (x, w))

print('TextRank is finished, cost:'+str(time.time()-start_time))
