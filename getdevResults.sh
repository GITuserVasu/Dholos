#! /usr/bin/bash
# This is the shell script whhich will call getResults.js
# First check to see if getResults.js is still running. If so, do nothing.
# if getResults.js is not running, then kick off getResults.js
# This script should run every minute
cd /home/bitnami/Dholos
#echo $(pwd) >> /home/bitnami/restart-guni.log 
#var=`ps -aux | grep -v grep | grep -c guni` 
#echo $var
if [ -f "getResults.lock" ]
then
#echo "getResults.sh --- Lock File Exists" >> /home/bitnami/ezaitool.log
exit 0
else
touch getResults.lock
#echo "$(date) getResults.sh --- Need to execute getResults.py " >> /home/bitnami/ezaitool.log
python3 getResults.py >> /home/bitnami/Dholos/holosgetResults.log
#echo "$(date) getResults.sh ---  getResults.py executed" >> /home/bitnami/ezaitool.log
rm getResults.lock
fi
