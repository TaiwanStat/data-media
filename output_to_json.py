from utils.Mydb import Mydb
import json
import sys
import pprint
import sys
import datetime

with open('config.json') as data_file:
    data = json.load(data_file)

mydb = Mydb('postgresql', data["db_host"],  data["db_name"], data["db_user"], data["db_password"],5432)
table = data["db_table"]
search_date = sys.argv[1]
search_date = datetime.datetime.strptime(search_date,"%Y-%m-%d")
search_date = str(search_date)
search_date = search_date.replace(" ",":")

columns , results  = mydb.select( "SELECT website , COUNT(website) AS news_count , SUM( LENGTH(content) ) AS words_count FROM {} WHERE created_time >= '{}' GROUP BY website;".format(table, search_date) )

col , res  = mydb.select( "SELECT website , category , COUNT(website) AS cate_count FROM {}  WHERE created_time >= '{}' GROUP BY website,category;".format(table, search_date) )

media_list = []
for d in results :
    media_list.append(d[0])

report = {}
for media in media_list :
    report[media] = {}
    report[media]['category'] = {}
    for m in results :
        if m[columns.index("website")]==media :
            report[media]['news_count'] = m[columns.index("news_count")]
            report[media]['words_mean'] = m[columns.index("words_count")]/m[columns.index("news_count")]
            results.remove(m)

while res :
    tmp = res.pop()
    report[tmp[col.index("website")]]['category'][tmp[col.index("category")]] = tmp[col.index("cate_count")]

pprint.pprint (report)

with open('outfile.json', 'w') as outfile:
    json.dump(report, outfile)

mydb.close()
