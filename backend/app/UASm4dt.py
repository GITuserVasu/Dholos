import csv
from http.client import HTTPResponse
import os
import requests
import json
from django.http import HttpResponse, JsonResponse
from datetime import datetime

from io import StringIO

import pandas as pd
import numpy as np

import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_curve, auc

from sklearn.linear_model import SGDClassifier
from sklearn.datasets import make_classification

from sklearn.tree import DecisionTreeClassifier

import pickle

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
import subprocess
import boto3

# Read the CSV file into a DataFrame
# updateddf = pd.read_csv('modeldatafile6.csv')
""" print(origdf.head)
updateddf = origdf.replace({np.nan: 0}) # Since non arable color is blank replace with "None"
updateddf = updateddf.reset_index()  # make sure indexes pair with number of rows """
#updateddf = origdf.reset_index()  # make sure indexes pair with number of rows

# Convert categorical variables with numerical variables
""" updateddf['LCC'].replace(['Arable', 'Non-Arable'], [1, 2], inplace=True)
updateddf['Soil_Color'].replace(['Black','Lateritic', 'Red'], [1,2,3], inplace=True)
updateddf['Slope'].replace(['<1','1-3', '3-5','5-10','10-15','15-25','25-33','>33','<5','>5' ], [1,2,3,4,5,6,7,8,9,10], inplace=True)
updateddf['Depth'].replace(['<25','>150', '>25','100-150','10-25','25-50','50-75','75-100'], [1,2,3,4,5,6,7,8], inplace=True)
updateddf['Text_Surface'].replace(['Loamy', 'Clayey'], [1, 2], inplace=True)
updateddf['Text_Subsurface'].replace(['Loamy', 'Clayey'], [1, 2], inplace=True)
updateddf['Gravel'].replace(['<=35','<=35%', '>35','>35%'], [1,1,2,2], inplace=True)
updateddf['Rainfall'].replace(['<=750','<=750.00', '>750.00','>950','750-950'], [1,1,2,3,4], inplace=True)
updateddf['Treatment'].replace(['Contour Bunding', 'Contour bunding/TCB','Contour Trenching','Graded Bunding','Graded bunding','Graded Trenching','Peurtorican terrace','Plantation terrace','Terracing (Sloping inwards/Level terrace)','Terracing (Sloping outward/Level terrace)','Zingg Terraces' ], [1, 2,3,4,4,5,6,7,8,9,10], inplace=True)
 """
""" updateddf['LCC'] = updateddf['LCC'].replace(['Arable', 'Non-Arable'], [1, 2])
updateddf['Soil_Color'] = updateddf['Soil_Color'].replace(['Black','Lateritic', 'Red'], [1,2,3])
updateddf['Slope'] = updateddf['Slope'].replace(['<1','1-3', '3-5','5-10','10-15','15-25','25-33','>33','<5','>5' ], [1,2,3,4,5,6,7,8,9,10])
updateddf['Depth'] = updateddf['Depth'].replace(['<25','>150', '>25','100-150','10-25','25-50','50-75','75-100'], [1,2,3,4,5,6,7,8])
updateddf['Text_Surface'] = updateddf['Text_Surface'].replace(['Loamy', 'Clayey'], [1, 2])
updateddf['Text_Subsurface'] = updateddf['Text_Subsurface'].replace(['Loamy', 'Clayey'], [1, 2])
updateddf['Gravel'] = updateddf['Gravel'].replace(['<=35','<=35%', '>35','>35%'], [1,1,2,2])
updateddf['Rainfall'] = updateddf['Rainfall'].replace(['<=750','<=750.00', '>750.00','>950','750-950'], [1,1,2,3,4])
updateddf['Treatment'] = updateddf['Treatment'].replace(['Contour Bunding', 'Contour bunding/TCB','Contour Trenching','Graded Bunding','Graded bunding','Graded Trenching','Peurtorican terrace','Plantation terrace','Terracing (Sloping inwards/Level terrace)','Terracing (Sloping outward/Level terrace)','Zingg Terraces' ], [1, 2,3,4,4,5,6,7,8,9,10])

updateddf['Treatment'] = updateddf['Treatment'].astype(int) """

""" Xlist = ['LCC', 'Soil_Color', 'Slope', 'Depth', 'Text_Surface','Text_Subsurface', 'Gravel', 'Rainfall']
X = updateddf[Xlist]

Y = updateddf['Treatment'] """

# Split the data into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.3, random_state=42)

""" print(X_test)

# Standardize the features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

print(X_test) """

# Train the Decision Tree  model
""" clf = DecisionTreeClassifier(random_state=42)
clf.fit(X_train, y_train) """

# Save the model
# pickle.dump(clf, open('C:\\Users\\sudha\\OneDrive\\Desktop\\vasu\\UAS\\UAS\\dev\\UASdtmodel.pkl','wb'))

# Evaluate the model
""" y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy: {:.2f}%".format(accuracy * 100)) """

# Results
""" X_test['Treatment'] = y_pred
# Convert numerical values back to categorical values
X_test['LCC'].replace([1, 2],['Arable', 'Non-Arable'], inplace=True)
X_test['Soil_Color'].replace([1,2,3,0], ['Black','Lateritic', 'Red','-'], inplace=True)
X_test['Slope'].replace([1,2,3,4,5,6,7,8,9,10,11],['<1','1-3', '3-5','5-10','10-15','15-25','25-33','>33','<5','<=5','>5' ], inplace=True)
X_test['Depth'].replace([1,2,3,4,5,6,7,8,9,10,11,12],['<25','>150', '>25','>=25','>100','100-150','10-25','25-50','<50','50-75','75-100','50-100'],  inplace=True)
X_test['Text_Surface'].replace([1, 2],['Loamy', 'Clayey'],  inplace=True)
X_test['Text_Subsurface'].replace([1, 2],['Loamy', 'Clayey'],  inplace=True)
X_test['Gravel'].replace([1,1,2,2],['<=35','<=35%', '>35','>35%'],  inplace=True)
X_test['Rainfall'].replace([1,1,2,3,4,5],['<=750','<=750.00', '>750.00','>750','>950','750-950'],  inplace=True)
#updateddf['Treatment'].replace(['Contour Bunding', 'Contour bunding/TCB','Contour Trenching','Graded Bunding','Graded bunding','Graded Trenching','Peurtorican terrace','Plantation terrace','Terracing (Sloping inwards/Level terrace)','Terracing (Sloping outward/Level terrace)','Zingg Terraces' ], [1, 2,3,4,4,5,6,7,8,9,10], inplace=True)
X_test['Treatment'].replace([1, 2,3,4,5,6,7,8,9,],['Trench cum contour bund',
 'Trench cum graded bund',
 'Trench cum contour bund with Zingg terracing',
 'Terracing (Sloping outward/Level terrace)',
 'Terracing (Sloping inwards/Level terrace)',
 'Plantation terrace',
 'Peurotorican terrace',
 'Contour trenching',
 'Graded trenching' ],inplace=True) """
#print(X_test)

@csrf_exempt
def soilwatercontrolpred(inputcsv):
    print("in soil water pred function")
    jsondata = JSONParser().parse(inputcsv)
    # StringIO simulates a file 
    csvheaders = "LCC,Soil_Color,Slope,Depth,Text_Surface,Text_Subsurface,Gravel,Rainfall"
    csvdata = jsondata["data"]  
    if csvdata and csvdata[0] != "L":
        csvdata = csvheaders +"\n" + csvdata
    csvdata = StringIO(csvdata)
# Get the model
    #model = pickle.load(open(filename,'rb'))
    #dtmodel = pickle.load(open('/home/bitnami/ML/data/UAS/models/UASdtmodel.pkl','rb'))

# Predict for user data
# New input for prediction
    #newX = pd.read_csv('..\\..\\UAS-II\\Xpredict-new.csv')
    newX = pd.read_csv(csvdata)
    print(newX.columns)
    print(newX)
# Convert categorical variables with numerical variables
    newX['LCC'].replace(['Arable', 'Non-Arable'], [1, 2], inplace=True)
    newX['Soil_Color'].replace(['Black','Lateritic', 'Red','-'], [1,2,3,0], inplace=True)
    newX['Slope'].replace(['<1','1-3', '3-5','5-10','10-15','15-25','25-33','>33','<5','<=5','>5' ], [1,2,3,4,5,6,7,8,9,10,11], inplace=True)
    newX['Depth'].replace(['<25','>150', '>25','>=25','>100','100-150','10-25','25-50','<50','>50','50-75','75-100','50-100'], [1,2,3,4,5,6,7,8,9,10,11,12,13], inplace=True)
    newX['Text_Surface'].replace(['Loamy', 'Clayey'], [1, 2], inplace=True)
    newX['Text_Subsurface'].replace(['Loamy', 'Clayey'], [1, 2], inplace=True)
    newX['Gravel'].replace(['<=35','<=35%', '>35','>35%'], [1,1,2,2], inplace=True)
    newX['Rainfall'].replace(['<=750','<=750.00', '>750.00','>750','>950','750-950'], [1,1,2,3,4,5], inplace=True)
# Save on server
    newX.to_csv('/home/bitnami/ML/data/UAS/models/inputvalues.csv', index=False)
# Predict
    #y_pred = dtmodel.predict(newX)
    result = subprocess.run(['python3', '/home/bitnami/ML/data/UAS/models/test.py'], capture_output=True, text=True)
    print(result)
    print(result.stdout)
    abc = result.stdout
    print("abc", abc)
    abc = abc.rstrip('\n')
    #abc = pd.read_csv(StringIO(abc))
# Results
    newX['Treatment'] = abc
    print("results")
    print(newX)
# Convert numerical values back to categorical values
    newX['LCC'].replace([1,2],['Arable', 'Non-Arable'], inplace=True)
    newX['Soil_Color'].replace([1,2,3,0], ['Black','Lateritic', 'Red','-'], inplace=True)
    newX['Slope'].replace([1,2,3,4,5,6,7,8,9,10,11],['<1','1-3', '3-5','5-10','10-15','15-25','25-33','>33','<5','<=5','>5' ], inplace=True)
    newX['Depth'].replace([1,2,3,4,5,6,7,8,9,10,11,12,13],['<25','>150', '>25','>=25','>100','100-150','10-25','25-50','<50','>50','50-75','75-100','50-100'],  inplace=True)
    newX['Text_Surface'].replace([1,2],['Loamy', 'Clayey'],  inplace=True)
    newX['Text_Subsurface'].replace([1,2],['Loamy', 'Clayey'],  inplace=True)
    newX['Gravel'].replace([1,1,2,2],['<=35','<=35%', '>35','>35%'],  inplace=True)
    newX['Rainfall'].replace([1,1,2,3,4,5],['<=750','<=750.00', '>750.00','>750','>950','750-950'],  inplace=True)
#updateddf['Treatment'].replace(['Contour Bunding', 'Contour bunding/TCB','Contour Trenching','Graded Bunding','Graded bunding','Graded Trenching','Peurtorican terrace','Plantation terrace','Terracing (Sloping inwards/Level terrace)','Terracing (Sloping outward/Level terrace)','Zingg Terraces' ], [1, 2,3,4,4,5,6,7,8,9,10], inplace=True)
    newX['Treatment'].replace([1,2,3,4,5,6,7,8,9,],['Trench cum contour bund',
 'Trench cum graded bund',
 'Trench cum contour bund with Zingg terracing',
 'Terracing (Sloping outward/Level terrace)',
 'Terracing (Sloping inwards/Level terrace)',
 'Plantation terrace',
 'Peurotorican terrace',
 'Contour trenching',
 'Graded trenching' ],inplace=True)
    print("newX")
    print(newX)
# Save prediction in a CSV file
    newX.to_csv('/home/bitnami/ML/data/UAS/predicted-values.csv', index=False)
    newX_string = newX.to_string()

    return JsonResponse({"statusCode": 200, "name": "test", "prediction":newX_string})



