# -*- coding: utf-8 -*-
import os
import json
import sys

rootdir = './mediaParser/output/'

def read_json(f):
    with open(f, 'r') as file:
        body = file.read()
        body = body.replace('][', ',')
        return json.loads(body)

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, ensure_ascii=False)

import csv

def read_csv(file_name):
    data = []
    with open(file_name, 'r') as input_file:
        reader = csv.reader(input_file)
        for row in reader:
            data.append(row)
    return data[0] if len(data) == 1 else data

def write_csv(file_name, content):
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(content)

for subdir, dirs, files in os.walk(rootdir):
    for filename in files:
        filename = rootdir + filename
        if 'json' in filename:
            print(filename)

            urls = []
            try:
                data = read_json(filename)
            except Exception as e:
                print('fail,', filename, e)
                continue

            merge = []
            titles = {}
            for d in data:
                if d['title'] not in titles:
                    merge.append(d)
                    titles[d['title']] = True
            
            write_json(filename, merge)
