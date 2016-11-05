import json
import slscrypt

def hello(event, context):
    body = {
        "message": slscrypt.get('test'),
        "input": event
    }
    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    };
    return response
