---
title: "Day 6 - AWS Step Functions for Workflow Orchestration"
date: 2026-05-30
weight: 6
summary: "Practiced AWS Step Functions by creating state machines for multi-step business processes, coordinating Lambda functions with error handling, retries, and parallel execution."
chapter: false
---

## Why I Did This

AWS Step Functions orchestrates complex workflows by coordinating multiple AWS services with built-in error handling and visualization.

**Benefits:**
- **Visual workflows**: See execution progress in real-time
- **Error handling**: Automatic retries and catch blocks
- **Parallel execution**: Run tasks concurrently for performance
- **Auditing**: Complete execution history for troubleshooting

For H-Smart: Order processing, data pipelines, approval workflows.

## Implementation Steps

### Step 1: Create Lambda Functions

**3 Lambda functions for order workflow:**

**1. ValidateOrder:**
```python
def lambda_handler(event, context):
    order = event['order']
    
    if order['amount'] <= 0:
        raise ValueError("Invalid order amount")
    
    return {
        'orderId': order['orderId'],
        'valid': True
    }
```

**2. ProcessPayment:**
```python
def lambda_handler(event, context):
    order_id = event['orderId']
    
    # Simulate payment processing
    payment_result = process_stripe_payment(order_id)
    
    return {
        'orderId': order_id,
        'paymentStatus': 'SUCCESS'
    }
```

**3. SendConfirmation:**
```python
def lambda_handler(event, context):
    order_id = event['orderId']
    
    # Send email confirmation
    send_email(order_id)
    
    return {
        'orderId': order_id,
        'confirmationSent': True
    }
```

### Step 2: Define State Machine

**state-machine.json:**
```json
{
  "Comment": "H-Smart Order Processing Workflow",
  "StartAt": "ValidateOrder",
  "States": {
    "ValidateOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:ap-southeast-2:123456789012:function:ValidateOrder",
      "Next": "ProcessPayment",
      "Catch": [
        {
          "ErrorEquals": ["ValueError"],
          "Next": "OrderValidationFailed"
        }
      ],
      "Retry": [
        {
          "ErrorEquals": ["States.TaskFailed"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2.0
        }
      ]
    },
    "ProcessPayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:ap-southeast-2:123456789012:function:ProcessPayment",
      "Next": "SendConfirmation",
      "Catch": [
        {
          "ErrorEquals": ["PaymentFailedException"],
          "Next": "PaymentFailed"
        }
      ]
    },
    "SendConfirmation": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:ap-southeast-2:123456789012:function:SendConfirmation",
      "End": true
    },
    "OrderValidationFailed": {
      "Type": "Fail",
      "Error": "ValidationError",
      "Cause": "Order validation failed"
    },
    "PaymentFailed": {
      "Type": "Fail",
      "Error": "PaymentError",
      "Cause": "Payment processing failed"
    }
  }
}
```

### Step 3: Create State Machine

```bash
aws stepfunctions create-state-machine \
  --name H-Smart-Order-Workflow \
  --definition file://state-machine.json \
  --role-arn arn:aws:iam::123456789012:role/StepFunctionsExecutionRole
```

### Step 4: Execute Workflow

**Start execution:**
```bash
aws stepfunctions start-execution \
  --state-machine-arn arn:aws:states:ap-southeast-2:123456789012:stateMachine:H-Smart-Order-Workflow \
  --input '{
    "order": {
      "orderId": "ORD-12345",
      "amount": 99.99,
      "customer": "CUST-789"
    }
  }'
```

**Execution progresses through states:**
```text
ValidateOrder → ProcessPayment → SendConfirmation → SUCCESS
```

### Step 5: Implement Parallel Processing

**Process inventory and analytics concurrently:**
```json
{
  "Comment": "Parallel processing after payment",
  "StartAt": "ProcessPayment",
  "States": {
    "ProcessPayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:function:ProcessPayment",
      "Next": "ParallelProcessing"
    },
    "ParallelProcessing": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "UpdateInventory",
          "States": {
            "UpdateInventory": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:...:function:UpdateInventory",
              "End": true
            }
          }
        },
        {
          "StartAt": "RecordAnalytics",
          "States": {
            "RecordAnalytics": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:...:function:RecordAnalytics",
              "End": true
            }
          }
        }
      ],
      "Next": "SendConfirmation"
    },
    "SendConfirmation": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...:function:SendConfirmation",
      "End": true
    }
  }
}
```

Both tasks run simultaneously, reducing total workflow time.

### Step 6: Add Wait State for Approval

**Manual approval workflow:**
```json
{
  "CheckOrderAmount": {
    "Type": "Choice",
    "Choices": [
      {
        "Variable": "$.order.amount",
        "NumericGreaterThan": 1000,
        "Next": "WaitForApproval"
      }
    ],
    "Default": "ProcessPayment"
  },
  "WaitForApproval": {
    "Type": "Task",
    "Resource": "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
    "Parameters": {
      "QueueUrl": "https://sqs.ap-southeast-2.amazonaws.com/.../approval-queue",
      "MessageBody": {
        "orderId.$": "$.order.orderId",
        "taskToken.$": "$$.Task.Token"
      }
    },
    "Next": "ProcessPayment"
  }
}
```

Workflow pauses until approval task completes.

## What I Learned

- Step Functions orchestrate multi-step workflows with visual state machines
- Error handling with Catch blocks and automatic Retry policies
- Parallel state executes branches concurrently
- Choice state enables conditional branching
- Wait state pauses execution for manual approval or scheduled delays
- Execution history provides complete audit trail

## Application to H-Smart

**Use cases:**
1. **Order processing**: Validate → Payment → Inventory → Shipping → Confirmation
2. **Data pipelines**: Extract → Transform → Load with error recovery
3. **Approval workflows**: High-value orders require manager approval
4. **Multi-step onboarding**: User signup → Email verification → Profile setup
5. **Scheduled jobs**: Daily reports, monthly invoices, annual renewals

**Benefits for H-Smart:**
- Visual debugging of complex workflows
- Automatic retries reduce manual intervention
- Parallel processing improves performance
- Execution history aids troubleshooting

## Reference Materials

- [What is Step Functions?](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html)
- [States and state machines](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-states.html)
- [Error handling](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html)
