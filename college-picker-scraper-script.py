import json
from botocore.vendored import requests
import os
import time
import boto3
import logging
import datetime
from decimal import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb_resource = boto3.resource('dynamodb', region_name='us-east-1')
dynamodb1 = dynamodb_resource.Table('college-picker-information')
dynamodb2 = dynamodb_resource.Table('college-picker-stat')

def lambda_handler(event, context):
    key = "Er4NM2afZpYaZrHulE11LA3FTI0cty3wjGGRwD5L"
    url_base = "https://api.data.gov/ed/collegescorecard/v1/schools/"
    
    begin = 0
    end = 300
    id = begin * 20 - 1
    for page in range(begin, end):
        print(page)
        time.sleep(3)
        logger.info("FETCH PAGE" + str(page))
        p = {"school.operating": "1", "api_key": key, "page": page}
        resp = requests.get(url=url_base, params=p)
        data = resp.json()
        logger.info("GET PAGE" + str(page) + " " + str(len(data["results"])))
        for d in data["results"]:
            try:
                id += 1
                latest = d["latest"]
                school = latest["school"]
                school_name = school["name"]
                state = school["state"]
                school_url = school["school_url"]
    
                student = latest["student"]
                num_of_student = student["size"]
    
                cost = latest["cost"]
                tuition = cost["tuition"]["out_of_state"]
    
                admissions = latest["admissions"]
                test_requirement = admissions["test_requirements"]
                sat_scores = admissions["sat_scores"]["average"]["overall"]
                if sat_scores is None:
                    sat_scores = 0
                if num_of_student is None:
                    num_of_student = 0
                if tuition is None:
                    tuition = 0
                    
                dynamodb_data1 = {
                    'school_id' : str(id),
                    'school_name' : school_name,
                    'school_url' : school_url,
                    'state': state,
                    'num_of_student' : (int)(num_of_student),
                    'sat_scores' : (int)(sat_scores),
                    'tuition': tuition
                }
                try:
                    dynamodb1.put_item(Item=dynamodb_data1)
                except Exception as ex:
                    logger.info('---cannot put_item={}'.format(ex))
                    
                dynamodb_data2 = {
                    'user_school_id' : str(id) +"_admin@college-picker.com",
                    'rating' : 3
                }

                try:
                    dynamodb2.put_item(Item=dynamodb_data2)
                except Exception as ex:
                    logger.info('---cannot put_item={}'.format(ex))
            except Exception as e:
                logger.info('---cannot process={}'.format(e))
                logger.info(d)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }