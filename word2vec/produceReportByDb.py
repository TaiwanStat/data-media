# -*- coding: utf-8 -*-

from gensim.models import word2vec
from gensim import models
from utils.Mydb import Mydb
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

medias = ['蘋果日報', '聯合報', '自由時報', '東森新聞雲', '中央通訊社']
model_path = 'word2vec/vectors.bin'
model = models.Word2Vec.load_word2vec_format(model_path, binary=True)
jieba.set_dictionary('word2vec/dict.txt.big')


def read_data():
    with open('config.json') as data_file:
        data = json.load(data_file)

    mydb = Mydb('postgresql', data['db_host'],
                data['db_name'], data['db_user'],
                data['db_password'], 5432)

    table = data['db_table']
    # DEBUG: make sure the latest updated data
    # select_code = "SELECT * from {} order by date desc limit 1"
    select_code = '''SELECT * FROM {}
                     WHERE date BETWEEN
                     NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-50
                     AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER'''
    searched_column, searched_data = mydb.select(select_code.format(table))
    print('select '+str(len(searched_data))+' news')
    return searched_column, searched_data


def get_media_report(columns, datas):
    report = {}
    average_words = {}
    for media in medias:
            report[media] = {}
            average_words[media] = []
            report[media]['news_count'] = 0

    for news in datas:
        current_media = news[columns.index('website')]
        report[current_media]['news_count'] += 1
        category = news[columns.index('category')]
        # DEBUG: Replace the condition to print the news
        # if category is None or category in 'condition':
        #     pprint.pprint(news)
        average_words[current_media].append(len(news[columns.index('content')]))
        tmp = report[current_media]
        tmp['category'] = tmp.get('category', {})
        tmp['category'][category] = tmp['category'].get(category, 0) + 1

    for media in medias:
        average_words[media].sort()
        if not average_words[media]:
            break
        mean = statistics.mean(average_words[media])
        median = statistics.median(average_words[media])
        print(media + ':')
        print('mean:'+str(mean))
        print('median:'+str(median)+'\n')
        report[media]['words_mean'] = mean
        report[media]['words_median'] = median
        # DEBUG: plot a chart to observe the data
        # tr1 = Histogram(x=average_words[media], histnorm='percent', 
        #             xbins=dict(start=np.min(average_words[media]), size= 200, end= np.max(average_words[media])),
        #             marker=dict(color='rgb(0,0,100)'))
        # title = media+' average words'
        # layout = dict(
        #             title=title,
        #             autosize=True,
        #             bargap=200,
        #             height=600,
        #             width=700,
        #             hovermode='x',
        #             xaxis=dict(
        #                 autorange=True,
        #                 zeroline=False),
        #             yaxis=dict(
        #                 autorange=True,
        #                 showticklabels=True)
        #            )
        # fig1 = Figure(data=Data([tr1]), layout=layout)
        # UNCOMMENT: output chart in plotly
        # py.plot(fig1,filename=title)

    return report


def cut_words_and_count(report, columns, datas):
    jieba.set_dictionary('word2vec/dict.txt.big')
    jieba.analyse.set_stop_words('word2vec/stop_words.txt')

    start_time = time.time()

    with open('word2vec/stop_words.txt', 'r') as f:
        stopwords = f.read().splitlines()
    seg_data = []
    for news in datas:
        seg_data.append(news)

    words_count = []
    words_index = []
    news_amount = len(seg_data)
    log_prefix = 'Sort and dump data is finished, cost:'
    counter = 0

    for news in seg_data:
        seg_list = jieba.lcut(news[columns.index('content')], cut_all=False)
        words_filtered = [word for word in seg_list if word not in stopwords]
        words_filtered = [word for word in words_filtered if len(word) > 1]
        words_filtered = [word for word in words_filtered if not word.isdigit()]
        for word in words_filtered:
            if(word in words_index):
                index = words_index.index(word)
                item = words_count[index]
                item[1] += 1
                item_date = news[columns.index('date')].strftime('%Y-%m-%d')
                tmp = {
                    'media': news[columns.index('website')],
                    'title': news[columns.index('title')],
                    'url': news[columns.index('url')],
                    'date': item_date
                    }
                if tmp not in item[2]:
                    item[2].append(tmp)
            else:
                words_count.append([word, 1, [], {}])
                words_index.append(word)
        counter += 1
        print('cut& count process: '+'('+str(counter)+'/'+str(news_amount)+')')

    print(log_prefix+str(time.time()-start_time))
    start_time = time.time()

    words_count = sorted(words_count, key=itemgetter(1), reverse=True)
    words_count = words_count[:300]

    # with open('stop_words_toadd.txt', 'w') as outfile:
    #     for item in words_count:
    #         outfile.write("%s\n" % item[0])
    report['words_count'] = words_count
    print('' + str(time.time() - start_time))
    return report


def get_words_timeline(report, columns, datas):
    words_count = report['words_count']

    for word in words_count:
        dict = {}
        for m in medias:
            word[3] = []
            dict[m] = {}
        for news in word[2]:
            date = news['date']
            m = news['media']
            if date in dict[m]:
                dict[m][date] += 1
            else:
                dict[m][date] = 1
        for m, dates in dict.items():
            for date, count in dates.items():
                word[3].append({
                    'website': m,
                    'time': date,
                    'count': count
                })
    return report


def findCloseDistWord(REFs, seg_words):
    
    breakpoint = 0.8
    index = -1
    max_similarity = 0
    match_ref = ''
    for idx, word in enumerate(seg_words):
        try:
            for ref in REFs:
                similarity = model.similarity(word, ref)
                if(similarity <= breakpoint):
                    continue
                if(similarity > max_similarity):
                    max_similarity = similarity
                    index = idx
                    match_ref = ref
        except Exception as e:
            print(repr(e))
    return index, match_ref, max_similarity


def get_title_analysis(report, columns, datas):

    news_amount = len(datas)
    counter = 0

    PROVOCATIVE_REF = ['超', '傻眼', '竟', '...', '驚呆', '！', '？',
                       '直呼', '疑', '傻眼', '痛批']
    PTT_IDIOM_REF = ['狂', '網友', '鄉民']

    report['title_analysis'] = {}
    root = report['title_analysis']
    for media in medias:
        root[media] = {}
        root[media]['provocative'] = []
        root[media]['ptt_idiom'] = []
    for news in datas:
        title = news[columns.index('title')]
        media = news[columns.index('website')]
        url = news[columns.index('url')]
        try:
            seg_title = jieba.lcut(title, cut_all=False)
        except Exception as e:
            print(repr(e))
            continue

        index, ref, sim = findCloseDistWord(PROVOCATIVE_REF, seg_title)
        if(index != -1):
            root[media]['provocative'].append({
                    'media': media,
                    'title': title,
                    'url': url,
                    'word': seg_title[index],
                    'ref': ref,
                    'sim': sim
                })
        index, ref, sim = findCloseDistWord(PTT_IDIOM_REF, seg_title)
        if(index != -1):
            root[media]['ptt_idiom'].append({
                    'media': media,
                    'title': title,
                    'url': url,
                    'word': seg_title[index],
                    'ref': ref,
                    'sim': sim
                })
        counter+=1
        print('title analysis process: '+'('+str(counter)+'/'+str(news_amount)+')')

    return report


if __name__ == '__main__':
    report = {}

    columns, datas = read_data()
    report = get_media_report(columns, datas)
    report = cut_words_and_count(report, columns, datas)
    report = get_words_timeline(report, columns, datas)
    report = get_title_analysis(report, columns, datas)

    with open('website/report.json', 'w') as outfile:
        json.dump(report, outfile)
