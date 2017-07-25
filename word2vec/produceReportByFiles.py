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


medias = ['蘋果日報', '聯合報', '自由時報', '東森新聞雲', '中央通訊社']


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

        for news in news_data:
            # some news may have key error due to json load in strict=False
            try:
                url, date = news["url"], news['date'][:10].replace('/', '-')
            except Exception as e:
                continue
            news_date = datetime.datetime.strptime(date, '%Y-%m-%d')
            if not url:
                print('news not url: ' + json_file)
                continue
            if not date:
                print('news not date: ' + json_file)
                continue
            if not (news_date == file_date):
                print('news not today: ' + json_file)
                continue

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
        seg_list = jieba.lcut(news['content'], cut_all=False)
        words_filtered = [word for word in seg_list if word not in stopwords]
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
                    'date': news['date'],
                    'isProvocative': is_provocative,
                    'provocativeWords': provocative_words
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


def get_words_timeline(report):
    words_count = report['words_count']
    dates = []

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
                dates.append(date)
                word[3].append({
                    'website': m,
                    'time': date,
                    'count': count
                })
        for m in media:
            media_has_date = [d.date for d in word[3] if d['website'] == m]
            for date in dates:
                if date not in media_has_date:
                    word[3].append({
                        'website': m,
                        'time': date,
                        'count': 0,
                    })

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

def get_title_analysis(report, datas):

    word_clusters = read_json('cluster.json')

    news_amount = len(datas)
    counter = 0

    PROVOCATIVE_REF = '爽'
    PTT_IDIOM_REF = '鄉民'

    PROVOCATIVE_WORDS = get_clutsr_words(PROVOCATIVE_REF, word_clusters)
    PTT_IDIOM_WORDS = get_clutsr_words(PTT_IDIOM_REF, word_clusters)

    report['title_analysis'] = {}
    root = report['title_analysis']
    for media in medias:
        root[media] = {}
        root[media]['provocative'] = []
        root[media]['ptt_idiom'] = []
    for news in datas:
        title = news['title']
        media = news['website']
        url = news['url']
        try:
            seg_title = jieba.lcut(title, cut_all=False)
        except Exception as e:
            print(repr(e))
            continue

        provocative_set = compare_lists(seg_title, PROVOCATIVE_WORDS)
        if len(provocative_set) != 0:
            root[media]['provocative'].append({
                'media': media,
                'title': title,
                'url': url,
                'word': list(provocative_set)
            })

        ptt_set = compare_lists(seg_title, PTT_IDIOM_WORDS)
        if len(ptt_set) != 0:
            root[media]['ptt_idiom'].append({
                'media': media,
                'title': title,
                'url': url,
                'word': list(ptt_set)
            })
        counter += 1
        print('title analysis process: '+'('+str(counter)+'/'+str(news_amount)+')')

    return report


if __name__ == '__main__':
    directory = sys.argv[1]
    report = {}
    datas = read_data(directory)
    report = get_media_report(datas)
    report = cut_words_and_count(report, datas)
    report = get_words_timeline(report)
    report = get_title_analysis(report, datas)

    with open('../website/report.json', 'w') as outfile:
        json.dump(report, outfile)
