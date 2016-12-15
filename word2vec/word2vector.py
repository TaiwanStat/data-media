# -*- coding: utf-8 -*-

import json
import re
import jieba
import jieba.analyse
import word2vec

jieba.set_dictionary('dict.txt.big')
jieba.analyse.set_stop_words('stop_words.txt')

data = json.loads(open('data.json').read())


corpus = [article['content'] for article in data]

corpus = '\n'.join(corpus)
seg_list = jieba.cut(corpus, cut_all=False)

with open('stop_words.txt', 'r') as f:
    stopwords = f.read().splitlines()

# filt stop word
temp = seg_list
words_filtered = [word for word in temp if word not in stopwords]

Output = data.copy()

for article in Output:
    seg_list = jieba.lcut(str(article['content']), cut_all=False)
    words_filtered = [word for word in seg_list if word not in stopwords]
    article['content'] = ' '.join(words_filtered);

with open('data_seg.json', 'w') as outfile:
    json.dump(Output, outfile)

# print word frequency
# hash = {}
# for word in words_filtered:
#     if word in hash:
#         hash[word] += 1
#     else:
#         hash[word] = 1

# for key, value in sorted(hash.items(), key=lambda x: x[1], reverse=False):
#     if '竟' in key:
#         print(key+':'+str(value))

# print('='*20+'關鍵詞提取'+'='*20)
# print('-'*40)
# print(' TF-IDF')
# print('-'*40)
# for x, w in jieba.analyse.extract_tags(corpus, withWeight=True):
#     print('%s %s' % (x, w))

# print('-'*40)
# print(' TextRank')
# print('-'*40)
# for x, w in jieba.analyse.textrank(corpus, withWeight=True):
#     print('%s %s' % (x, w))
