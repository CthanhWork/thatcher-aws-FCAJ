---
title: "CloudWatch Billing Alarm Setup"
date: 2026-04-21
weight: 2
summary: "Configured a CloudWatch Billing Alarm in us-east-1 with a 10 USD threshold and SNS email notification."
chapter: false
---

# CloudWatch Billing Alarm Setup

## Why I Did This

This task established the first cost-governance control for my internship AWS account. I wanted an early warning mechanism before creating more services because a student environment can accumulate unexpected cost very quickly when experiments are spread across multiple services.

I selected a threshold of 10 USD because it is a conservative safety point for a personal internship account. At this level, I still have enough time to react before H-Smart experiments become expensive, especially when I later test services such as S3, RDS, EC2, or AI-related features.

## Implementation Steps

### Step 1: Confirm the Billing Region

Before starting the configuration, switch the AWS Console Region to N. Virginia, region code us-east-1. This is mandatory because the CloudWatch billing metric EstimatedCharges is centralized in this Region.

![AWS Console region selector set to US East N Virginia for billing metrics](../../../images/1-worklog/week1/billing/region-us-east-1.png)

### Step 2: Sign in with the Root Account

Sign in to the AWS Management Console by using the Root account. This step is required because billing preferences are configured at the account level.

![AWS root user sign-in screen used before enabling billing preferences](../../../images/1-worklog/week1/billing/root-login.png)

### Step 3: Open Billing and Cost Management

Search for and open Billing and Cost Management from the AWS Console.

![Billing and Cost Management console opened from the AWS Console](../../../images/1-worklog/week1/billing/billing-dashboard.png)

### Step 4: Enable Billing Preferences

Open Billing preferences from the left navigation menu and enable the notification options required for monitoring. At this stage, turn on Receive PDF invoice by email and Receive Free Tier Usage Alerts.

![Billing preferences page in Billing and Cost Management](../../../images/1-worklog/week1/billing/billing-preferences.png)

![Billing preference option to receive PDF invoice by email](../../../images/1-worklog/week1/billing/pdf-invoice-email.png)

![Confirmation message after saving billing preferences](../../../images/1-worklog/week1/billing/invoice-success.png)

### Step 5: Search for CloudWatch

Search for CloudWatch from the AWS Console search bar and open the service.

![AWS Console search result showing CloudWatch](../../../images/1-worklog/week1/billing/cloudwatch-metric-selection.png)

### Step 6: Open the Alarms Page

Inside CloudWatch, open the Alarms section from the navigation menu.

![CloudWatch navigation menu with Alarms selected](../../../images/1-worklog/week1/billing/alarm-graph.png)

### Step 7: Start Alarm Creation

From the Alarms page, choose Create alarm.

![CloudWatch alarms page with Create alarm button visible](../../../images/1-worklog/week1/billing/create-alarm-settings.png)

### Step 8: Select the Billing Metric

In the metric selection flow, choose Billing, then Total Estimated Charge, then EstimatedCharges.

![Billing metric selection showing EstimatedCharges under Total Estimated Charge](../../../images/1-worklog/week1/billing/estimated-charge-metric.png)

### Step 9: Configure the Alarm Threshold

In the Conditions section, choose Greater or Equal and enter 10 USD as the threshold.

![Alarm threshold configuration set to Greater or Equal and 10 USD](../../../images/1-worklog/week1/billing/threshold-settings.png)

### Step 10: Configure the SNS Notification

In the Notification section, create a new SNS topic and add the notification email address. This email subscription will be used to receive billing alerts.

![SNS topic configuration for CloudWatch billing email notification](../../../images/1-worklog/week1/billing/sns-notification.png)

After the alarm is submitted, AWS displays a success message showing that the alarm was created and that the SNS subscription may still be waiting for email confirmation.

![CloudWatch success banner after alarm creation with SNS confirmation still pending](../../../images/1-worklog/week1/billing/alarm-ok-state.png)

### Step 11: Confirm the Email Subscription

After the SNS topic is created, AWS sends a confirmation email. Open that email and click Confirm Subscription. Without this confirmation, the billing alarm exists, but the email notification channel remains disabled.

![SNS subscription confirmation email sent after alarm creation](../../../images/1-worklog/week1/billing/confirm-subscription.png)

![AWS page confirming that the SNS email subscription was verified](../../../images/1-worklog/week1/billing/subscription-confirmed.png)

### Step 12: Verify That the Alarm Was Created Successfully

After email confirmation is completed, return to CloudWatch and verify that the billing alarm is listed correctly. At this stage, the alarm setup is complete and the notification path is active.

## What I Learned

- Billing metrics are account-wide but still appear only in the us-east-1 Region inside CloudWatch.
- A low threshold such as 10 USD is useful in a student environment because it gives earlier visibility than a larger budget cap.
- Creating an SNS notification is not enough by itself. The email recipient must still confirm the subscription before the notification path becomes fully active.

## Evidence and Verification

### Verification Checklist

- Confirm that the EstimatedCharges metric is visible under the Billing namespace.
- Confirm that the billing alarm is created successfully in CloudWatch.
- Confirm that the success message is displayed after alarm creation.
- Confirm that the SNS email subscription has already been verified or is pending confirmation.

![CloudWatch billing alarm created with a 10 USD threshold and SNS warning pending confirmation](../../../images/1-worklog/week1/billing/alarm-ok-state.png)

Evidence code: 1.1
Recorded threshold: 10 USD

## Challenges and Troubleshooting

- Challenge 1: At Step 8, I could not find the Billing namespace and the EstimatedCharges metric did not appear in the metric picker.
  Root cause: The console was not set to us-east-1.
  Resolution: I switched the active Region back to US East N. Virginia, reopened the metric selector, and the Billing metrics became visible.

- Challenge 2: At Step 10, CloudWatch showed a warning that the SNS subscription was still pending confirmation.
  Root cause: I had created the topic, but I had not yet clicked Confirm Subscription in my email inbox.
  Resolution: I opened the email, confirmed the subscription, and then rechecked the alarm flow so the notification channel could be used correctly.

## Application to H-Smart

This pattern will be reused when H-Smart moves onto AWS resources. A billing alarm is especially relevant if I later store product images in S3, run backend workloads on EC2 or Lambda, keep marketplace data in RDS, or test AI features for RAG. Early cost alerts will help me keep experimentation under control while the project is still in a student budget range.

## Reference Materials

- [Create a billing alarm to monitor your estimated AWS charges](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)
- [Overview of Amazon Web Services](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html)
