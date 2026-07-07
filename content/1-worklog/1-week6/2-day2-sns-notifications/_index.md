---
title: "Day 2 - Amazon SNS for Pub/Sub Messaging"
date: 2026-05-26
weight: 2
summary: "Practiced Amazon SNS by creating topics and subscriptions for pub/sub messaging, integrating with Lambda, SQS, and email endpoints for event-driven notifications."
chapter: false
---

## Why I Did This

Amazon SNS (Simple Notification Service) enables pub/sub messaging where publishers send messages to topics and multiple subscribers receive them simultaneously.

**Benefits:**
- **Fan-out**: One message reaches multiple subscribers
- **Event-driven**: Trigger actions across multiple services
- **Flexible endpoints**: Email, SMS, HTTP, Lambda, SQS
- **Message filtering**: Subscribers receive only relevant messages

For H-Smart: System alerts, order notifications, user activity events.

## Implementation Steps

### Step 1: Create SNS Topic

```bash
aws sns create-topic --name H-Smart-Order-Events
```

Topic ARN: `arn:aws:sns:ap-southeast-2:123456789012:H-Smart-Order-Events`

### Step 2: Create Subscriptions

**Email subscription:**
```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-southeast-2:123456789012:H-Smart-Order-Events \
  --protocol email \
  --notification-endpoint admin@hsmart.com
```

Confirmation email sent to admin@hsmart.com (must click confirmation link).

**Lambda subscription:**
```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-southeast-2:123456789012:H-Smart-Order-Events \
  --protocol lambda \
  --notification-endpoint arn:aws:lambda:ap-southeast-2:123456789012:function:ProcessOrderEvent
```

**SQS subscription (fan-out pattern):**
```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-southeast-2:123456789012:H-Smart-Order-Events \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:ap-southeast-2:123456789012:H-Smart-Analytics-Queue
```

### Step 3: Publish Message to Topic

**Python example:**
```python
import boto3
import json

sns = boto3.client('sns', region_name='ap-southeast-2')
topic_arn = 'arn:aws:sns:ap-southeast-2:123456789012:H-Smart-Order-Events'

response = sns.publish(
    TopicArn=topic_arn,
    Subject='New Order Received',
    Message=json.dumps({
        'eventType': 'ORDER_CREATED',
        'orderId': 'ORD-12345',
        'amount': 99.99,
        'timestamp': '2026-05-26T10:30:00Z'
    }),
    MessageAttributes={
        'eventType': {
            'DataType': 'String',
            'StringValue': 'ORDER_CREATED'
        }
    }
)

print(f"Message published: {response['MessageId']}")
```

All subscribers (email, Lambda, SQS) receive the message simultaneously.

### Step 4: Implement Message Filtering

**Filter policy (only receive high-value orders):**
```json
{
  "amount": [{"numeric": [">=", 100]}]
}
```

**Apply filter to subscription:**
```bash
aws sns set-subscription-attributes \
  --subscription-arn $SUBSCRIPTION_ARN \
  --attribute-name FilterPolicy \
  --attribute-value '{"amount":[{"numeric":[">=",100]}]}'
```

Now this subscriber only receives orders >= $100.

### Step 5: SNS + Lambda Integration

**Lambda function (triggered by SNS):**
```python
import json

def lambda_handler(event, context):
    for record in event['Records']:
        sns_message = json.loads(record['Sns']['Message'])
        
        order_id = sns_message['orderId']
        amount = sns_message['amount']
        
        print(f"Processing order {order_id} with amount ${amount}")
        
        # Send notification to customer
        # Update analytics dashboard
        # Trigger inventory update
    
    return {'statusCode': 200}
```

### Step 6: SNS + SQS Fan-out Pattern

**Architecture:**
```text
Order Service → SNS Topic → SQS Queue 1 (Inventory)
                         → SQS Queue 2 (Analytics)
                         → SQS Queue 3 (Notifications)
```

Each downstream service consumes messages at its own pace without blocking others.

## What I Learned

- SNS enables pub/sub messaging with multiple subscribers per topic
- Fan-out pattern broadcasts one event to multiple services
- Message filtering reduces unnecessary processing
- SNS + Lambda enables serverless event-driven architectures
- SNS + SQS provides reliable async processing with buffering

## Application to H-Smart

**Use cases:**
1. **Order events**: Notify inventory, analytics, and customer service simultaneously
2. **System alerts**: Send CloudWatch alarms to email, Slack, and PagerDuty
3. **User activity**: Broadcast user actions to recommendation engine, analytics, and audit log
4. **Multi-channel notifications**: Send same message via email, SMS, and push notifications

## Reference Materials

- [What is Amazon SNS?](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
- [Subscribing to a topic](https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html)
- [Message filtering](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html)
