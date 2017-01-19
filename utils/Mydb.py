#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This module supports helpful functions for MYSQL database
"""
import sys
import logging
import psycopg2

class Mydb:
    def __init__(self, db_type, host, database, user, password, port):
        if db_type == 'postgresql':
            self.db = psycopg2.connect(host=host,
                                       database=database,
                                       user=user,
                                       password=password,
                                       port=port)
        else:
            logging.error('Mydb does not support the database type:'+db_type)
            sys.exit(1)
        self.cursor = self.db.cursor()

    def exe_sql(self, sql):
        self.cursor.execute(sql)

    def commit(self):
        self.db.commit()

    def select(self, sql):
        self.exe_sql(sql)
        field_names = [i[0] for i in self.cursor.description]
        return field_names, self.cursor.fetchall()

    def insert(self, table, cols, values):
        s_str = '%s, '*len(cols)
        sql = ("INSERT INTO {} ".format(table) +
               "({}) ".format(', '.join(cols)) +
               "VALUES ({})".format(s_str[:-2]))
        try:
            self.cursor.execute(sql, values)
        except psycopg2.Error as e:
            logging.error(e)

    def close(self):
        self.db.commit()
        self.cursor.close()
        self.db.close()
