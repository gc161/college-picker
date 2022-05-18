import json
from botocore.vendored import requests
import os
import time
import boto3
import logging
import datetime
from decimal import *
import re

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb_resource = boto3.resource('dynamodb', region_name='us-east-1')
dynamotable = dynamodb_resource.Table('college-picker-stat')

def lambda_handler(event, context):
    print("EVENT")
    print(event)
    
    qs = event["querystring"]
    
    rating = re.search('rating=(.*)###', qs).group(1)
    user_school_id = re.search('user_school_id=(.*)@@@', qs).group(1)
    
    print(rating)
    print(user_school_id)
    

    d = {
        'user_school_id' : user_school_id,
        'rating' : (int)(rating)
    }
    
    try:
        dynamotable.put_item(Item=d)
    except Exception as ex:
        logger.info('---cannot put_item={}'.format(ex))
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }