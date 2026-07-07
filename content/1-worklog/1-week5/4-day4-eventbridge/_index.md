---
title: "Day 4 - Amazon EventBridge for Event-Driven Architecture"
date: 2026-05-21
weight: 4
summary: "Implemented event-driven architecture with EventBridge, created event rules and patterns for routing, built scheduled tasks with cron expressions, and integrated multiple targets including Lambda and SNS."
chapter: false
---

## Why I Did This

EventBridge enables loosely-coupled, event-driven architectures where services communicate through events rather than direct calls. For the travel platform, EventBridge coordinates workflows like booking confirmations, payment processing, and scheduled maintenance tasks.

## Implementation Steps

### Step 1: Create Custom Event Bus

1. **EventBridge Console** → **Event buses** → **Create event bus**
2. **Name**: `TravelPlatformEventBus`
3. **Event archive**: Disabled (enable for audit requirements)
4. **Create**

### Step 2: Create Lambda Function to Publish Events

**BookingCreatedPublisher:**

```javascript
import { EventBridge } from '@aws-sdk/client-eventbridge';

const eventBridge = new EventBridge();

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  
  // Create booking (mock)
  const booking = {
    id: Date.now().toString(),
    userId: body.userId,
    destination: body.destination,
    date: body.date,
    price: body.price,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // Publish event to EventBridge
  await eventBridge.putEvents({
    Entries: [
      {
        Source: 'travel-platform.bookings',
        DetailType: 'BookingCreated',
        Detail: JSON.stringify(booking),
        EventBusName: 'TravelPlatformEventBus'
      }
    ]
  });
  
  console.log('Published BookingCreated event:', booking.id);
  
  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      booking: booking
    })
  };
};
```

**Update Lambda IAM role:**
- Add policy: `AmazonEventBridgeFullAccess`

### Step 3: Create Event Rule with Pattern Matching

**Rule: Send confirmation email on booking:**

1. **EventBridge Console** → **Rules** → **Create rule**
2. **Name**: `SendBookingConfirmation`
3. **Event bus**: `TravelPlatformEventBus`
4. **Rule type**: Rule with an event pattern
5. **Next**

**Event pattern:**

```json
{
  "source": ["travel-platform.bookings"],
  "detail-type": ["BookingCreated"]
}
```

6. **Next** → **Target**
7. **Target type**: AWS service
8. **Select a target**: Lambda function
9. **Function**: `SendConfirmationEmailFunction`
10. **Create rule**

### Step 4: Create Lambda Functions as Event Targets

**SendConfirmationEmailFunction:**

```javascript
export const handler = async (event) => {
  console.log('BookingCreated event received:', JSON.stringify(event, null, 2));
  
  const booking = event.detail;
  
  // Mock send email (replace with SES)
  console.log(`Sending confirmation email for booking ${booking.id}`);
  console.log(`To: user-${booking.userId}@example.com`);
  console.log(`Subject: Booking Confirmation - ${booking.destination}`);
  console.log(`Body: Your booking for ${booking.destination} on ${booking.date} is confirmed!`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Confirmation email sent' })
  };
};
```

**UpdateAnalyticsFunction:**

```javascript
export const handler = async (event) => {
  console.log('BookingCreated event received');
  
  const booking = event.detail;
  
  // Mock update analytics (replace with DynamoDB)
  console.log('Updating analytics:', {
    destination: booking.destination,
    price: booking.price,
    date: booking.date
  });
  
  return { statusCode: 200 };
};
```

### Step 5: Create Multiple Targets for Same Event

**Add second rule for same event:**

1. **Create rule**: `UpdateAnalyticsOnBooking`
2. **Event bus**: `TravelPlatformEventBus`
3. **Event pattern**: Same as above
4. **Target**: `UpdateAnalyticsFunction`

**Add SNS target for notifications:**

1. **Create rule**: `NotifyAdminOnBooking`
2. **Event pattern**: Same as above
3. **Target type**: SNS topic
4. **Topic**: Create new topic `BookingNotifications`
5. **Configure input**: Input transformer
   - Input path:
   ```json
   {
     "id": "$.detail.id",
     "destination": "$.detail.destination",
     "price": "$.detail.price"
   }
   ```
   - Template:
   ```
   "New booking created: <id> to <destination> for $<price>"
   ```

### Step 6: Create Scheduled Rule (Cron)

**Rule: Daily cleanup task:**

1. **Create rule**: `DailyBookingCleanup`
2. **Rule type**: Schedule
3. **Schedule pattern**: Cron expression
4. **Cron expression**: `0 2 * * ? *` (2 AM UTC daily)
5. **Next**

**Target Lambda function:**

```javascript
export const handler = async (event) => {
  console.log('Running daily cleanup task');
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  
  console.log(`Cleaning up bookings older than ${thirtyDaysAgo.toISOString()}`);
  
  // Mock cleanup (replace with DynamoDB query + delete)
  const deletedCount = Math.floor(Math.random() * 10);
  console.log(`Deleted ${deletedCount} expired bookings`);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Cleanup completed',
      deletedCount: deletedCount
    })
  };
};
```

### Step 7: Create Rate-based Schedule

**Rule: Check payment status every 5 minutes:**

1. **Create rule**: `CheckPendingPayments`
2. **Schedule pattern**: Rate expression
3. **Rate**: `5` minutes
4. **Target**: `CheckPaymentStatusFunction`

### Step 8: Add Event Pattern with Filtering

**Rule: Alert on high-value bookings:**

1. **Create rule**: `HighValueBookingAlert`
2. **Event bus**: `TravelPlatformEventBus`
3. **Event pattern**:

```json
{
  "source": ["travel-platform.bookings"],
  "detail-type": ["BookingCreated"],
  "detail": {
    "price": [{ "numeric": [">=", 1000] }]
  }
}
```

4. **Target**: SNS topic `HighValueBookingAlerts`

### Step 9: Test Event Publishing

**Test event pattern:**

1. **EventBridge Console** → **Event buses** → `TravelPlatformEventBus`
2. **Send events** → **Send test event**
3. **Event pattern**:

```json
{
  "source": "travel-platform.bookings",
  "detail-type": "BookingCreated",
  "detail": {
    "id": "test-123",
    "userId": "user-456",
    "destination": "Tokyo",
    "date": "2026-07-15",
    "price": 1500.00,
    "status": "confirmed"
  }
}
```

4. **Send event**

**Verify targets invoked:**
- Check Lambda CloudWatch Logs
- Check SNS email/notifications

## What I Learned

- EventBridge decouples services through event-driven patterns
- Multiple targets can process the same event independently
- Event patterns enable content-based routing
- Scheduled rules support both cron and rate expressions
- Events are delivered at-least-once (targets should be idempotent)
- EventBridge supports cross-account and cross-region events
- Event archive enables replaying events for testing/debugging

## Application to Travel Platform

**Event-driven architecture:**

```text
Event Sources → EventBridge → Targets

Booking Flow:
  BookingCreated event
    → SendConfirmationEmail (Lambda)
    → UpdateAnalytics (Lambda)
    → NotifyAdmin (SNS)
    → ProcessPayment (Lambda)

Payment Flow:
  PaymentReceived event
    → UpdateBookingStatus (Lambda)
    → GenerateInvoice (Lambda)
    → SendReceipt (SES)

Scheduled Tasks:
  Every 5 min: CheckPendingPayments
  Every hour: SyncInventory
  Daily 2 AM: CleanupExpiredBookings
  Weekly Mon: GenerateWeeklyReport
```

**Event schema examples:**

```json
BookingCreated: {
  "source": "travel-platform.bookings",
  "detail-type": "BookingCreated",
  "detail": { "id", "userId", "destination", "price", "date" }
}

PaymentReceived: {
  "source": "travel-platform.payments",
  "detail-type": "PaymentReceived",
  "detail": { "bookingId", "amount", "status" }
}

BookingCancelled: {
  "source": "travel-platform.bookings",
  "detail-type": "BookingCancelled",
  "detail": { "id", "refundAmount", "reason" }
}
```

## Best Practices Applied

- Use descriptive event sources (namespace pattern: `app.service`)
- Keep event payloads small and focused
- Make event consumers idempotent (handle duplicates)
- Use event filtering to reduce Lambda invocations
- Enable dead-letter queues for failed events
- Archive events for compliance and replay
- Use input transformers to customize target inputs

## Common Cron Expressions

```
Every 5 minutes:     */5 * * * ? *
Every hour:          0 * * * ? *
Daily at 2 AM:       0 2 * * ? *
Monday at 9 AM:      0 9 ? * MON *
First of month:      0 0 1 * ? *
Weekdays at 6 PM:    0 18 ? * MON-FRI *
```

## Reference Materials

- [EventBridge User Guide](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html)
- [Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)
- [Scheduled Rules](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html)
- [Cron Expressions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cron-expressions.html)
