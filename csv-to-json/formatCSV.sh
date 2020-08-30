#!/bin/bash

FILENAME=''

if [ $# -eq 1 ]; then
    FILENAME=$1
else
    echo "Usage: ./formatCSV.sh CSVfile.csv"
    exit 1
fi

sed -i 's/,,Code\ would\ be\ given\ more\ information\ in\ observations\ /observations/' $FILENAME
sed -i 's/,,,//' $FILENAME
sed -i 's/,,/,/' $FILENAME
sed -i 's/,,//' $FILENAME
sed -i 's/FALSE/0/g' $FILENAME
sed -i 's/TRUE/1/g' $FILENAME
sed -i '1d' $FILENAME
sed -i '1d' $FILENAME