# -*- coding: utf-8 -*-
import json
import sys
import jieba
import jieba.analyse
import time
import re
import pprint
import statistics
from os import listdir
from os.path import isfile, join
import plotly.plotly as py
from plotly.graph_objs import *
import numpy as np
from operator import itemgetter, attrgetter
import datetime


def get_media_report(datas):
    report = {}
    average_words = {}
    for media in medias:
            report[media] = {}
            average_words[media] = []
            report[media]['news_count'] = 0

    for file in datas:
        current_media = file[0]['website']
        report[current_media]['news_count'] += len(file)
        for news in file:
            category = news['category']
            # DEBUG: Replace the condition to print the news
            # if category is None or category in 'condition':
            #     pprint.pprint(news)
            average_words[current_media].append(len(news['content']))
            tmp = report[current_media]
            tmp['category'] = tmp.get('category', {})
            tmp['category'][category] = tmp['category'].get(category, 0) + 1

    for media in medias:
        average_words[media].sort()
        if  not average_words[media]:
            break
        mean = statistics.mean(average_words[media])
        median = statistics.median(average_words[media])
        print(media + ':')
        print('mean:'+str(mean))
        print('median:'+str(median)+'\n')
        report[media]['words_mean'] = mean
        report[media]['words_median'] = median

        tr1 = Histogram(x=average_words[media], histnorm='percent', 
                    xbins=dict(start=np.min(average_words[media]), size= 200, end= np.max(average_words[media])),
                    marker=dict(color='rgb(0,0,100)'))

        title = media+" average words"

        layout = dict(
                    title=title,
                    autosize=True,
                    bargap=200,
                    height=600,
                    width=700,
                    hovermode='x',
                    xaxis=dict(
                        autorange=True,
                        zeroline=False),
                    yaxis=dict(
                        autorange=True,
                        showticklabels=True)
                   )
        fig1 = Figure(data=Data([tr1]), layout=layout)
        # UNCOMMENT: output chart in plotly
        # py.plot(fig1,filename=title)

    return report


def cut_words_and_count(report, datas):
    jieba.set_dictionary('dict.txt.big')
    jieba.analyse.set_stop_words('stop_words.txt')

    start_time = time.time()

    with open('stop_words.txt', 'r') as f:
        stopwords = f.read().splitlines()
    seg_data = []
    for file in datas:
        for news in file:
            seg_data.append(news)

    words_count = []
    words_index = []
    news_amount = len(seg_data)
    counter = 0

    for news in seg_data:
        seg_list = jieba.lcut(news['content'], cut_all=False)
        words_filtered = [word for word in seg_list if word not in stopwords]
        words_filtered = [word for word in words_filtered if len(word) > 1]
        words_filtered = [word for word in words_filtered if not word.isdigit()]
        for word in words_filtered:
            if(word in words_index):
                index = words_index.index(word)
                item = words_count[index]
                item[1] += 1
                tmp = {
                    'media': news['website'],
                    'title': news['title'],
                    'url': news['url'],
                    'date': news['date']
                    }
                if tmp not in item[2]:
                    item[2].append(tmp)
            else:
                words_count.append([word,1,[],{}])
                words_index.append(word)
        counter+=1
        print('('+str(counter)+'/'+str(news_amount)+')')

    print('seg data is finished, cost:'+str(time.time()-start_time))
    start_time = time.time()
    
    words_count = sorted(words_count, key=itemgetter(1), reverse=True)
    words_count = words_count[:300]

    # with open('stop_words_toadd.txt', 'w') as outfile:
    #     for item in words_count:
    #         outfile.write("%s\n" % item[0])
    report['words_count'] = words_count
    print('Sort and dump data is finished, cost:' + str(time.time() - start_time))
    return report


def get_words_timeline(report, datas, qtime):
    words_count = report['words_count']
    # aday = datetime.timedelta(1)
    # time_str = qtime.strftime("%d/%m/%Y")
    # qtime = qtime + aday

    for word in words_count:
        for media in medias:
            word[3][media] = {}
            word[3][media]['sum'] = 0 

    for word in words_count:
        for news in word[2]:
            date = news['date']
            media = news['media']
            if date in word[3][media]:
                word[3][media]['sum'] += 1
                word[3][media][date] += 1
            else:
                word[3][media]['sum'] = 1
                word[3][media][date] = 1

    return report


def read_data(path):
    files_in_dir = [f for f in listdir(path) if isfile(join(path, f))]
    data_names = []
    for filename in files_in_dir:
        if re.match('.*\.json', filename):
            data_names.append(filename)
    datas = []
    for file_name in data_names:
        datas.append(json.loads(open(path+file_name).read()))
    return datas


medias = ['蘋果日報', '聯合報', '自由時報', '東森新聞雲', '中央通訊社']

report = {}

datas = read_data(sys.argv[1])
qtime = datetime.datetime.strptime(sys.argv[2], "%Y-%m-%d")
date = sys.argv[1]
report = get_media_report(datas)
report = cut_words_and_count(report, datas)
report = get_words_timeline(report, datas,qtime)


with open('../website/report.json', 'w') as outfile:
    json.dump(report, outfile)
