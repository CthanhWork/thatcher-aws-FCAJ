---
title: "Day 1 - AWS Lambda for Serverless Compute"
date: 2026-05-18
weight: 1
summary: "Learned AWS Lambda fundamentals, created serverless functions with Node.js and Python, configured triggers, environment variables, and IAM execution roles for secure function execution."
chapter: false
---

## Why I Did This

AWS Lambda eliminates server management overhead and enables event-driven architectures. For the travel platform, Lambda functions can handle API requests, process S3 uploads, and respond to database events without maintaining servers.

Lambda's pay-per-execution model makes it cost-effective for variable workloads.

## Implementation Steps

### Step 1: Create First Lambda Function (Node.js)

1. **Lambda Console** → **Create function**
2. **Function name**: `HelloWorldFunction`
3. **Runtime**: Node.js 20.x
4. **Architecture**: x86_64
5. **Create function**

**Default code:**
```javascript
export const handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
```

6. **Deploy** → **Test** → Create test event
7. **Event name**: `TestEvent`
8. **Event JSON**: `{}`
9. **Test** → View execution results

### Step 2: Create Lambda Function with Environment Variables

**Function: `ConfigurableLambda`**

```javascript
export const handler = async (event) => {
  const appName = process.env.APP_NAME || 'Default App';
  const environment = process.env.ENVIRONMENT || 'dev';
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Running ${appName} in ${environment} environment`,
      timestamp: new Date().toISOString()
    })
  };
};
```

**Configuration:**
1. **Configuration** tab → **Environment variables**
2. **Edit** → Add:
   - `APP_NAME`: `TravelPlatform`
   - `ENVIRONMENT`: `dev`
3. **Save**

### Step 3: Create Python Lambda Function

**Function: `DataProcessorFunction`**

```python
import json
import os
from datetime import datetime

def lambda_handler(event, context):
    app_name = os.environ.get('APP_NAME', 'Travel Platform')
    
    # Process event data
    processed_data = {
        'app': app_name,
        'processed_at': datetime.now().isoformat(),
        'event_type': event.get('type', 'unknown'),
        'record_count': len(event.get('records', []))
    }
    
    return {
        'statusCode': 200,
        'body': json.dumps(processed_data)
    }
```

### Step 4: Configure IAM Execution Role

**Create custom role for Lambda:**

1. **IAM Console** → **Roles** → **Create role**
2. **Trusted entity**: AWS service → Lambda
3. **Permissions policies**:
   - `AWSLambdaBasicExecutionRole` (CloudWatch Logs)
   - `AmazonS3ReadOnlyAccess` (read S3 objects)
   - `AmazonDynamoDBReadOnlyAccess` (read DynamoDB tables)
4. **Role name**: `TravelPlatformLambdaRole`
5. **Create role**

**Attach role to Lambda:**
1. **Lambda function** → **Configuration** → **Permissions**
2. **Execution role** → **Edit**
3. **Existing role**: `TravelPlatformLambdaRole`
4. **Save**

### Step 5: Configure Memory and Timeout

**Optimize function performance:**

1. **Configuration** → **General configuration** → **Edit**
2. **Memory**: 512 MB (balance between cost and performance)
3. **Timeout**: 30 seconds
4. **Ephemeral storage**: 512 MB (default)
5. **Save**

### Step 6: Add S3 Trigger

**Trigger Lambda on S3 upload:**

1. **Function** → **Add trigger**
2. **Source**: S3
3. **Bucket**: Select existing bucket or create new
4. **Event type**: All object create events
5. **Prefix**: `uploads/` (optional - only trigger for specific path)
6. **Suffix**: `.jpg` (optional - only trigger for specific file type)
7. **Add**

**Update function code to process S3 events:**

```javascript
export const handler = async (event) => {
  console.log('S3 Event:', JSON.stringify(event, null, 2));
  
  const s3Record = event.Records[0].s3;
  const bucketName = s3Record.bucket.name;
  const objectKey = s3Record.object.key;
  
  console.log(`New file uploaded: ${objectKey} in bucket ${bucketName}`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'File processed successfully',
      bucket: bucketName,
      key: objectKey
    })
  };
};
```

## What I Learned

- Lambda functions scale automatically based on incoming requests
- Each function has its own execution environment (isolated)
- Cold starts occur when function hasn't been invoked recently (~1-3s delay)
- Warm invocations reuse existing execution context (much faster)
- Environment variables are encrypted at rest
- IAM execution roles define what AWS services Lambda can access
- Memory allocation also affects CPU power (more memory = more CPU)
- Maximum execution time is 15 minutes per invocation

## Application to Travel Platform

**Lambda use cases for project:**

```text
API Backend:
 └── Lambda functions behind API Gateway
     ├── searchFlights (query flight data)
     ├── createBooking (save booking to DynamoDB)
     ├── processPayment (integrate with payment service)
     └── sendConfirmation (trigger email via SES)

Event Processing:
 └── S3 upload triggers
     ├── processImageUpload (resize, optimize images)
     ├── generateThumbnail (create thumbnails)
     └── updateSearchIndex (update Elasticsearch)

Scheduled Tasks:
 └── EventBridge cron triggers
     ├── sendDailyReport (aggregate analytics)
     ├── cleanupExpiredBookings (delete old records)
     └── refreshCache (update Redis cache)
```

## Best Practices Applied

- Set appropriate memory allocation (monitor CloudWatch metrics)
- Use environment variables for configuration
- Enable CloudWatch Logs for debugging
- Set reasonable timeout values (don't use max unless needed)
- Use layers for shared dependencies (covered in Day 6)
- Keep functions small and focused (single responsibility)

## Reference Materials

- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Lambda Execution Role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)
- [Lambda Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
