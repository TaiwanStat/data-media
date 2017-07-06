"""
merge dicts for jieba

Usage: python merge_dicts.py ../
"""
import json
import glob
import sys

def read_json(filename):
    with open(filename) as data_file:
        return json.load(data_file)
    
def write_dict(data):
    with open('../main_dict.txt','w',encoding='utf-8') as out:
        for key, val in data.items():
            out.write(key + ' ' + str(val) + '\n')

def main(directory):
    folder_dir = glob.glob("{}/*.txt".format(directory))
    tags_collection = {}
    with open('../main_dict.txt','w',encoding='utf-8') as outfile:
        for file in folder_dir:
            with open(file,'r',encoding='utf-8') as infile:
                for line in infile:
                        outfile.write(line)
    print('done.')

if __name__ == '__main__':
    directory = sys.argv[1]
    main(directory)
