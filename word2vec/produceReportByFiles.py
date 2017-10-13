# -*- coding: utf-8 -*-
#!/usr/bin/env python

import glob
import json
import sys
import jieba
import time
import statistics
import re
import datetime
from operator import itemgetter
from pprint import pprint


medias = ['蘋果日報', '聯合報', '自由時報', '東森新聞雲', '中央通訊社', '中國時報']


def read_json(filename):
    with open(filename) as data_file:
        return json.load(data_file, strict=False)

def read_data(directory):
    folder_dir = glob.glob("{}/*.json".format(directory))
    newses = []
    for json_file in folder_dir:
        try:
            news_data = read_json(json_file)
        except:
            print('Cannot load file: '+json_file)
            continue
        date_str = re.search(r'_(\d+-\d+-\d+)\.json', json_file).group(1)
        file_date = datetime.datetime.strptime(date_str, '%Y-%m-%d')

        # DEBUG_NUM = 0

        for news in news_data:
            # some news may have key error due to json load in strict=False
            try:
                url, date = news["url"], news['date'][:10].replace('/', '-')
                news_date = datetime.datetime.strptime(date, '%Y-%m-%d')
            except Exception as e:
                print('error data:'+json_file+ ' / ' +str(e))
                continue
            if not url:
                print('news not url: ' + json_file)
                continue
            if not date:
                print('news not date: ' + json_file)
                continue
            if not (news_date == file_date):
                print('news not today: ' + json_file)
                continue

            # DEBUG_NUM += 1
            # if DEBUG_NUM >= 10:
            #     break

            newses.append(news)
    return newses


def get_media_report(datas):
    report = {}
    average_words = {}
    for media in medias:
        report[media] = {}
        average_words[media] = []
        report[media]['news_count'] = 0

    for news in datas:
        current_media = news['website']
        report[current_media]['news_count'] += 1
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
        if not average_words[media]:
            break
        mean = statistics.mean(average_words[media])
        median = statistics.median(average_words[media])
        print(media + ':')
        print('mean:'+str(mean))
        print('median:'+str(median)+'\n')
        report[media]['words_mean'] = mean
        report[media]['words_median'] = median

    return report


def cut_words_and_count(report, datas):
    # jieba custom setting.
    jieba.dt.cache_file = 'jieba.cache.new'
    jieba.load_userdict('dicts/dict_from_moe.txt')
    jieba.load_userdict('dicts/dict_from_tags.txt')

    word_clusters = read_json('cluster.json')

    PROVOCATIVE_REF = '爽'
    PROVOCATIVE_WORDS = get_clutsr_words(PROVOCATIVE_REF, word_clusters)

    start_time = time.time()
    stopwords = set()
    with open('stop_words.txt', 'r') as f:
        for line in f:
            stopwords.add(line.strip('\n'))
    with open('dicts/extra_stopwords.txt', 'r') as sw:
        for line in sw:
            stopwords.add(line.strip('\n'))
    with open('dicts/stopwords_by_hand.txt', 'r') as sw:
        for line in sw:
            stopwords.add(line.strip('\n'))
    seg_data = []
    for news in datas:
        seg_data.append(news)

    words_count = []
    words_index = []
    news_amount = len(seg_data)
    log_prefix = 'Sort and dump data is finished, cost:'
    counter = 0

    for news in seg_data:
        seg_list = jieba.lcut('' if news['title'] == None else news['title'], cut_all=False)
        words_filtered = [word for word in seg_list if word not in stopwords and word.strip()]
        words_filtered = [word for word in words_filtered if len(word) > 1]
        words_filtered = [word for word in words_filtered if not word.isdigit()]
        for word in words_filtered:
            if word in words_index:
                is_provocative = False 
                provocative_words = []
                try:
                    seg_title = jieba.lcut(news['title'], cut_all=False)
                except Exception as e:
                    print(repr(e))
                    continue

                provocative_set = compare_lists(seg_title, PROVOCATIVE_WORDS)
                if len(provocative_set) != 0:
                    is_provocative = True
                    provocative_words = list(provocative_set)
                index = words_index.index(word)
                item = words_count[index]
                item[1] += 1
                tmp = {
                    'media': news['website'],
                    'title': news['title'],
                    'url': news['url'],
                    'date': news['date'][:10].replace('/','-'),
                    'isProvocative': is_provocative,
                    'provocativeWords': provocative_words
                    }
                if tmp not in item[2]:
                    item[2].append(tmp)
            else:
                words_count.append([word, 1, [], {}, 0])
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

def get_buzzword(report, prev_words_count):
    words_count = report['words_count']
    min_count = words_count[-1][1]
    report['buzzword'] = {}
    buzzword = {'word':'','growth':0 }
    counter = 0
    news_count = {}
    for m in medias:
        news_count[m] = report[m]['news_count']
    for word_data in words_count:
        word = word_data[0]
        word_count = word_data[1]
        has_word = False
        for word_data2 in prev_words_count:
            word2 = word_data2[0]
            word_count2 = word_data2[1]
            if word == word2:
                has_word = True
                word_growth = word_count - word_count2
                if word_growth > buzzword['growth']:
                    buzzword['word'] = word
                    buzzword['growth'] = word_growth
                    buzzword['news_num'] = word_count2
                break
        if not has_word:
            word_growth = word_count - min_count
            if word_growth > buzzword['growth']:
                buzzword['word'] = word
                buzzword['growth'] = word_growth
                buzzword['news_num'] = min_count
        counter += 1
        print('get buzzword process: ' +'(' + str(counter) + '/' + str(len(words_count)) + ')')
    
    buzzword['provocativeRate'] = {}
    buzzword['isOutline'] = {}

    for word_data in words_count:
        word = word_data[0]
        news = word_data[2]
        timeline = word_data[3]
        if word == buzzword['word']:
            for media in medias:
                news_of_media = [ n for n in news if n['media'] == media]
                provocative_news = [ n for n in news if n['isProvocative'] and n['media'] == media]
                if len(news_of_media) != 0:
                    provocative_rate = len(provocative_news) / len(news_of_media)
                else:
                    provocative_rate = 0;
                buzzword['provocativeRate'][media] = provocative_rate
                buzzword['provocativeRate'][media] = provocative_rate
                buzzword['isOutline'][media] = is_outlinear(news_count, media, timeline)

    report['buzzword'] = buzzword
    return report


def get_words_timeline(report):
    words_count = report['words_count']
    dates = []
    counter = 0

    news_count = {}
    for m in medias:
        news_count[m] = report[m]['news_count']

    for word in words_count:
        d = {}
        for m in medias:
            word[3] = []
            d[m] = {}
        for news in word[2]:
            date = news['date'][:10]
            m = news['media']
            if date in d[m]:
                d[m][date] += 1
            else:
                d[m][date] = 1
        for m, media_date_count in d.items():
            for date, count in media_date_count.items():
                if date not in dates:
                    dates.append(date)
                word[3].append({
                    'website': m,
                    'time': date,
                    'count': count
                })
        for m in medias:
            media_has_date = [d['time'] for d in word[3] if d['website'] == m]
            for date in dates:
                if date not in media_has_date:
                    word[3].append({
                        'website': m,
                        'time': date,
                        'count': 0,
                    })
        counter += 1
        print('get words timeline process: ' + '(' + str(counter) + '/' + str(len(words_count)) + ')')
    for word in words_count:
         timeline = word[3]
         word[4] = {}
         for m in medias:
             word[4] = is_outlinear(news_count, m, timeline)

    return report

def index_of_word_in_nested_list(word, cluster_list):
    for l in cluster_list:
        for i in l:
            if word in i and len(word) == len(i):
                return cluster_list.index(l)
    return -1

def compare_lists(list1, list2):
    return set(list1) & set(list2)


def get_clutsr_words(word, cluster_list):
    index = index_of_word_in_nested_list(word, cluster_list)
    if index == -1:
        print('title analysis failed: not found key word in cluster.')
    return cluster_list[index]

def get_word_analysis_provocative(report, datas):

    word_clusters = read_json('cluster.json')

    news_amount = len(datas)
    counter = 0

    PROVOCATIVE_REF = '爽'
    PROVOCATIVE_WORDS = get_clutsr_words(PROVOCATIVE_REF, word_clusters)

    report['word_analysis'] = {}
    root = report['word_analysis']
    root['provocative'] = {}
    for media in medias:
        root['provocative'][media] = []
    
    words_count = report['words_count']
    for word_data in words_count:
        word = word_data[0]
        word_count = word_data[1]
        news = word_data[2]
        for media in medias:
            provocative_news = [ n for n in news if n['isProvocative'] and n['media']==media]
            news_of_media = [n for n in news if n['media'] == media]
            if len(news_of_media) != 0 and len(news_of_media) > 20:
                provocative_rate = len(provocative_news) / len(news_of_media)
            else:
                provocative_rate = 0
            root['provocative'][media].append({'word': word, 'rate': provocative_rate})
    for media in medias:
        root['provocative'][media] = sorted(
            root['provocative'][media], key=lambda d: d['rate'], reverse=True)[:10]
    return report


def is_outlinear(news_count, media, timeline):
    d = {}
    for m in medias:
        d[m] = [i['count'] / news_count[m] for i in timeline if i['website'] == m]
    d_list = [i for m in d for i in d[m]]
    for m in medias:
        d[m] = statistics.median(d[m])
    
    p25 = percentile(sorted(d_list), 0.25)
    p75 = percentile(sorted(d_list), 0.75)
    if d[media] < p25:
        result = -1
    elif d[media] > p75:
        result = 1
    else:
        result = 0
    return result


def percentile(N, P):
    n = max(int(round(P * len(N) + 0.5)), 2)
    return N[n - 2]


def get_word_analysis_outliner(report):
    report['word_analysis']['outliner'] = {}
    root = report['word_analysis']['outliner']
    words_count = report['words_count']
    news_count = {}
    for m in medias:
        news_count[m] = report[m]['news_count']

    news_num_filter = 300

    for media in medias:
        root[media] = {}

    for word_data in words_count[:30]:
        word = word_data[0]
        count = word_data[1]
        news = word_data[2]
        timeline = word_data[3]
        if count < news_num_filter:
            continue
        for media in medias:
            media_is_outlinear = is_outlinear(news_count, media, timeline)
            if media_is_outlinear:
                root[media][word] = {
                    'timeline' :  timeline,
                }

    return report


def get_data_time(report):

    report['time'] = {}

    timeline = report['words_count'][0][3]
    begin_date = datetime.datetime.today()
    end_date = datetime.datetime(2012, 1, 1)
    for t in timeline:
        t_date = datetime.datetime.strptime(t['time'], '%Y-%m-%d')
        if t_date < begin_date:
            begin_date = t_date
        if t_date > end_date:
            end_date = t_date
    
    report['time']['begin'] = begin_date.strftime('%Y-%m-%d')
    report['time']['end'] = end_date.strftime('%Y-%m-%d')

    return report


if __name__ == '__main__':
    data_directory = sys.argv[1]
    prev_report_direcrtory = sys.argv[2]

    with open(prev_report_direcrtory) as infile:
        prev_report = json.load(infile)
    prev_words_count = prev_report['words_count']
    prev_words_count = [ [news[0], news[1]] for news in prev_words_count]

    report = {}
    datas = read_data(data_directory)
    report = get_media_report(datas)
    report = cut_words_and_count(report, datas)
    report = get_words_timeline(report)
    report = get_buzzword(report, prev_words_count)
    report = get_word_analysis_provocative(report, datas)
    report = get_word_analysis_outliner(report)
    report = get_data_time(report)

    with open('../website/report.json', 'w') as outfile:
        json.dump(report, outfile)
