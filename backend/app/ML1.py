import csv
from http.client import HTTPResponse
import os
import requests
import json
from django.http import HttpResponse, JsonResponse

# Import necessary libraries
import pandas as pd
import numpy as np
import pickle
#import seaborn as sns  # visualisation
#import matplotlib.pyplot as plt  # visualisation 

""" import tensorflow as tf
from tf.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten
from tf.keras.models import Sequential """
# import importlib.util
# spec = importlib.util.spec_from_file_location("parseFiles", "C:\\Users\\ganes\\Desktop\\vasu\\eProbito\\Gaiadhi\\python-code\\parseFiles.py")
# rmvspaces = importlib.util.module_from_spec(spec)
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
# from rest_framework.parsers import JSONParser
from django.http import JsonResponse
import subprocess
import boto3

# sns.set_theme(color_codes=True)

# Imports from sklearn for models
# import warnings
import warnings
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor


@csrf_exempt
def prednow(predjson):
    print("In prednow")
    #reportfile = open_reporting_session("","")
    #ML1_df= read_pkldata("","")
    predictdf = read_csvdata("","")
    print(predictdf)
    SRADlist, Tmaxlist, Tminlist, Rainlist= create_empty_param_cols()
    #df,dataX,dataY = setup_data_for_model_training(ML1_df, SRADlist, Tmaxlist, Tminlist, Rainlist, "UnadjustedYield(kg/ha))")
    #x_train, y_train, x_test, y_test, x_val, y_val = split_data(dataX, dataY)
    #forest_model = train_random_forest(x_train, y_train)
    #y_predict = test_model(forest_model, x_test)
    #rsquared = calc_R_squared(y_test, y_predict)
    print(" Get Random Forest Model")
    forest_model = get_model("/home/bitnami/ML/data/coimbatore-apr25/models/finalized_model.sav")
    print("Got it")
    #print(rsquared)
    predictX = setup_data_for_prediction(predictdf, SRADlist, Tmaxlist, Tminlist, Rainlist)
    print(predictX)
    #predict_array = predictX.to_numpy()
    #print(predict_array)
    #y_predict = forest_model.predict(predictX)
    #y_predict = predict_value("Random Forest", forest_model, predictX)
    #print(y_predict)
    #save_model(forest_model, '/home/bitnami/ML/data/coimbatore-apr25/models/rfver1.0')
    #close_reporting_session(reportfile)
    return JsonResponse({"statusCode": 200, "name": "test"})

# Open report file for writing
@csrf_exempt
def open_reporting_session(pathname, filename):
    import datetime

    now = datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
    rightnow = now.replace(" ", "")
    rightnow = rightnow.replace(",", "-")
    rightnow = rightnow.replace(":", "-")
    if pathname == "" and filename == "":
        # pathname = "C:\\Users\\ganes\\Desktop\\vasu\\eProbito\\Gaiadhi\\python-code\\"
        pathname = "/home/bitnami/ML/reports/"
        filename = str(rightnow) + ".txt"
    if filename == "":
        print("Please enter valid filename")
        return "Error"
    if pathname == "":
        print("Please enter valid pathname")
        return "Error"
    reportfile = open(pathname + filename, "w+")
    print("Report File", filename, "Opened")
    reportfile.write("Reporting session started as of :  ")
    reportfile.write(now)
    reportfile.write("\n")
    reportfile.write("___________________________________________________")
    reportfile.write("\n")
    return reportfile


# Close report file for writing
@csrf_exempt
def close_reporting_session(reportfile):
    import datetime

    now = datetime.datetime.now()
    reportfile.write("Reporting session ended as of :" + str(now) + "\n")
    reportfile.write("_________________________________________" + "\n")
    reportfile.close()
    print("Report File Closed")
    return


# Read the cleansed data from a pkl file
@csrf_exempt
def read_pkldata(pathname, filename):
    if pathname == "help" or filename == "help":
        print("pathname is the path where the pkl file is located")
        print("filename is the name of the pkl file")
    if pathname == "" and filename == "":
        #pathname = "C:\\Users\\ganes\\Desktop\\vasu\\eProbito\\Gaiadhi\\python-code\\"
        pathname = "/home/bitnami/ML/data/coimbatore-apr25/"
        filename = "ml_data.pkl"
    if filename == "":
        print("Please enter valid filename")
    if pathname == "":
        print("Please enter valid pathname")
    ML1_df = pd.read_pickle(pathname + filename)
    #print(ML1_df.head())
    # ML1_df = pd.read_pickle('C:\\Users\\ganes\\Desktop\\vasu\\eProbito\\Gaiadhi\\python-code\\ml_data.pkl')
    return ML1_df


# Read the csv for a single datapoint containing location, crop variety, planting date as well as weather parameters
# for that particular planting date. Location, crop variety and planting date are entered by the user.
# The yield date (or harvest date) is obtained from the simulation summary data for a planting date close to user
# specified planting date (for that location and crop variety).
## TO DO: Extension - CSV file has multiple datapoints
@csrf_exempt
def read_csvdata(pathname, filename):
    if pathname == "help" or filename == "help":
        print("pathname is the path where the csv file is located")
        print("filename is the name of the csv file")
    if pathname == "" and filename == "":
        #pathname = "C:\\Users\\ganes\\Desktop\\vasu\\eProbito\\Gaiadhi\\python-code\\"
        pathname = "/home/bitnami/ML/data/coimbatore-apr25/"
        filename = "predict-row.csv"
    if filename == "":
        print("Please enter valid filename")
    if pathname == "":
        print("Please enter valid pathname")
    predictdf = pd.read_csv(pathname + filename, dtype="str")

    # predictX = predictdf[3:]
    # print(predictdf.head())
    # predictdf = pd.read_csv('C:\\Users\\ganes\\Desktop\\vasu\\eProbito\\Gaiadhi\\python-code\\predict-row.csv')
    return predictdf


@csrf_exempt
def get_subset_df(df, col_name, col_value):
    # To get all rows for a particular cultivar
    if col_name == "Cultivar":
        cultivar_rows = df.loc[(df["Cultivar"] == col_value)]
        return cultivar_rows

    # To get all rows for  particular location
    if col_name == "SubBlockID":
        location_rows = df.loc[(df["location"] == col_value)]
        return location_rows

    # Default
    return df


@csrf_exempt
def listcolumnnames(name, start_cols, end_cols):
    new_cols = []
    # Number of columns to add
    if start_cols <= 0 or start_cols == "":
        start_cols = 150
    if end_cols <= 0 or end_cols == "":
        end_cols = 360
    if end_cols <= start_cols:
        print("End Column Number must be greater than Start Column Number")
        end_cols = 360

    # Add columns in sequence
    for i in range(start_cols, end_cols + 1):
        new_cols.append(f"{name}{i}")
    return new_cols


@csrf_exempt
def create_empty_param_cols():
    SRADlist = listcolumnnames("SRAD",0,0)
    Tmaxlist = listcolumnnames("Tmax",0,0)
    Tminlist = listcolumnnames("Tmin",0,0)
    Rainlist = listcolumnnames("Rain",0,0)

    return SRADlist, Tmaxlist, Tminlist, Rainlist


@csrf_exempt
def setup_data_for_model_training_extended(SRADlist, Tmaxlist, Tminlist, Rainlist):

    initlist = [
        "location",
        "PlantingDate",
        "cultivar",
        "NitrogenApplied(kg/ha)",
        "TotalRain(mm)",
        "AvgTmin(C)",
        "AvgTmax(C)",
        "AvgSRAD(MJ/m2/d)",
    ]
    initlist.extend(SRADlist)
    initlist.extend(Tmaxlist)
    initlist.extend(Tminlist)
    initlist.extend(Rainlist)

    return initlist


@csrf_exempt
def setup_data_for_model_training(
    df, SRADlist, Tmaxlist, Tminlist, Rainlist, var_to_predict
):
    initlist = [
        "location",
        "PlantingDate",
        "cultivar",
        "NitrogenApplied(kg/ha)",
    ]
    initlist.extend(SRADlist)
    initlist.extend(Tmaxlist)
    initlist.extend(Tminlist)
    initlist.extend(Rainlist)

    dataX = df[initlist]
    print(dataX.shape)

    dataY = df[var_to_predict]

    # shuffle the dataframe in place
    df = df.sample(frac=1).reset_index(drop=True)

    return df, dataX, dataY

@csrf_exempt
def setup_data_for_prediction(
    df, SRADlist, Tmaxlist, Tminlist, Rainlist):
    initlist = [
        "location",
        "PlantingDate",
        "cultivar",
        "NitrogenApplied(kg/ha)",
    ]
    initlist.extend(SRADlist)
    initlist.extend(Tmaxlist)
    initlist.extend(Tminlist)
    initlist.extend(Rainlist)

    predictX = df[initlist]
    #print(dataX.shape)

    return predictX


@csrf_exempt
def split_data(dataX, dataY):

    from sklearn.model_selection import train_test_split, cross_val_score

    train_ratio = 0.8
    validation_ratio = 0.1
    test_ratio = 0.1

    # train is now 80% of the entire data set
    x_train, x_test, y_train, y_test = train_test_split(
        dataX, dataY, test_size=1 - train_ratio
    )

    # test is now 10% of the initial data set
    # validation is now 10% of the initial data set
    x_val, x_test, y_val, y_test = train_test_split(
        x_test, y_test, test_size=test_ratio / (test_ratio + validation_ratio)
    )

    # print(x_train, x_val, x_test)

    return x_train, y_train, x_test, y_test, x_val, y_val


""" @csrf_exempt
def train_CNN_model(x_train, y_train, x_val, y_val):
    import tensorflow as tf
    import keras
    from keras import ops
    from tf.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten
    from tf.keras.models import Sequential

    model = Sequential()
    model.add(Dense(1024, activation="relu", input_dim=848))
    model.add(Dense(1024, activation="relu"))
    model.add(Dense(1))
    model.compile(optimizer="adam", loss="mae", metrics=["mae"])
    model.summary()

    hist = model.fit(
        x_train, y_train, validation_data=(x_val, y_val), epochs=50, batch_size=50
    )

    return (model, hist) """


@csrf_exempt
def predict_value(model_name, model, predictX):
    if model_name == "Random Forest":
        print("Random Forest Model Used")
    if model_name == "Simple CNN":
        print("Simple CNN Model Used")

    y_predict = model.predict(predictX)
    return y_predict


@csrf_exempt
def test_model(model, x_test):
    y_predict = model.predict(x_test)
    return y_predict


""" @csrf_exempt
def graph_val_and_train_error(hist):
    err = hist.history["mae"]
    val_err = hist.history["val_mae"]
    epochs = range(1, len(err) + 1)
    plt.plot(epochs, err, "-", label="Training MAE")
    plt.plot(epochs, val_err, "-", label="Validation MAE")
    plt.plot()
    return """


@csrf_exempt
def calc_R_squared(y_test, y_predict):
    from sklearn import metrics
    from sklearn.metrics import mean_squared_error, mean_absolute_error

    mae = metrics.mean_absolute_error(y_test, y_predict)
    mse = metrics.mean_squared_error(y_test, y_predict)
    r2 = np.sqrt(metrics.mean_squared_error(y_test, y_predict))
    rsquared = metrics.r2_score(y_test, y_predict)

    print("Mean Absolute Error:", mae)
    print("Mean Square Error:", mse)
    print("Root Mean Square Error:", r2)
    print("R Squared:", rsquared)

    return rsquared


@csrf_exempt
def train_random_forest(x_train, y_train):
    # Random Forest
    from sklearn.ensemble import RandomForestRegressor

    forest_model = RandomForestRegressor(random_state=1)
    forest_model.fit(x_train, y_train)

    return forest_model

@csrf_exempt
def save_model(model, name):
    # Name the model
    filename = name
    pickle.dump(model, open(filename,'wb'))

    # OR using joblib
    #joblib.dump(model, filename)
    
    return 0

@csrf_exempt
def get_model(filename):
    model = pickle.load(open(filename,'rb'))

    # OR using joblib
    #model = joblib.load(filename)
    
    return model