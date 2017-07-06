# -*- coding: utf-8 -*-
import logging
import sys
import json

def main():

    if len(sys.argv) != 2:
        print("Usage: python3 " + sys.argv[0] + " moe_dict_data_path")
        exit()

    logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
    
    texts_num = 0
    
    with open("dict_from_moe.txt",'w',encoding='utf-8') as output, open(sys.argv[1], 'r') as moe_raw_data:
        data = json.load(moe_raw_data)
        for item in data:
            title = item['title']
            if '{' not in title:
                output.write(title + '\n')
            texts_num += 1
            if texts_num % 10000 == 0:
                logging.info("已處理 %d 篇文章" % texts_num)
if __name__ == "__main__":
    main()