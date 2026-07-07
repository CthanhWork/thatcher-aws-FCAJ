---
title: "Day 4 - Billing Alerts and Budget Controls"
date: 2026-06-04
weight: 4
summary: "Setup billing alerts, AWS Budgets with email notifications, and CloudWatch billing alarms to prevent unexpected AWS charges."
chapter: false
---

## Implementation Steps

### Enable Billing Alerts
1. Billing Console → Billing Preferences
2. Enable **Receive Billing Alerts**
3. Enable **Receive Free Tier Usage Alerts**

### Create AWS Budget
```text
Budget name: MonthlyBudget
Amount: $50/month
Alerts:
- 80% threshold → email
- 100% threshold → email
```

### CloudWatch Billing Alarm
```text
Metric: Total Estimated Charge
Threshold: > $50
Action: SNS notification
```

## What I Learned
- Budgets provide proactive cost control
- Free Tier alerts prevent surprise charges
- CloudWatch alarms trigger at specific thresholds

## Reference Materials
- [AWS Budgets](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html)
