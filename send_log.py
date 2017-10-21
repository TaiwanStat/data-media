# -*- coding: utf-8 -*-
import smtplib
import os
import json
import sys
import datetime

TO = 'dino8556@gmail.com'
SENDER = 'minedia.tw@gmail.com'
SUBJECT = 'Minedia\'s server log: ' + datetime.datetime.now().strftime('%Y-%m-%d')
ROOT = '/home/ubuntu/'

def get_server():
    SENDER = 'minedia.tw@gmail.com'
    PWD = 'keepgoing'

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.login(SENDER, PWD)
    return server

def read_file(f):
    with open(f, 'r') as file:
        body = file.read()
        return body

def get_mail():
    global ROOT
    TEXT = ''
    for subdir, dirs, files in os.walk(ROOT):
        for filename in files:
            filename = ROOT + filename
            if '.log' in filename:
                try:
                    log = read_file(filename)
                    TEXT += '[{0}]\n{1}\n'.format(filename, log)
                except Exception as e:
                    pass
    BODY = '\r\n'.join(['To: %s' % TO,
                        'From: %s' % SENDER,
                        'Subject: %s' % SUBJECT,
                        '', TEXT])
    return BODY.encode('utf-8')


def send_email():
    BODY = get_mail()
    server = get_server()
    try:

        server.sendmail(SENDER, [TO], BODY)
    except Exception as e:
        print('error sending mail:', str(e))
    server.quit()

def main():
    send_email()

if __name__ == '__main__':
    main()
