---
title: "Day 5 - AWS Lambda and API Gateway for Serverless APIs"
date: 2026-05-08
weight: 5
summary: "Practiced AWS Lambda serverless functions with API Gateway by creating Python Lambda functions, configuring REST API endpoints, and testing HTTP request/response integration."
chapter: false
---

## Why I Did This

This task practiced AWS Lambda and API Gateway as a serverless architecture for building APIs without managing servers.

AWS Lambda is a compute service that runs code in response to events without provisioning or managing servers. API Gateway is a fully managed service that creates, publishes, and manages REST and WebSocket APIs at any scale.

Key benefits of serverless APIs:

- **No server management**: No EC2 instances to provision, patch, or monitor
- **Automatic scaling**: Lambda scales automatically from zero to thousands of concurrent executions
- **Pay-per-use pricing**: Pay only for actual compute time (billed per 100ms), not idle time
- **Built-in high availability**: Lambda and API Gateway are multi-AZ by default
- **Fast iteration**: Deploy code changes in seconds without infrastructure changes

For H-Smart, Lambda + API Gateway is ideal for:

- Backend APIs for mobile or web applications
- Microservices that process specific business logic
- Webhook endpoints that respond to third-party events
- Internal automation functions triggered by S3, DynamoDB, or other AWS events

## Implementation Steps

### Step 1: Create IAM Role for Lambda Execution

Lambda functions require an IAM role that grants permissions to write logs to CloudWatch.

In the IAM console, I created a new role:

```text
Trusted entity: AWS service → Lambda
Role name:      H-Smart-Lambda-Basic-Execution
Attach policy:  AWSLambdaBasicExecutionRole (managed policy)
```

The `AWSLambdaBasicExecutionRole` policy grants these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

This allows Lambda to write execution logs to CloudWatch Logs for debugging and monitoring.

### Step 2: Create Lambda Function with Python Runtime

In the Lambda console, I created a new function:

```text
Function name: H-Smart-Hello-API
Runtime:       Python 3.12 (latest available)
Architecture:  x86_64
Execution role: Use existing role → H-Smart-Lambda-Basic-Execution
```

**Function Code:**

I replaced the default code with a simple API response handler:

```python
import json
import datetime

def lambda_handler(event, context):
    """
    Lambda function that returns a JSON response for API Gateway
    """
    
    # Extract HTTP method and path from API Gateway event
    http_method = event.get('httpMethod', 'UNKNOWN')
    path = event.get('path', '/')
    
    # Extract query parameters
    query_params = event.get('queryStringParameters', {})
    name = query_params.get('name', 'Guest') if query_params else 'Guest'
    
    # Build response body
    response_body = {
        'message': f'Hello {name} from H-Smart serverless API!',
        'timestamp': datetime.datetime.utcnow().isoformat(),
        'method': http_method,
        'path': path,
        'service': 'H-Smart Backend API',
        'powered_by': 'AWS Lambda + API Gateway'
    }
    
    # Return response in API Gateway format
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  # Enable CORS
        },
        'body': json.dumps(response_body)
    }
```

This function:
- Accepts API Gateway events
- Extracts HTTP method, path, and query parameters
- Returns a JSON response with proper headers
- Includes CORS headers for cross-origin requests

### Step 3: Test Lambda Function in Console

Before integrating with API Gateway, I tested the Lambda function using a test event.

In the Lambda console Test tab, I created a test event simulating an API Gateway request:

```json
{
  "httpMethod": "GET",
  "path": "/hello",
  "queryStringParameters": {
    "name": "H-Smart User"
  }
}
```

Execution result:

```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{\"message\": \"Hello H-Smart User from H-Smart serverless API!\", \"timestamp\": \"2026-05-08T10:30:45.123456\", \"method\": \"GET\", \"path\": \"/hello\", \"service\": \"H-Smart Backend API\", \"powered_by\": \"AWS Lambda + API Gateway\"}"
}
```

This confirms the Lambda function logic is working correctly before adding API Gateway integration.

### Step 4: Create REST API in API Gateway

In the API Gateway console, I created a new REST API:

```text
API type:     REST API (not REST API Private or HTTP API)
API name:     H-Smart-API
Description:  RESTful API for H-Smart backend services
Endpoint type: Regional (traffic stays within the region)
```

**Endpoint types explained:**
- **Regional**: API is deployed to a specific region, lower latency for users in that region
- **Edge-optimized**: API uses CloudFront edge locations for global low latency
- **Private**: API is only accessible from within a VPC

For H-Smart, Regional is appropriate unless global users require edge-optimized delivery.

### Step 5: Create API Resource and Method

In the API Gateway console, I created a new resource under the root `/`:

```text
Resource name: hello
Resource path: /hello
```

Then I created a GET method for the `/hello` resource:

```text
Integration type: Lambda Function
Lambda function:  H-Smart-Hello-API
Use Lambda Proxy integration: Yes (checked)
```

**Lambda Proxy Integration** is critical: it passes the entire HTTP request to Lambda as an event object and expects Lambda to return a properly formatted response with status code and headers.

When prompted, I granted API Gateway permission to invoke the Lambda function.

### Step 6: Deploy API to a Stage

API Gateway requires deployment to a "stage" before it is publicly accessible.

In the API Gateway console, I selected Actions → Deploy API:

```text
Deployment stage: [New Stage]
Stage name:       prod
Stage description: Production stage for H-Smart API
```

After deployment, API Gateway provides an Invoke URL:

```text
https://abc123xyz.execute-api.ap-southeast-2.amazonaws.com/prod
```

The full endpoint URL for the `/hello` resource is:

```text
https://abc123xyz.execute-api.ap-southeast-2.amazonaws.com/prod/hello
```

### Step 7: Test API Gateway Endpoint

I tested the API using curl:

```bash
curl "https://abc123xyz.execute-api.ap-southeast-2.amazonaws.com/prod/hello?name=Developer"
```

Expected response:

```json
{
  "message": "Hello Developer from H-Smart serverless API!",
  "timestamp": "2026-05-08T10:45:30.789012",
  "method": "GET",
  "path": "/hello",
  "service": "H-Smart Backend API",
  "powered_by": "AWS Lambda + API Gateway"
}
```

I also tested from a web browser to verify CORS headers:

```javascript
fetch('https://abc123xyz.execute-api.ap-southeast-2.amazonaws.com/prod/hello?name=WebUser')
  .then(response => response.json())
  .then(data => console.log(data));
```

The request succeeded, confirming that CORS headers are correctly configured.

### Step 8: Review CloudWatch Logs

Lambda automatically logs execution details to CloudWatch Logs.

In the CloudWatch console, I opened Logs → Log groups and found:

```text
/aws/lambda/H-Smart-Hello-API
```

Each Lambda invocation creates a log entry showing:
- Request ID
- Duration (in milliseconds)
- Memory used
- Function output and any print/logging statements

Example log entry:

```text
START RequestId: abc-123-def-456
[INFO] Processing API Gateway request
END RequestId: abc-123-def-456
REPORT RequestId: abc-123-def-456  Duration: 45.23 ms  Billed Duration: 46 ms  Memory Size: 128 MB  Max Memory Used: 42 MB
```

This log confirms:
- The function executed in 45ms
- AWS billed for 46ms (rounded up to nearest millisecond)
- Only 42 MB of the allocated 128 MB memory was used

### Step 9: Add POST Method for Data Submission

To demonstrate request body handling, I added a POST method to the API.

I created a new resource `/submit` and added a POST method with the same Lambda integration.

I updated the Lambda function to handle POST requests:

```python
def lambda_handler(event, context):
    http_method = event.get('httpMethod', 'UNKNOWN')
    
    if http_method == 'POST':
        # Parse request body
        try:
            body = json.loads(event.get('body', '{}'))
            user_data = body.get('data', 'No data provided')
            
            response_body = {
                'message': 'Data received successfully',
                'received_data': user_data,
                'timestamp': datetime.datetime.utcnow().isoformat()
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(response_body)
            }
        except Exception as e:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': str(e)})
            }
    
    # GET request handler (previous code)
    # ...
```

I deployed the API again and tested the POST endpoint:

```bash
curl -X POST \
  https://abc123xyz.execute-api.ap-southeast-2.amazonaws.com/prod/submit \
  -H 'Content-Type: application/json' \
  -d '{"data": "Test submission from H-Smart client"}'
```

Expected response:

```json
{
  "message": "Data received successfully",
  "received_data": "Test submission from H-Smart client",
  "timestamp": "2026-05-08T11:00:15.456789"
}
```

## What I Learned

- AWS Lambda runs code without server management, scaling automatically from zero to thousands of executions.
- Lambda functions require an execution role with CloudWatch Logs permissions.
- Lambda supports multiple runtimes: Python, Node.js, Java, Go, .NET, Ruby, and custom runtimes.
- API Gateway integrates with Lambda using Lambda Proxy Integration, passing the full HTTP request as an event.
- Lambda must return responses in API Gateway format: `statusCode`, `headers`, and `body`.
- API Gateway requires deployment to a stage (e.g., `prod`, `dev`) before endpoints are publicly accessible.
- CORS headers must be explicitly set in Lambda responses to allow cross-origin requests from web browsers.
- CloudWatch Logs automatically capture Lambda execution logs for debugging and monitoring.
- Lambda pricing is based on requests and compute time (GB-seconds), making it cost-effective for variable workloads.

## Evidence and Verification

### Verification Checklist

- Confirm that an IAM role is created with `AWSLambdaBasicExecutionRole` policy.
- Confirm that a Lambda function is created with Python 3.12 runtime.
- Confirm that the Lambda function code parses API Gateway events and returns proper responses.
- Confirm that the Lambda function test succeeds with a simulated API Gateway event.
- Confirm that a REST API is created in API Gateway with Regional endpoint type.
- Confirm that a `/hello` resource with GET method is created using Lambda Proxy Integration.
- Confirm that the API is deployed to a `prod` stage.
- Confirm that the invoke URL is accessible and returns correct JSON responses.
- Confirm that query parameters (e.g., `?name=Test`) are correctly parsed and returned.
- Confirm that CORS headers allow cross-origin requests from web browsers.
- Confirm that CloudWatch Logs show Lambda execution details including duration and memory usage.

## Challenges and Troubleshooting

- Challenge 1: API Gateway returned 502 Bad Gateway error.
  Resolution: The Lambda function was returning an incorrect response format. API Gateway Lambda Proxy Integration requires responses with `statusCode`, `headers`, and `body` fields. I corrected the Lambda function to match the required format.

- Challenge 2: CORS errors appeared when calling the API from a web application.
  Resolution: I added `Access-Control-Allow-Origin: *` header to the Lambda response headers. For production, this should be restricted to specific domains.

- Challenge 3: Lambda function could not be found when creating the API Gateway method.
  Resolution: I ensured the Lambda function and API Gateway were created in the same AWS region (ap-southeast-2). Cross-region integration is not supported without additional configuration.

- Challenge 4: API Gateway returned "Missing Authentication Token" error.
  Resolution: I was accessing an incorrect URL path. The correct URL includes the stage name: `/prod/hello`, not just `/hello`.

## Application to H-Smart

Lambda + API Gateway serverless architecture is highly relevant for H-Smart:

1. **Backend APIs**: H-Smart can build microservices for user authentication, data processing, and business logic without managing servers.

2. **Cost efficiency**: For variable or low-traffic workloads, Lambda's pay-per-use pricing is more cost-effective than running EC2 instances 24/7.

3. **Automatic scaling**: Lambda handles traffic spikes automatically during viral campaigns or peak business hours without manual intervention.

4. **Fast iteration**: Developers can deploy code changes to Lambda in seconds without infrastructure provisioning or server restarts.

5. **Event-driven architecture**: Lambda can be triggered by S3 uploads, DynamoDB changes, SQS messages, or scheduled events for automation workflows.

The recommended next step is to integrate Lambda with DynamoDB for persistent data storage, implement API authentication using API Gateway authorizers or Cognito, and set up CI/CD pipelines for automated Lambda deployments.

## Reference Materials

- [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [What is Amazon API Gateway?](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Using Lambda with API Gateway](https://docs.aws.amazon.com/lambda/latest/dg/with-on-demand-https.html)
