#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
NOW=$(date +"%Y-%m-%d")
cd $DIR
source venv/bin/activate

cd mediaParser/output
mv *$NOW.json ../tmp
cd ../../word2vec
python3 produceReportByFiles.py ../mediaParser/output/ ../website/prev_report.json

cd ../mediaParser
rm -r output/*
mv tmp/* output

