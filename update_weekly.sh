#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
NOW=$(date +"%Y-%m-%d")
cd $DIR
source venv/bin/activate

cd mediaParser/output
mv *$NOW.json ../tmp
cd ../../word2vec/report
rm prev_*.json
mv week*.json prev_report.json
mv detail*.json prev_detail.json
cd ..
python3 produceReportByFiles.py ../mediaParser/output/ ./report/prev_detail.json ./report/
aws s3 cp report/week*.json s3://tw-media-data/report/ --acl public-read
aws s3 cp report/detail*.json s3://tw-media-data/report/ --acl public-read

cd ../mediaParser
rm -r output/*
mv tmp/* output

