#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This module supports helpful functions for MYSQL database
"""
import sys
import logging

import MySQLdb
import psycopg2


class Mydb:
    def __init__(self, db_type, host, database, user, password, port):
        if db_type == 'mysql':
            self.db = MySQLdb.connect(host=host,
                                      db=database,
                                      user=user,
                                      passwd=password,
                                      port=port)
        elif db_type == 'postgresql':
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
        try:
            self.cursor.execute(sql)
        except MySQLdb.Error as e:
            logging.error(e)

    def commit(self):
        self.db.commit()

    def select(self, sql):
        self.exe_sql(sql)
        field_names = [i[0] for i in self.cursor.description]
        return field_names, self.cursor.fetchall()

    def insert(self, table, cols, values):
        sql = "INSERT INTO %s (%s" % (table, cols[0])

        for i in range(1, len(cols)):
            sql += "," + cols[i]

        sql += ") VALUES ("
        for i in range(0, len(values)):
            try:
                sql += "'" + values[i] + "',"
            except TypeError:
                sql += "'" + str(values[i]) + "',"
            except UnicodeDecodeError:
                values[i] = values[i].decode('utf-8').encode('utf-8')
                sql += "'" + values[i] + "',"

        sql = sql[0:len(sql)-1] + ");"
        self.exe_sql(sql)

    def close(self):
        self.db.commit()
        self.cursor.close()
        self.db.close()
