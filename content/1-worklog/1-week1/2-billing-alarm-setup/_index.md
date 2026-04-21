---
title: "CloudWatch Billing Alarm Setup"
date: 2026-04-21
weight: 2
summary: "Configured a CloudWatch Billing Alarm in us-east-1 with a 10 USD threshold and SNS email notification."
chapter: false
---

# CloudWatch Billing Alarm Setup

## Technical Context

This task establishes the first cost-governance control for the internship AWS account. A billing alarm is required to detect abnormal spending early and to reduce the risk of uncontrolled charges during workshop and project experimentation.

From an operational perspective, this task is important because billing monitoring should be enabled before provisioning additional services. It is also a practical example of preventive governance for a personal AWS environment.

## Implementation Steps

### Step 1: Confirm the Billing Region

Before starting the configuration, switch the AWS Console Region to N. Virginia, region code us-east-1. This is mandatory because the CloudWatch billing metric EstimatedCharges is centralized in this Region.

![Switch Region to N. Virginia](/images/1-worklog/week1/billing/region-us-east-1.png)

### Step 2: Sign in with the Root Account

Sign in to the AWS Management Console by using the Root account. This step is required because billing preferences are configured at the account level.

![Root account sign-in](/images/1-worklog/week1/billing/root-login.png)

### Step 3: Open Billing and Cost Management

Search for and open Billing and Cost Management from the AWS Console.

![Billing and Cost Management dashboard](/images/1-worklog/week1/billing/billing-dashboard.png)

### Step 4: Enable Billing Preferences

Open Billing preferences from the left navigation menu and enable the notification options required for monitoring. At this stage, turn on Receive PDF invoice by email and Receive Free Tier Usage Alerts.

![Billing preferences](/images/1-worklog/week1/billing/billing-preferences.png)

![Receive PDF invoice by email](/images/1-worklog/week1/billing/pdf-invoice-email.png)

![Billing preference saved successfully](/images/1-worklog/week1/billing/invoice-success.png)

### Step 5: Search for CloudWatch

Search for CloudWatch from the AWS Console search bar and open the service.

![CloudWatch metric selection](/images/1-worklog/week1/billing/cloudwatch-metric-selection.png)

### Step 6: Open the Alarms Page

Inside CloudWatch, open the Alarms section from the navigation menu.

![CloudWatch Alarms menu](/images/1-worklog/week1/billing/alarm-graph.png)

### Step 7: Start Alarm Creation

From the Alarms page, choose Create alarm.

![Create alarm settings](/images/1-worklog/week1/billing/create-alarm-settings.png)

### Step 8: Select the Billing Metric

In the metric selection flow, choose Billing, then Total Estimated Charge, then EstimatedCharges.

![Estimated charge metric selected](/images/1-worklog/week1/billing/estimated-charge-metric.png)

### Step 9: Configure the Alarm Threshold

In the Conditions section, choose Greater or Equal and enter 10 USD as the threshold.

![Threshold set to Greater/Equal](/images/1-worklog/week1/billing/threshold-settings.png)

### Step 10: Configure the SNS Notification

In the Notification section, create a new SNS topic and add the notification email address. This email subscription will be used to receive billing alerts.

![SNS notification configuration](/images/1-worklog/week1/billing/sns-notification.png)

After the alarm is submitted, AWS displays a success message showing that the alarm was created and that the SNS subscription may still be waiting for email confirmation.

![Alarm created successfully](/images/1-worklog/week1/billing/alarm-ok-state.png)

### Step 11: Confirm the Email Subscription

After the SNS topic is created, AWS sends a confirmation email. Open that email and click Confirm Subscription. Without this confirmation, the billing alarm exists, but the email notification channel remains disabled.

![Email confirmation step](/images/1-worklog/week1/billing/confirm-subscription.png)

![Subscription confirmed successfully](/images/1-worklog/week1/billing/subscription-confirmed.png)

### Step 12: Verify That the Alarm Was Created Successfully

After email confirmation is completed, return to CloudWatch and verify that the billing alarm is listed correctly. At this stage, the alarm setup is complete and the notification path is active.

## Critical Configuration

| Parameter | Value |
| --- | --- |
| Region | us-east-1 |
| Metric Namespace | Billing |
| Metric Group | Total Estimated Charge |
| Metric | EstimatedCharges |
| Alarm Condition | Greater or Equal |
| Threshold | 10 USD |
| Notification Channel | Amazon SNS |
| SNS Topic | AWS-Billing-Alert-HSmart |

## Evidence & Verification

### Verification Checklist

- Confirm that the EstimatedCharges metric is visible under the Billing namespace.
- Confirm that the billing alarm is created successfully in CloudWatch.
- Confirm that the success message is displayed after alarm creation.
- Confirm that the SNS email subscription has already been verified or is pending confirmation.

![Alarm created successfully](/images/1-worklog/week1/billing/alarm-ok-state.png)

Evidence code: 1.1
Recorded threshold: 10 USD

## Troubleshooting

- Issue: EstimatedCharges does not appear in CloudWatch.
  Resolution: Switch the active AWS Region to us-east-1 and re-open the Billing metric namespace.

- Issue: No billing email is received after the alarm is created.
  Resolution: Open the SNS confirmation email and click Confirm Subscription. The alarm notification channel is not active until the subscription is confirmed.
