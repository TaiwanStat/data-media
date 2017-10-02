#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
cd word2vec
python3 produceReportByFiles.py ../mediaParser/output/ ../website/prev_report.json
cd ../mediaParser
rm -r output/*
