# -*- coding: utf-8 -*-
import smtplib
import os
import json
import sys
import datetime

ROOTDIR = './mediaParser/output/'

TO = 'dino8556@gmail.com'
SENDER = 'minedia.tw@gmail.com'
SUBJECT = 'Minedia\'s data log: ' + datetime.datetime.now().strftime('%Y-%m-%d')
TEXT = ''


def read_json(f):
    with open(f, 'r') as file:
        body = file.read()
        return json.loads(body)

def verify_data_format():
    KEYS = ['category', 'content', 'website', 'date', 'url', 'title']
    global TEXT
    for subdir, dirs, files in os.walk(ROOTDIR):
        for filename in files:
            filename = ROOTDIR + filename
            if 'json' in filename:
                try:
                    data = read_json(filename)
                except Exception as e:
                    TEXT = ''.join((TEXT, '[error]read json,', filename, str(e)))
                    TEXT += '\n'
                    continue

                for d in data:
                    miss_keys = [k for k in KEYS if k not in d]
                    if miss_keys:
                        TEXT = ''.join((TEXT, '[error]miss data,', miss_keys, filename))
                        TEXT = '\n'.join((TEXT, d, ''))
                    try:
                        date_str = d['date'][:10].replace('/', '-')
                        news_date = datetime.datetime.strptime(
                            date_str, '%Y-%m-%d')
                    except Exception as e:
                        TEXT=''.join(
                            (TEXT, '[error]wrong date format,', d['date'], filename, str(e)))
                        TEXT += '\n\n'
                        continue

def main():
    global TEXT
    if not TEXT:
        TEXT = 'Congratulations! there is no error today.'
    verify_data_format()
    print(TEXT)


if __name__ == '__main__':
    main()
