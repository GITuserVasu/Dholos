#Check which records in the database table Case_Detiles have a status of "In Progress"
# Get all these records into a queue
# For each of these records
# 	Find if the S3 bucket for that project has the file "done.txt"
# 	If done.txt exists, update the case_detiles table
# Exit
# Importing the importlib that allows for all kinds of folder/file names
import os
import importlib
# import the database interface module
#import needed to access postgresql
import psycopg2
# import the http request module
import requests
# Import boto3 to access S3
import boto3
import botocore
# Get the HOLOS python code
#app = importlib.import_module("backend.app")

localdir = "/var/www/html/devtestholos/assets/temp/"

boto3.setup_default_session(profile_name='holos')
s3session = boto3.Session(profile_name='holos')
s3 = s3session.client('s3')
s4 = s3session.resource('s3')
s5 = boto3.client("s3")
my_bucket = 'docker-holos-spatial-dssat-trigger-bucket'
#print(my_bucket)
orgid = "191629"
userid = "VasuVijay"
project_name = "demo1"
#my_key2 = orgid+"/"+str(userid)+"/"+project_name+"/results/"
#print("mykey2", my_key2)
#new_bucket = s4.Bucket(my_bucket)
#for objects in new_bucket.objects.filter(Prefix=my_key2):
#        print(objects.key)
print ("#################################################")
conn = psycopg2.connect(
        dbname = "devholos",
        user = "holosuser",
        password = "holospass",
        host = "localhost",
        port = "5432"
        )
my_cursor = conn.cursor()
sql_string1 = "select orgid,\"projectName\", username,id from app_case_detiles where status = 'Inprogress'"
my_cursor.execute(sql_string1)
my_data = my_cursor.fetchall()
#my_cursor.close()
for record in my_data:
    orgid = record[0]
    projectname = record[1]
    username = record[2]
    caseid = record[3]
    if username:
        nuusername = username.replace(" ","")
    else:
        nuusername = "No user name in table"
    print(orgid,projectname,username,nuusername,caseid)

    my_key = orgid+"/"+str(nuusername)+"/"+projectname+"/results/done.txt"
    my_key2 = orgid+"/"+str(nuusername)+"/"+projectname+"/results/"
    my_key = str(my_key)
    my_key2 = str(my_key2)
#print (my_key)
#my_bucket = 'docker-holos-spatial-dssat-trigger-bucket'
#my_bucket_list = s3.list_objects(Bucket=my_bucket)
#print(my_bucket_list)
#for obj in my_bucket_list['Contents']:
#    print("obj['Key']")

    new_bucket = s4.Bucket(my_bucket)
#    for objects in new_bucket.objects.filter(Prefix=my_key2):
#        print("objects.key")

    try:
           s5.head_object(Bucket=my_bucket, Key=my_key)
           print("file found")
           try:
             sql_string2 = "update app_case_detiles set status = 'Verified' where orgid=%(orgid)s and \"projectName\"=%(projectname)s and username=%(username)s;"
             my_cursor.execute(sql_string2,{'orgid':orgid,'projectname':projectname,'username':username})
             print("sql call  to update case details successful",my_key)
             for objects in new_bucket.objects.filter(Prefix=my_key2):
                 a = objects.key
                 print("a",a)
                 reco = "test"
                 if "recommendations" in a:
                     print("reco found")
                     response = s5.get_object(Bucket=my_bucket, Key=a)
                     reco = response['Body'].read()
                     reco = reco.decode("utf-8")
                     print("reco",reco)
                 else:
                    print("reco not found")
               #print(objects.key)
                 sql_string3 = "INSERT INTO app_all_results (orgid, projectname, username,caseid,files3loc,reco) Values(%(orgid)s,%(projectname)s,%(username)s, %(caseid)s,%(files3loc)s, %(reco)s);"
               #print(sql_string3)
                 my_cursor.execute(sql_string3,{"orgid":orgid,"projectname":projectname,"username":username,"caseid":caseid,"files3loc":objects.key,"reco":reco})
                 print("added record to results table", objects.key)
                 if os.path.isdir(localdir+projectname):
                    print("dir exists", localdir+projectname)
                 else:
                   filepath1 = os.path.join(localdir, projectname)
                   print(filepath1)
                   try:
                     os.mkdir(filepath1)
                   except:
                     print("dir not created")
                   filepath2 = os.path.join(filepath1,"results")
                   print(filepath2)
                   os.mkdir(filepath2)
                 filename = a.rsplit('/', 1)[-1]
                 print(localdir)
                 print(projectname)
                 print(filename)
                 checkfile = localdir + projectname +"/results/"+ filename
                 print(checkfile)
                 if os.path.isfile(localdir +projectname+"/results/"+ filename) == False:
                    print("file does not exist")
                    try:
                       #my_file = open(checkfile, "wb")
                       with open(checkfile,'wb') as f:
                           s5.download_fileobj(my_bucket,a, f)
                       print("file downloaded")
                    except:
                       print("file not downlloaded")
                 else:
                      print("File already exists")
           except:
                print("done.txt file found, but s3 download failed", my_key)
    except:
           print("file ",my_key," not found")

conn.commit()
my_cursor.close()
conn.close()
#print ("#################################################")
