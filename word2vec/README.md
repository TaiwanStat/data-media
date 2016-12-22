#  Word2vec and Text cloud
## Develop
- stop_words.txt : custom stop words corpus in jieba keyword extraction
- dict.big.txt : custom the dictionary

##  Usage
1. Read the *.csv data in path
2. output the result after text segmentation
2. output the top 300 appeared-times words to 'stop_words_toadd'
```
$python word2vec.py <path of data folder> <filename of output seg_data>
# python word2vec.py . data_seg.json
```
