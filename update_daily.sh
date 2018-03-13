#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
source venv/bin/activate
NOW=$(date +"%Y-%m-%d")
YESTERDAY=$(date --date yesterday +"%Y-%m-%d")

cd mediaParser
scrapy crawl udn -o output/udn_$NOW.json -t json
scrapy crawl ettoday -o output/ettoday_$NOW.json -t json
scrapy crawl cts -o output/cts_$YESTERDAY.json -t json
cd ../
python3 merge_dup_news.py
python3 verify.py | grep $NOW

cd mediaParser
aws s3 cp output/apple_$NOW.json s3://tw-media-data/
aws s3 cp output/cna_$NOW.json s3://tw-media-data/
aws s3 cp output/udn_$NOW.json s3://tw-media-data/
aws s3 cp output/liberty_$NOW.json s3://tw-media-data/
aws s3 cp output/ettoday_$NOW.json s3://tw-media-data/
aws s3 cp output/china_$NOW.json s3://tw-media-data/
aws s3 cp output/cts_$YESTERDAY.json s3://tw-media-data/
aws s3 cp output/setn_$YESTERDAY.json s3://tw-media-data/
aws s3 cp output/pts_$NOW.json s3://tw-media-data/
# aws s3 cp output/tvbs_$NOW.json s3://tw-media-data/

