# -*- coding: utf-8 -*-
"""
ref: http://zake7749.github.io/2016/08/28/word2vec-with-gensim/
"""
import jieba
import logging

def main():

    logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)

    # jieba custom setting.
    jieba.dt.cache_file = 'jieba.cache.new'
    jieba.load_userdict('dicts/dict_from_moe.txt')
    jieba.load_userdict('dicts/dict_from_tags.txt')

    # load stopwords set
    stopwordset = set()
    with open('stop_words.txt','r',encoding='utf-8') as sw:
        for line in sw:
            stopwordset.add(line.strip('\n'))

    output = open('wiki_seg.txt','w')
    
    texts_num = 0
    
    with open('wiki_zh_tw.txt','r',encoding='utf-8') as content :
        for line in content:
            words = jieba.cut(line, cut_all=False)
            for word in words:
                if word not in stopwordset:
                    output.write(word +' ')
            texts_num += 1
            if texts_num % 10000 == 0:
                logging.info("已完成前 %d 行的斷詞" % texts_num)
    output.close()
    
if __name__ == '__main__':
	main()
