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
dynamotable = dynamodb_resource.Table('college-picker-information')

def lambda_handler(event, context):
    
    response = dynamotable.scan()
    items = response['Items']
    data = []
    for item in items:
        d = {
            'school_id' : item['school_id'],
            'school_name' : item['school_name'],
            'school_url' : item['school_url'],
            'state': item['state']
        }
        data.append(d)
        
    print(str(len(data)))
    
    return {
        'statusCode': 200,
        'data': data,
        'body': json.dumps('Hello from Lambda!')
    }