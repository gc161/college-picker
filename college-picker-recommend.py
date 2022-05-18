import sys
from tabnanny import verbose
sys.path.append('./package')

import json
import boto3
import urllib.request
import urllib.parse
import urllib.error
import os
import re
import pandas as pd
from pandas import DataFrame
from sagemaker.amazon.kmeans import  KMeansPredictor

kmeans_predictor = KMeansPredictor("kmeans-2022-05-14-10-35-23-117")

VERSION = "1.4"
print("VERSION=" + VERSION)

vocabulary_length = 9013

def lambda_handler(event, context):
    print(event)
    qs = event["querystring"]

    school_id = (int)(re.search('school_id=(.*)###', qs).group(1))
    user_email = re.search('user_email=(.*)@@@', qs).group(1)
    print(school_id)
    print(user_email)

    dynamo_db = 'college-picker-information'

    dynamodb_resource = boto3.resource('dynamodb', region_name='us-east-1')
    dynamotable = dynamodb_resource.Table(dynamo_db)
    print("START 0")
    response = dynamotable.scan()
    items = response['Items']
    base_dict = dict()
    print("START 1")
    
    for item in items:
    #     print(str(id) + " " + item['school_name'] + " " + item['state'] + " " + str(item['num_of_student']) + " " + str(item['sat_scores']))
        dynamodb_data1 = {
            'school_id' : item["school_id"],
            'school_name' : item["school_name"],
            'school_url' : item["school_url"],
            'state': item["state"],
            'num_of_student' : item['num_of_student'],
            'sat_scores' : item['sat_scores'],
            'tuition' : item['tuition'],
            "sum" : 0.0, 
            "num": 0.0,
            "avg": 0.0
        }
        base_dict[(int)(item["school_id"])] = dynamodb_data1
        
    print("START 2")  
    dynamotable = dynamodb_resource.Table('college-picker-stat')

    response = dynamotable.scan()
    items = response['Items']
    data = []
    school_rating_dict = dict()
    for item in items:
        key = (int)(item["user_school_id"].split("_")[0])
        email = "###"
        if len(item["user_school_id"].split("_")) > 1:
            email = item["user_school_id"].split("_")[1]
        if email == user_email:
            school_rating_dict[key] = (int)(item["rating"])

        base_dict[key]["sum"] += (int)(item["rating"])
        base_dict[key]["num"] += 1
        base_dict[key]["avg"] = base_dict[key]["sum"] / base_dict[key]["num"]

    print("START 3")  
    dd = []
    for k in sorted(base_dict):
        item = base_dict[k]
        data.append([ item['num_of_student'], item['sat_scores'], item['tuition'], item['avg'] ])
        dd.append([ (float)( item['num_of_student']), (float)( item['sat_scores'] ), (float)( item['tuition'] ), (float)( item['avg'] ) ])
        

    df = pd.DataFrame(data, columns=[ 'num_of_student', 'sat_scores', 'tuition', 'avg' ])

    data_train = df
    data_train = data_train.astype('float32')
    print("START 4")  
    predicted_result = kmeans_predictor.predict(data_train.values[school_id])
    print("Prediction Result:")
    print(predicted_result)
    predicted_cluster = predicted_result[0].label['closest_cluster'].float32_tensor.values[0]
    d0 = predicted_result[0].label['distance_to_cluster'].float32_tensor.values[0]

    print(predicted_cluster)
    print(d0)
    res = []
    # for idx, node in enumerate(result):
    #     if idx == school_id:
    #         continue
    #     node_cluster = result[idx].label['closest_cluster'].float32_tensor.values[0]
    #     if node_cluster == predicted_cluster:
    #         d1 = result[idx].label['distance_to_cluster'].float32_tensor.values[0]
    #         res.append( {"school_id" : idx, "distance" : abs(d1 - d0), "school_name" : base_dict[idx]['school_name']})


    print("START 5")  
    dynamotable = dynamodb_resource.Table('college-picker-ml')

    response = dynamotable.scan()
    items = response['Items']
    data = []
    print("START 6")  
    for item in items:
        idx = (int)(item["school_id"])
        node_cluster = (int)(item["closest_cluster"])
        distance = (int)(item["distance_to_cluster"])
        
        if idx == (int)(school_id):
            continue
        if base_dict[idx]["state"] != base_dict[school_id]['state']:
            continue
        rating = 3
        if idx in school_rating_dict:
            rating = school_rating_dict[idx]
        if node_cluster == predicted_cluster:
            res.append( {"school_id" : idx, "distance" : abs(distance - d0), "school_name" : base_dict[idx]['school_name'], 
            'school_url': base_dict[idx]['school_url'],
            'state': base_dict[idx]["state"],
            'num_of_student' : base_dict[idx]['num_of_student'],
            'sat_scores' : base_dict[idx]['sat_scores'],
            'tuition' : base_dict[idx]['tuition'],
            'rating' : rating
            })


    print("DONE")
    print(len(res))
    res.sort(key=lambda x: x["distance"], reverse=False)
    if len(res) > 8:
        res = res[0:8]
    print("FINAL DONE")
    print(len(res))
    return {
        'statusCode': 200,
        'result': res,
        'body': json.dumps('Hello from Lambda!')
    }


