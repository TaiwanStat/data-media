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


def get_csv_filelist(path):
    files_in_dir = [f for f in listdir(path) if isfile(join(path, f))]
    csv_files = []
    for filename in files_in_dir:
        if re.match('.*\.csv', filename):
            csv_files.append(filename)
    return csv_files


def read_csv_filelist(csv_files):
    data = []
    for filename in csv_files:
        reader = csv.DictReader(open(mypath+'/'+filename, 'r'))
        old_len = len(data)
        for line in reader:
            data.append(line)
    return data


def seg_data(data, stopwords):
    for article in data:
        seg_list = jieba.lcut(str(article['content']), cut_all=False)
        words_filtered = []

        for word in seg_list:
            if word not in stopwords and \
                len(word) > 1 and \
                    not word.isdigit():
                    words_filtered.append(word)

        article['content'] = ' '.join(words_filtered)
    return data


def get_top300_words(data):
    hash = {}

    for word in content:
        if word in hash:
            hash[word] += 1
        else:
            hash[word] = 1
    hash = sorted(hash.items(), key=lambda x: x[1], reverse=True)
    top_300_word = hash[:300]
    return top_300_word


if __name__ == '__main__':
    mypath = sys.argv[1]
    csv_files = get_csv_filelist(mypath)
    data = read_csv_filelist(csv_files)

    # set jieba config
    jieba.set_dictionary('dict.txt.big')
    jieba.analyse.set_stop_words('stop_words.txt')

    start_time = time.time()

    with open('stop_words.txt', 'r') as f:
        stopwords = f.read().splitlines()

    seg_data = seg_data(data.copy(), stopwords)

    content = [obj['content'] for obj in seg_data]
    # content_newline is for tag extract
    content_newline = '\n'.join(content)
    content = ' '.join(content)
    content = content.split()

    print('seg data is finished, cost:'+str(time.time()-start_time))
    start_time = time.time()

    top_300_word = get_top300_words(content)

    pprint.pprint(top_300_word)
    content_list = []
    content_list.append(top_300_word)

    with open('stop_words_toadd.txt', 'w') as outfile:
        for item in top_300_word:
            outfile.write("%s\n" % item[0])

    with open(sys.argv[2], 'w') as outfile:
        json.dump(content_list, outfile)

    time_interval = str(time.time() - start_time)
    print('Sort and dump data is finished, cost:' + time_interval)

    start_time = time.time()

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
