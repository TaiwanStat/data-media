"""
turn tag data to dict for jieba

Usage: python tag_to_dict.py ../raw
"""
import json
import glob
import sys

def read_json(filename):
    with open(filename) as data_file:
        return json.load(data_file)
    
def write_dict(data):
    with open('../dict_from_tags.txt','w',encoding='utf-8') as out:
        for key, val in data.items():
            out.write(key + ' ' + str(val) + '\n')

def clean_tags(data):
    result = []
    for item in data:
        tags = item['tag']
        for tag in tags:
            if ' ' in tag:
                for t in tag.split():
                    result.append(t) 
            else:
                result.append(tag)
    result = [t.strip() for t in result]
    return result

def main(directory):
    folder_dir = glob.glob("{}/*.json".format(directory))
    tags_collection = {}
    for json_file in folder_dir:
        try:
            tag_data = read_json(json_file)
        except:
            print ('Cannot load file: '+json_file)
            continue

        tags = clean_tags(tag_data)

        for tag in tags:
            if not tag:
                continue
            if tag in tags_collection:
                tags_collection[tag] += 1
            else:
                tags_collection[tag] = 1
    
    write_dict(tags_collection)    
    print('done.')

if __name__ == '__main__':
    directory = sys.argv[1]
    main(directory)
