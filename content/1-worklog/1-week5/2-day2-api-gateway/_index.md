---
title: "Day 2 - Amazon API Gateway for RESTful APIs"
date: 2026-05-19
weight: 2
summary: "Built RESTful API with API Gateway, integrated with Lambda functions, configured CORS for frontend access, and deployed API to multiple stages (dev, staging, prod)."
chapter: false
---

## Why I Did This

API Gateway provides a managed API frontend for Lambda functions, handling authentication, rate limiting, caching, and request/response transformation. For the travel platform, API Gateway serves as the entry point for all frontend requests.

## Implementation Steps

### Step 1: Create REST API

1. **API Gateway Console** → **Create API**
2. **REST API** → **Build**
3. **API name**: `TravelPlatformAPI`
4. **Description**: `RESTful API for travel booking platform`
5. **Endpoint type**: Regional
6. **Create API**

### Step 2: Create Resources and Methods

**Create `/bookings` resource:**

1. **Actions** → **Create Resource**
2. **Resource name**: `bookings`
3. **Resource path**: `/bookings`
4. **Enable CORS**: ✓
5. **Create Resource**

**Add GET method:**

1. Select `/bookings` resource
2. **Actions** → **Create Method** → **GET**
3. **Integration type**: Lambda Function
4. **Lambda Region**: ap-southeast-1
5. **Lambda Function**: `GetBookingsFunction`
6. **Save** → **OK** (grant API Gateway permission)

**Add POST method:**

1. Select `/bookings` resource
2. **Actions** → **Create Method** → **POST**
3. **Integration type**: Lambda Function
4. **Lambda Function**: `CreateBookingFunction`
5. **Save**

### Step 3: Create Lambda Functions for API

**GetBookingsFunction:**

```javascript
export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Parse query parameters
  const queryParams = event.queryStringParameters || {};
  const userId = queryParams.userId;
  
  // Mock data - replace with DynamoDB query
  const bookings = [
    {
      id: '1',
      userId: userId || '123',
      destination: 'Tokyo',
      date: '2026-06-15',
      status: 'confirmed'
    },
    {
      id: '2',
      userId: userId || '123',
      destination: 'Singapore',
      date: '2026-07-20',
      status: 'pending'
    }
  ];
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      count: bookings.length,
      bookings: bookings
    })
  };
};
```

**CreateBookingFunction:**

```javascript
export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Parse request body
  const body = JSON.parse(event.body);
  
  // Validate required fields
  if (!body.destination || !body.date) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Missing required fields: destination, date'
      })
    };
  }
  
  // Mock save to database
  const booking = {
    id: Date.now().toString(),
    userId: body.userId || '123',
    destination: body.destination,
    date: body.date,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      booking: booking
    })
  };
};
```

### Step 4: Configure CORS

**Enable CORS for /bookings:**

1. Select `/bookings` resource
2. **Actions** → **Enable CORS**
3. **Access-Control-Allow-Headers**: 
   ```
   Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
   ```
4. **Access-Control-Allow-Methods**: GET, POST, OPTIONS
5. **Access-Control-Allow-Origin**: `*` (or specific domain in production)
6. **Enable CORS and replace existing CORS headers**

### Step 5: Add Path Parameters

**Create `/bookings/{id}` resource:**

1. Select `/bookings` resource
2. **Actions** → **Create Resource**
3. **Resource name**: `{id}`
4. **Resource path**: `/{id}`
5. **Create Resource**

**Add GET method for single booking:**

```javascript
export const handler = async (event) => {
  const bookingId = event.pathParameters.id;
  
  console.log(`Fetching booking: ${bookingId}`);
  
  // Mock data - replace with DynamoDB getItem
  const booking = {
    id: bookingId,
    userId: '123',
    destination: 'Tokyo',
    date: '2026-06-15',
    status: 'confirmed',
    price: 850.00
  };
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      booking: booking
    })
  };
};
```

### Step 6: Add Request Validation

**Create request model:**

1. **Models** → **Create**
2. **Model name**: `BookingModel`
3. **Content type**: `application/json`
4. **Model schema**:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "required": ["destination", "date"],
  "properties": {
    "destination": {
      "type": "string",
      "minLength": 2
    },
    "date": {
      "type": "string",
      "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
    },
    "userId": {
      "type": "string"
    }
  }
}
```

5. **Create model**

**Apply model to POST method:**

1. Select `POST /bookings`
2. **Method Request** → **Edit**
3. **Request Validator**: Validate body
4. **Request Body** → **Add model**
   - Content type: `application/json`
   - Model: `BookingModel`
5. **Save**

### Step 7: Deploy API to Stages

**Create deployment stages:**

1. **Actions** → **Deploy API**
2. **Deployment stage**: [New Stage]
3. **Stage name**: `dev`
4. **Stage description**: `Development environment`
5. **Deploy**

**Repeat for staging and prod:**
- Stage: `staging`
- Stage: `prod`

**Stage-specific settings:**

1. Select `dev` stage
2. **Settings** tab
3. **Enable CloudWatch Logs**: ✓
4. **Log level**: INFO
5. **Enable detailed metrics**: ✓
6. **Save changes**

### Step 8: Test API with curl

**Get all bookings:**

```bash
curl https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com/dev/bookings?userId=123
```

**Create booking:**

```bash
curl -X POST \
  https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com/dev/bookings \
  -H 'Content-Type: application/json' \
  -d '{
    "destination": "Bangkok",
    "date": "2026-08-10",
    "userId": "123"
  }'
```

**Get single booking:**

```bash
curl https://abc123xyz.execute-api.ap-southeast-1.amazonaws.com/dev/bookings/12345
```

## What I Learned

- API Gateway handles request routing, authentication, and throttling
- Lambda proxy integration passes entire request to Lambda
- CORS must be configured for browser-based frontend access
- Stage variables enable environment-specific configuration
- Request validation reduces invalid requests reaching Lambda
- CloudWatch Logs tracks all API requests for debugging
- Deployment stages allow testing before production release

## Application to Travel Platform

**Complete API structure:**

```text
TravelPlatformAPI
├── /bookings
│   ├── GET    → GetBookingsFunction
│   ├── POST   → CreateBookingFunction
│   └── /{id}
│       ├── GET    → GetBookingFunction
│       ├── PUT    → UpdateBookingFunction
│       └── DELETE → DeleteBookingFunction
├── /flights
│   ├── GET    → SearchFlightsFunction
│   └── /{id}
│       └── GET → GetFlightDetailsFunction
├── /hotels
│   ├── GET    → SearchHotelsFunction
│   └── /{id}
│       └── GET → GetHotelDetailsFunction
└── /payments
    └── POST   → ProcessPaymentFunction
```

## Best Practices Applied

- Enable request validation to reduce Lambda invocations
- Use Lambda proxy integration for flexibility
- Configure CORS properly for frontend access
- Enable CloudWatch Logs for debugging
- Use stage variables for environment-specific config
- Implement proper error handling in Lambda functions
- Add rate limiting (throttling) in production

## Reference Materials

- [API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Lambda Proxy Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html)
- [Enable CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)
- [Request Validation](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html)
