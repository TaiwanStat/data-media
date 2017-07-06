import csv
import json
import glob
import sys
import jieba
import pprint

def read_json(filename):
    with open(filename) as data_file:
        return json.load(data_file)

def collect_title_and_content(news):
    if not (news.get('title', None) and news.get('content', None)):
        return ''
    collection = ' '.join(jieba.cut(news['title'], cut_all=False)) + '\n' + ' '.join(jieba.cut(news['content'], cut_all=False))
    return collection

def main(directory):
    # jieba custom setting.
    jieba.dt.cache_file = 'jieba.cache.new'
    jieba.load_userdict('dicts/dict_from_moe.txt')
    jieba.load_userdict('dicts/dict_from_tags.txt')
    
    folder_dir = glob.glob("{}/*.json".format(directory))
    joined_news_dataes = []
    for json_file in folder_dir:
        try:
            news_data = read_json(json_file)
        except:
            print ('Cannot load file: '+json_file)
            continue
        news_data = map(collect_title_and_content, news_data)
        joined_news_data = '\n'.join(news_data)
        joined_news_dataes.append(joined_news_data)
    train_data = '\n'.join(joined_news_dataes)
    with open('word2vec_train_data.txt', 'w') as outfile:
        outfile.write(train_data)
    print('done.')

if __name__ == '__main__':
    directory = sys.argv[1]
    main(directory)