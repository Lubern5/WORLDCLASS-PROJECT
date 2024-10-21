import json
import boto3
import hashlib
import uuid
from werkzeug.security import generate_password_hash, check_password_hash  # Consider using Werkzeug for hashing

# Initialize clients for DynamoDB and Polly
dynamodb = boto3.resource('dynamodb')

# Your DynamoDB table name
TABLE_NAME = 'Users'

def lambda_handler(event, context):
    print("Received event:", json.dumps(event))  # Log the entire event

    # Check if 'body' exists in the event and if it's not None
    if 'body' not in event or event['body'] is None:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Request body is required.'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Change to specific domains in production
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    # Log the body to see its actual content
    print("Body received:", event['body'])

    # Check if body is already a dictionary
    if isinstance(event['body'], dict):
        body = event['body']  # Use the dictionary directly
    else:
        try:
            body = json.loads(event['body'])  # Convert JSON string to dictionary
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid JSON format.'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }

    username = body.get('username')
    password = body.get('password')

    if not username or not password:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Username and password are required.'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    # Hash the password using a more secure method
    hashed_password = generate_password_hash(password)

    # Store user in DynamoDB
    user_table = dynamodb.Table(TABLE_NAME)

    try:
        # Check if user already exists
        response = user_table.get_item(Key={'username': username})
        if 'Item' in response:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Username already exists.'}),
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            }
        
        # Insert the new user with a unique ID
        user_table.put_item(Item={
            'username': username,
            'password': hashed_password,  # Store the hashed password
            'user_id': str(uuid.uuid4())  # Generate a unique user ID
        })
        
        print("User stored in DynamoDB.")
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'User registered successfully.'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }

    except Exception as e:
        print("Error occurred:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
