#! /usr/bin/bash
# This is the shell script whhich will call getResults.js
# First check to see if getResults.js is still running. If so, do nothing.
# if getResults.js is not running, then kick off getResults.js
# This script should run every minute
cd /home/bitnami/Dholos-logs
#echo $(pwd) >> /home/bitnami/restart-guni.log 
#var=`ps -aux | grep -v grep | grep -c guni` 
#echo $var
if [ -f "getResults.lock" ]
then
#echo "getResults.sh --- Lock File Exists" >> /home/bitnami/ezaitool.log
exit 0
else
touch getResults.lock
cd /home/bitnami/Dholos
#echo "$(date) getResults.sh --- Need to execute getResults.py " >> /home/bitnami/ezaitool.log
python3 getdevResults.py >> /home/bitnami/Dholos-logs/holosdevgetResults.log
#echo "$(date) getResults.sh ---  getResults.py executed" >> /home/bitnami/ezaitool.log
cd /home/bitnami/Dholos-logs
rm getResults.lock
fi
