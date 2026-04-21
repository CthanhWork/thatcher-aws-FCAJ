---
title: "CloudWatch Billing Alarm Setup"
date: 2026-04-20
weight: 2
chapter: false
---

# CloudWatch Billing Alarm Setup

## Core Principle

Before configuring any billing-related alarm, you must always verify the AWS Region.

**Critical rule:** Billing metrics for CloudWatch are centralized in **N. Virginia (`us-east-1`)**. If you create or review the billing alarm in another Region, the `EstimatedCharges` metric may not appear correctly.

![Switch Region to N. Virginia](/images/1-worklog/week1/billing/region-us-east-1.png)

## Step 1: Sign in to AWS Console with the Root Account

Sign in to the AWS Management Console using the **Root account**.

You should use the Root account in this step because billing preferences are managed at the account level.

![Root account sign-in](/images/1-worklog/week1/billing/root-login.png)

## Step 2: Find Billing and Cost Management

Search for and open **Billing and Cost Management** from the AWS Console.

![Billing and Cost Management dashboard](/images/1-worklog/week1/billing/billing-dashboard.png)

## Step 3: Open Billing Preferences and Enable Notifications

In the left navigation menu, choose **Billing preferences**.

Then enable:

- **Receive PDF invoice by email**
- **Receive Free Tier Usage Alerts**

![Billing preferences](/images/1-worklog/week1/billing/billing-preferences.png)

![Receive PDF invoice by email](/images/1-worklog/week1/billing/pdf-invoice-email.png)

![Billing preference saved successfully](/images/1-worklog/week1/billing/invoice-success.png)

## Step 4: Open CloudWatch

Type **CloudWatch** into the AWS search bar and open the service.

![CloudWatch metric selection](/images/1-worklog/week1/billing/cloudwatch-metric-selection.png)

## Step 5: Create a New Alarm

Inside CloudWatch, follow this path:

- **Alarms**
- **Create Alarm**
- **Select metric**

![Create alarm settings](/images/1-worklog/week1/billing/create-alarm-settings.png)

## Step 6: Select the Billing Metric

Choose:

- **Billing**
- **Total Estimated Charge**

Then:

- tick **EstimatedCharges**
- click **Select metric**

![Estimated charge metric selected](/images/1-worklog/week1/billing/estimated-charge-metric.png)

## Step 7: Configure the Alarm Condition

In the **Conditions** section, configure:

- **Comparison operator:** `Greater/Equal`
- **Threshold:** `10 USD`

![Threshold set to Greater/Equal](/images/1-worklog/week1/billing/threshold-settings.png)

## Step 8: Configure Notification with SNS

In the **Notification** section:

- choose **Create new topic**
- enter your email address
- use the SNS topic for billing alerts

![SNS notification configuration](/images/1-worklog/week1/billing/sns-notification.png)

## Step 9: Confirm the Email Subscription

AWS will send a confirmation email to the address you entered.

You must:

- open the email
- click **Confirm Subscription**

If you skip this step, the alarm is created, but the email notification channel is not enabled.

![Email confirmation step](/images/1-worklog/week1/billing/confirm-subscription.png)

![Subscription confirmed successfully](/images/1-worklog/week1/billing/subscription-confirmed.png)

## Step 10: Verify the Alarm Status

Review the alarm graph and confirm that the billing alarm is in the **OK** state.

![CloudWatch billing alarm graph](/images/1-worklog/week1/billing/alarm-graph.png)

![CloudWatch alarm in OK state](/images/1-worklog/week1/billing/alarm-ok-state.png)

## Worklog Record

**Log image code:** `1.1`  
**Threshold:** `10 USD`
