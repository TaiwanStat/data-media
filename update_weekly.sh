#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
NOW=$(date +"%Y-%m-%d")
cd $DIR
source venv/bin/activate

cd mediaParser/output
mv *$NOW.json ../tmp
cd ../../word2vec/report
rm prev_report.json
mv week*.json prev_report.json
cd ..
python3 produceReportByFiles.py ../mediaParser/output/ ./report/prev_report.json ./report/
aws s3 cp report/week*.json s3://tw-media-data/report/

cd ../mediaParser
rm -r output/*
mv tmp/* output

