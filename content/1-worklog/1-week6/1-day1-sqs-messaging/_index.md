---
title: "Day 1 - Amazon SQS for Asynchronous Message Queuing"
date: 2026-05-25
weight: 1
summary: "Practiced Amazon SQS by creating standard and FIFO queues for asynchronous message processing, implementing producer-consumer pattern for decoupled microservices architecture."
chapter: false
---

## Why I Did This

Amazon SQS (Simple Queue Service) enables asynchronous communication between distributed application components by storing messages in a queue until they're processed.

**Benefits:**
- **Decoupling**: Services communicate without direct dependencies
- **Scalability**: Consumers scale independently based on queue depth
- **Reliability**: Messages persist until successfully processed
- **Load leveling**: Smooths traffic spikes by buffering requests

For H-Smart: Order processing, image uploads, email notifications can run asynchronously.

## Implementation Steps

### Step 1: Create Standard Queue

```bash
aws sqs create-queue --queue-name H-Smart-Orders-Queue
```

**Standard queue characteristics:**
- Unlimited throughput
- At-least-once delivery (messages may be delivered multiple times)
- Best-effort ordering (messages may arrive out of order)

### Step 2: Create FIFO Queue

```bash
aws sqs create-queue \
  --queue-name H-Smart-Orders-FIFO.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true
```

**FIFO queue characteristics:**
- Exactly-once processing
- Strict message ordering
- Up to 3000 messages per second with batching
- Requires `.fifo` suffix in queue name

### Step 3: Send Messages to Queue

**Python producer example:**
```python
import boto3
import json

sqs = boto3.client('sqs', region_name='ap-southeast-2')
queue_url = 'https://sqs.ap-southeast-2.amazonaws.com/123456789012/H-Smart-Orders-Queue'

# Send message
response = sqs.send_message(
    QueueUrl=queue_url,
    MessageBody=json.dumps({
        'orderId': 'ORD-12345',
        'customerId': 'CUST-789',
        'amount': 99.99,
        'items': ['PROD-001', 'PROD-002']
    })
)

print(f"Message sent: {response['MessageId']}")
```

### Step 4: Receive and Process Messages

**Python consumer example:**
```python
while True:
    # Receive messages (long polling)
    messages = sqs.receive_message(
        QueueUrl=queue_url,
        MaxNumberOfMessages=10,
        WaitTimeSeconds=20,  # Long polling reduces API calls
        VisibilityTimeout=30  # Hide message while processing
    )
    
    for message in messages.get('Messages', []):
        try:
            body = json.loads(message['Body'])
            process_order(body)
            
            # Delete message after successful processing
            sqs.delete_message(
                QueueUrl=queue_url,
                ReceiptHandle=message['ReceiptHandle']
            )
        except Exception as e:
            print(f"Error processing message: {e}")
            # Message becomes visible again after VisibilityTimeout
```

### Step 5: Configure Dead Letter Queue

**Create DLQ:**
```bash
aws sqs create-queue --queue-name H-Smart-Orders-DLQ
```

**Attach DLQ to main queue:**
```bash
aws sqs set-queue-attributes \
  --queue-url $QUEUE_URL \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:ap-southeast-2:123456789012:H-Smart-Orders-DLQ\",\"maxReceiveCount\":\"3\"}"
  }'
```

Messages that fail processing 3 times move to DLQ for manual investigation.

## What I Learned

- SQS decouples producers and consumers for scalable architectures
- Standard queues optimize for throughput, FIFO queues guarantee ordering
- Visibility timeout prevents multiple consumers processing same message
- Long polling reduces costs by waiting for messages instead of continuous polling
- Dead letter queues capture failed messages for debugging

## Application to H-Smart

**Use cases:**
1. **Order processing**: Queue orders for async payment verification and inventory check
2. **Image processing**: Queue uploaded images for resizing and thumbnail generation
3. **Email notifications**: Queue emails to avoid blocking API responses
4. **Background jobs**: Queue data exports, report generation, log analysis

## Reference Materials

- [What is Amazon SQS?](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)
- [Standard queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html)
- [FIFO queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html)
