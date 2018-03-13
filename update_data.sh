#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
source venv/bin/activate

NOW=$(date +"%Y-%m-%d")
YESTERDAY=$(date --date yesterday +"%Y-%m-%d")
cd mediaParser

scrapy crawl apple -o output/apple_$NOW.json -t json
scrapy crawl cna -o output/cna_$NOW.json -t json
scrapy crawl liberty -o output/liberty_$NOW.json -t json
scrapy crawl china -o output/china_$NOW.json -t json
scrapy crawl setn -o output/setn_$YESTERDAY.json -t json -s  DOWNLOAD_DELAY=1
scrapy crawl pts -o output/pts_$NOW.json -t json
# scrapy crawl tvbs -o output/tvbs_$NOW.json -t json

scrapy crawl libertyRealtime -o output/liberty_$NOW.json -t json
scrapy crawl appleRealtime -o output/apple_$NOW.json -t json

python3 merge_dup_news.py

cd ../
echo $(date +"%Y-%m-%d %H")
