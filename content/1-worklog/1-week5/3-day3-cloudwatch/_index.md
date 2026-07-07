---
title: "Day 3 - Amazon CloudWatch for Monitoring and Logging"
date: 2026-05-20
weight: 3
summary: "Configured CloudWatch for comprehensive monitoring, created custom metrics and dashboards, set up log groups for Lambda functions, and configured alarms for automated alerting."
chapter: false
---

## Why I Did This

CloudWatch provides visibility into application health, performance metrics, and operational issues. For the travel platform, CloudWatch enables proactive monitoring, debugging, and alerting before users are impacted.

## Implementation Steps

### Step 1: View Lambda Metrics

1. **Lambda Console** → Select function
2. **Monitor** tab
3. **View CloudWatch metrics**:
   - Invocations
   - Duration
   - Error count and success rate
   - Throttles
   - Concurrent executions

### Step 2: Create Custom CloudWatch Dashboard

1. **CloudWatch Console** → **Dashboards** → **Create dashboard**
2. **Dashboard name**: `TravelPlatformDashboard`
3. **Create dashboard**

**Add Lambda metrics widget:**

1. **Add widget** → **Line**
2. **Metrics** → **Lambda** → **By Function Name**
3. Select metrics:
   - `Invocations` (GetBookingsFunction)
   - `Duration` (GetBookingsFunction)
   - `Errors` (GetBookingsFunction)
4. **Create widget**

**Add API Gateway metrics:**

1. **Add widget** → **Line**
2. **Metrics** → **API Gateway** → **By API Name**
3. Select metrics:
   - `Count` (request count)
   - `Latency` (response time)
   - `4XXError` (client errors)
   - `5XXError` (server errors)
4. **Create widget**

### Step 3: Configure CloudWatch Logs for Lambda

**Lambda automatically logs to CloudWatch:**

1. **CloudWatch Console** → **Log groups**
2. Find log group: `/aws/lambda/GetBookingsFunction`
3. **Log streams** → Select recent stream
4. View log events

**Add custom logging to Lambda:**

```javascript
export const handler = async (event) => {
  console.log('REQUEST:', JSON.stringify({
    requestId: event.requestContext.requestId,
    path: event.path,
    method: event.httpMethod,
    ip: event.requestContext.identity.sourceIp,
    userAgent: event.requestContext.identity.userAgent
  }));
  
  try {
    // Business logic
    const result = await processBooking(event);
    
    console.log('SUCCESS:', JSON.stringify({
      requestId: event.requestContext.requestId,
      duration: Date.now(),
      result: result
    }));
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
    
  } catch (error) {
    console.error('ERROR:', JSON.stringify({
      requestId: event.requestContext.requestId,
      error: error.message,
      stack: error.stack
    }));
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function processBooking(event) {
  // Mock processing
  return { bookingId: '12345', status: 'confirmed' };
}
```

### Step 4: Create Log Insights Query

**Query Lambda errors:**

1. **CloudWatch Console** → **Logs Insights**
2. **Select log groups**: `/aws/lambda/*`
3. **Query**:

```sql
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100
```

**Query API latency:**

```sql
fields @timestamp, @duration, @requestId
| filter @type = "REPORT"
| stats avg(@duration), max(@duration), min(@duration) by bin(5m)
```

**Query by user:**

```sql
fields @timestamp, @message
| parse @message /userId: "(?<userId>[^"]+)"/
| filter userId = "123"
| sort @timestamp desc
```

### Step 5: Create CloudWatch Alarms

**Alarm for Lambda errors:**

1. **CloudWatch Console** → **Alarms** → **Create alarm**
2. **Select metric** → **Lambda** → **By Function Name**
3. Select `Errors` for `GetBookingsFunction`
4. **Metric name**: Errors
5. **Statistic**: Sum
6. **Period**: 5 minutes
7. **Conditions**:
   - Threshold type: Static
   - Greater than: 5
8. **Next**

**Configure SNS notification:**

1. **Alarm state trigger**: In alarm
2. **SNS topic**: Create new topic
   - Topic name: `LambdaErrorAlerts`
   - Email: your-email@example.com
3. **Create topic**
4. **Next** → **Alarm name**: `HighLambdaErrors`
5. **Create alarm**

**Confirm SNS subscription:**
- Check email inbox
- Click "Confirm subscription" link

**Additional alarms:**

**API Gateway 5XX errors:**
```
Metric: 5XXError
Statistic: Sum
Period: 5 minutes
Threshold: > 10
```

**Lambda duration:**
```
Metric: Duration
Statistic: Average
Period: 5 minutes
Threshold: > 3000 ms
```

### Step 6: Create Custom Metrics

**Publish custom metric from Lambda:**

```javascript
import { CloudWatch } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatch();

export const handler = async (event) => {
  // Business logic
  const bookingCount = await processBookings();
  
  // Publish custom metric
  await cloudwatch.putMetricData({
    Namespace: 'TravelPlatform',
    MetricData: [
      {
        MetricName: 'BookingsProcessed',
        Value: bookingCount,
        Unit: 'Count',
        Timestamp: new Date(),
        Dimensions: [
          {
            Name: 'Environment',
            Value: process.env.ENVIRONMENT || 'dev'
          }
        ]
      }
    ]
  });
  
  return { statusCode: 200, body: JSON.stringify({ count: bookingCount }) };
};

async function processBookings() {
  // Mock processing
  return 42;
}
```

**View custom metric:**

1. **CloudWatch Console** → **Metrics** → **All metrics**
2. **Custom namespaces** → **TravelPlatform**
3. Select **BookingsProcessed** metric
4. **Graphed metrics** → Change period to 5 minutes

### Step 7: Set Log Retention

**Reduce storage costs:**

1. **CloudWatch Console** → **Log groups**
2. Select log group: `/aws/lambda/GetBookingsFunction`
3. **Actions** → **Edit retention setting**
4. **Retention**: 7 days (or 30 days for production)
5. **Save**

## What I Learned

- CloudWatch automatically collects metrics from AWS services
- Lambda logs are stored in CloudWatch Logs by default
- Log Insights provides SQL-like queries for log analysis
- Alarms can trigger SNS notifications for automated alerting
- Custom metrics enable business-specific monitoring
- Log retention reduces storage costs
- Dashboards provide real-time visibility into system health

## Application to Travel Platform

**Complete monitoring setup:**

```text
CloudWatch Dashboard: TravelPlatformDashboard
├── Lambda Metrics
│   ├── Invocations (all functions)
│   ├── Duration (response time)
│   ├── Errors (failure rate)
│   └── Concurrent Executions
├── API Gateway Metrics
│   ├── Request Count
│   ├── Latency (p50, p99)
│   ├── 4XX Errors (client errors)
│   └── 5XX Errors (server errors)
├── Custom Metrics
│   ├── BookingsProcessed
│   ├── PaymentSuccessRate
│   └── SearchQueriesPerMinute
└── Alarms
    ├── HighLambdaErrors → SNS
    ├── HighAPILatency → SNS
    └── HighErrorRate → SNS
```

## Best Practices Applied

- Enable detailed CloudWatch metrics for all services
- Create dashboards for at-a-glance system health
- Set up alarms for critical metrics (errors, latency)
- Use Log Insights for troubleshooting
- Publish custom metrics for business KPIs
- Set appropriate log retention to control costs
- Use structured logging (JSON) for easier parsing

## Reference Materials

- [CloudWatch User Guide](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)
- [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)
- [CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
- [Custom Metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html)
