# -*- coding: utf-8 -*-

import json
import os
import base64
import boto3

SECRET_FILE = '.serverless-secret.json'

def get(name):
    data = json.load(open(SECRET_FILE, 'r'))
    client = boto3.client(service_name='kms', region_name=data.get('__slscrypt-region'))
    return client.decrypt(
        CiphertextBlob=base64.b64decode(data.get(name))).get('Plaintext').decode()
