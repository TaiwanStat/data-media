#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
source venv/bin/activate

NOW=$(date +"%Y-%m-%d")
cd mediaParser

scrapy crawl apple -o output/apple_$NOW.json -t json
scrapy crawl cna -o output/cna_$NOW.json -t json
scrapy crawl liberty -o output/liberty_$NOW.json -t json
#scrapy crawl ettoday -o output/ettoday_$NOW.json -t json
scrapy crawl china -o output/china_$NOW.json -t json

scrapy crawl libertyRealtime -o output/liberty_$NOW.json -t json
scrapy crawl appleRealtime -o output/apple_$NOW.json -t json

cd ../
echo $(date +"%Y-%m-%d %H")
