#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
source venv/bin/activate
YESTERDAY=$(date --date yesterday +"%Y-%m-%d")
NOW=$(date +"%Y-%m-%d")

cd mediaParser
scrapy crawl udn -o output/udn_$YESTERDAY.json -t json
scrapy crawl ettoday -o output/ettoday_$NOW.json -t json
cd ../
python3 merge_daily.py
python3 verify.py

cd mediaParser
aws s3 cp output/apple_$NOW.json s3://tw-media-data/
aws s3 cp output/cna_$NOW.json s3://tw-media-data/
aws s3 cp output/udn_$YESTERDAY.json s3://tw-media-data/
aws s3 cp output/liberty_$NOW.json s3://tw-media-data/
aws s3 cp output/ettoday_$NOW.json s3://tw-media-data/
aws s3 cp output/china_$NOW.json s3://tw-media-data/

