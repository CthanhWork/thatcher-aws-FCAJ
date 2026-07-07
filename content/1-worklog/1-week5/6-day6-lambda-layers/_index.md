---
title: "Day 6 - Lambda Layers and Serverless Best Practices"
date: 2026-05-23
weight: 6
summary: "Mastered Lambda Layers for code reuse, optimized Lambda performance (cold starts, memory allocation), implemented function versioning and aliases for safe deployments, and applied serverless best practices."
chapter: false
---

## Why I Did This

Lambda Layers enable sharing code and dependencies across multiple functions, reducing deployment package size and improving maintainability. Versioning and aliases enable safe, zero-downtime deployments with rollback capability.

## Implementation Steps

### Step 1: Create Lambda Layer for Shared Dependencies

**Install dependencies locally:**

```bash
mkdir -p lambda-layer/nodejs
cd lambda-layer/nodejs
npm init -y
npm install aws-sdk uuid moment
cd ..
zip -r layer.zip nodejs
```

**Create Lambda Layer:**

1. **Lambda Console** → **Layers** → **Create layer**
2. **Name**: `CommonDependenciesLayer`
3. **Description**: `Shared npm packages for Lambda functions`
4. **Upload**: `layer.zip`
5. **Compatible runtimes**: Node.js 18.x, 20.x
6. **Create**

### Step 2: Use Layer in Lambda Function

**Create Lambda function:**

```javascript
// No need to import aws-sdk or moment - available from layer
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const handler = async (event) => {
  const requestId = uuidv4();
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  
  console.log(`Request ID: ${requestId}`);
  console.log(`Timestamp: ${timestamp}`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      requestId: requestId,
      timestamp: timestamp,
      message: 'Using shared layer dependencies'
    })
  };
};
```

**Attach layer to function:**

1. **Lambda function** → **Code** tab
2. **Layers** section → **Add a layer**
3. **Layer source**: Custom layers
4. **Custom layers**: `CommonDependenciesLayer`
5. **Version**: 1
6. **Add**

### Step 3: Create Utility Functions Layer

**Create helper functions:**

```javascript
// lambda-layer/nodejs/utils/response.js
export const success = (data) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({ success: true, data })
});

export const error = (message, statusCode = 500) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({ success: false, error: message })
});

// lambda-layer/nodejs/utils/validator.js
export const validateBooking = (booking) => {
  if (!booking.destination) {
    throw new Error('Destination is required');
  }
  if (!booking.date) {
    throw new Error('Date is required');
  }
  if (!booking.userId) {
    throw new Error('User ID is required');
  }
  return true;
};

// lambda-layer/nodejs/utils/logger.js
export const log = (level, message, metadata = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata
  };
  console.log(JSON.stringify(logEntry));
};
```

**Package and create layer:**

```bash
cd lambda-layer
zip -r utils-layer.zip nodejs/
```

**Use utilities in Lambda:**

```javascript
import { success, error } from '/opt/nodejs/utils/response.js';
import { validateBooking } from '/opt/nodejs/utils/validator.js';
import { log } from '/opt/nodejs/utils/logger.js';

export const handler = async (event) => {
  try {
    log('INFO', 'Processing booking request', { requestId: event.requestId });
    
    const booking = JSON.parse(event.body);
    validateBooking(booking);
    
    // Process booking
    const result = await createBooking(booking);
    
    log('INFO', 'Booking created', { bookingId: result.id });
    return success(result);
    
  } catch (err) {
    log('ERROR', err.message, { stack: err.stack });
    return error(err.message, 400);
  }
};

async function createBooking(booking) {
  // Mock save to DynamoDB
  return { id: Date.now().toString(), ...booking };
}
```

### Step 4: Optimize Lambda Cold Starts

**Best practices for reducing cold starts:**

**1. Minimize deployment package size:**

```bash
# Remove dev dependencies
npm install --production

# Use webpack/esbuild to bundle
npm install -g esbuild
esbuild index.js --bundle --platform=node --outfile=dist/index.js
```

**2. Keep Lambda warm with scheduled pings:**

```javascript
// WarmupFunction
export const handler = async (event) => {
  // Triggered by EventBridge every 5 minutes
  console.log('Keeping Lambda warm');
  return { statusCode: 200 };
};
```

EventBridge rule: `rate(5 minutes)` → Target: Lambda function

**3. Provision concurrency for critical functions:**

1. **Lambda function** → **Configuration** → **Concurrency**
2. **Provisioned concurrency**: 2 instances
3. **Save** (incurs additional cost)

**4. Use ARM architecture (Graviton2):**

- 20% better price performance
- Enable in function configuration

### Step 5: Optimize Memory Allocation

**Find optimal memory setting:**

```javascript
// MemoryBenchmark function
export const handler = async (event) => {
  const start = Date.now();
  
  // Simulate CPU-intensive task
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i);
  }
  
  const duration = Date.now() - start;
  const memory = process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE;
  
  console.log(JSON.stringify({
    memory: `${memory} MB`,
    duration: `${duration} ms`,
    cost: calculateCost(memory, duration)
  }));
  
  return { statusCode: 200 };
};

function calculateCost(memory, duration) {
  // $0.0000166667 per GB-second
  const gbSeconds = (memory / 1024) * (duration / 1000);
  return (gbSeconds * 0.0000166667).toFixed(6);
}
```

**Test with different memory settings:**

- 128 MB → 2000ms → $0.000042
- 512 MB → 500ms → $0.000042 (same cost, 4x faster!)
- 1024 MB → 250ms → $0.000042
- 3008 MB → 100ms → $0.000050

**Recommendation:** Use 512-1024 MB for balanced performance/cost.

### Step 6: Implement Function Versioning

**Publish version:**

1. **Lambda function** → **Actions** → **Publish new version**
2. **Version description**: `Initial production release`
3. **Publish**

Version ARN: `arn:aws:lambda:ap-southeast-1:123456789:function:MyFunction:1`

**Create additional versions:**

```bash
# Update function code
aws lambda update-function-code \
  --function-name MyFunction \
  --zip-file fileb://function.zip

# Publish version 2
aws lambda publish-version \
  --function-name MyFunction \
  --description "Added error handling"
```

### Step 7: Create Aliases for Deployment

**Create DEV alias:**

1. **Aliases** tab → **Create alias**
2. **Name**: `dev`
3. **Version**: `$LATEST` (always latest code)
4. **Create**

**Create PROD alias:**

1. **Create alias**
2. **Name**: `prod`
3. **Version**: 1 (specific stable version)
4. **Create**

**Use alias in API Gateway:**

```
Lambda function: MyFunction:prod
```

**Weighted alias for canary deployment:**

1. **Edit alias**: `prod`
2. **Additional version**: 2
3. **Weight**: 10% (send 10% traffic to v2, 90% to v1)
4. **Save**

Monitor metrics, then shift 100% to v2 if successful.

### Step 8: Implement Environment-Specific Configuration

**Use alias environment variables:**

```javascript
export const handler = async (event) => {
  const env = process.env.ENVIRONMENT || 'dev';
  const dbEndpoint = process.env.DB_ENDPOINT;
  const apiKey = process.env.API_KEY;
  
  console.log(`Running in ${env} environment`);
  console.log(`Using database: ${dbEndpoint}`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ environment: env })
  };
};
```

**Configure per alias:**

1. **Alias**: `dev` → **Environment variables**:
   - `ENVIRONMENT=dev`
   - `DB_ENDPOINT=dev-db.example.com`
2. **Alias**: `prod` → **Environment variables**:
   - `ENVIRONMENT=prod`
   - `DB_ENDPOINT=prod-db.example.com`

### Step 9: Apply Serverless Best Practices

**1. Make functions idempotent:**

```javascript
export const handler = async (event) => {
  const requestId = event.requestId;
  
  // Check if already processed
  const existing = await checkIfProcessed(requestId);
  if (existing) {
    console.log(`Request ${requestId} already processed`);
    return existing;
  }
  
  // Process and save result
  const result = await processRequest(event);
  await saveResult(requestId, result);
  
  return result;
};
```

**2. Use async/await over callbacks:**

```javascript
// Bad
export const handler = (event, context, callback) => {
  doSomething(event, (err, result) => {
    if (err) callback(err);
    else callback(null, result);
  });
};

// Good
export const handler = async (event) => {
  const result = await doSomething(event);
  return result;
};
```

**3. Reuse connections outside handler:**

```javascript
import { DynamoDB } from '@aws-sdk/client-dynamodb';

// Initialize outside handler (reused across invocations)
const dynamodb = new DynamoDB();

export const handler = async (event) => {
  // Use existing connection
  const result = await dynamodb.getItem({
    TableName: 'Bookings',
    Key: { id: { S: event.id } }
  });
  
  return result;
};
```

**4. Set appropriate timeouts:**

```javascript
// Quick API response: 10 seconds
// Background processing: 5 minutes
// Batch jobs: 15 minutes (max)
```

**5. Enable X-Ray tracing:**

1. **Configuration** → **Monitoring and operations tools**
2. **Active tracing**: Enable
3. **Save**

## What I Learned

- Lambda Layers reduce deployment size and enable code reuse
- Optimal memory allocation balances cost and performance
- Versioning enables rollback to previous stable versions
- Aliases enable blue-green and canary deployments
- Provisioned concurrency eliminates cold starts (at extra cost)
- ARM architecture provides better price-performance
- Connection reuse significantly improves performance

## Cost Comparison

**Without optimization:**
- 10M requests/month
- 128 MB memory
- 1000ms average duration
- Cost: ~$20/month

**With optimization:**
- 10M requests/month
- 512 MB memory (optimized code)
- 200ms average duration
- Reused connections
- Cost: ~$4/month (80% savings!)

## Reference Materials

- [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Function Versions](https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html)
- [Lambda Aliases](https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html)
- [Lambda Performance](https://docs.aws.amazon.com/lambda/latest/operatorguide/perf-optimize.html)
