---
title: "Week 1"
date: 2026-04-20
weight: 1
chapter: false
---

# Week 1

## Overview

During Week 1, I focused on establishing the foundational governance layer for my internship environment. The primary objective was to build two safety controls before starting deeper cloud implementation for the **H-Smart** project:

- **Cost control** through a CloudWatch Billing Alarm.
- **Identity governance** through a dedicated IAM admin framework.

This work was completed in the context of an individual internship project for a final-year engineering student, where maintaining operational discipline, security awareness, and budget visibility is essential from the first day.

## Context

- **Project:** H-Smart
- **Project Type:** AI-powered marketplace for second-hand home appliances
- **Student Profile:** Final-year Software Engineering student, HCMUT
- **Technical Focus:** AWS fundamentals, IAM, CloudWatch, governance, and operational readiness
- **Week 1 Goal:** Establish cost barriers and user administration controls before provisioning larger workloads

## Core Principle

Before configuring any billing-related alarm, I must always verify the AWS **Region**.

**Critical rule:** Billing metrics for CloudWatch are centralized in **N. Virginia (`us-east-1`)**.  
If I create or review the billing alarm in another region, the **EstimatedCharges** metric may not appear correctly, which can lead to missing or invalid monitoring data.

![Switch Region to N. Virginia](/images/1-worklog/week1/billing/region-us-east-1.png)

## Step 1: Set Up Cost Monitoring with CloudWatch Billing Alarm

This section guides you through creating a billing alarm so you can receive an early warning when your AWS usage is approaching an unwanted cost threshold.

### 1.1 Sign in to AWS Console with the Root Account

First, sign in to the AWS Management Console using the **Root account**.

You should use the Root account in this step because billing preferences are managed at the account level, and this area is typically configured from the main billing context of the AWS account.

![Root account sign-in](/images/1-worklog/week1/billing/root-login.png)

### 1.2 Find Billing and Cost Management

After signing in, search for and open **Billing and Cost Management** from the AWS Console.

This is the place where you enable account-level billing notifications before creating the CloudWatch alarm.

![Billing and Cost Management dashboard](/images/1-worklog/week1/billing/billing-dashboard.png)

### 1.3 Open Billing Preferences and Enable Notifications

In the left navigation menu, choose:

- **Billing preferences**

Then enable the required options:

- **Receive PDF invoice by email**
- **Receive Free Tier Usage Alerts**

These options help you maintain visibility into account usage and billing events. In practice, enabling billing-related notifications early is an important governance step for any internship or personal AWS environment.

![Billing preferences](/images/1-worklog/week1/billing/billing-preferences.png)

![Receive PDF invoice by email](/images/1-worklog/week1/billing/pdf-invoice-email.png)

![Billing preference saved successfully](/images/1-worklog/week1/billing/invoice-success.png)

### 1.4 Open CloudWatch

Next, type **CloudWatch** into the AWS search bar and open the service.

Before creating the alarm, make sure you are in the correct Region:

- **N. Virginia (`us-east-1`)**

This point is critical because AWS billing metrics are centralized in this Region. If you stay in another Region, the billing metric may not appear correctly.

![Switch Region to N. Virginia](/images/1-worklog/week1/billing/region-us-east-1.png)

### 1.5 Create a New Alarm

Inside CloudWatch, follow this path:

- **Alarms**
- **Create Alarm**
- **Select metric**

![CloudWatch metric selection](/images/1-worklog/week1/billing/cloudwatch-metric-selection.png)

### 1.6 Select the Billing Metric

In the metric browser, choose:

- **Billing**
- **Total Estimated Charge**

Then:

- tick **EstimatedCharges**
- click **Select metric**

This metric tracks the estimated billing amount accumulated for the account.

![Estimated charge metric selected](/images/1-worklog/week1/billing/estimated-charge-metric.png)

### 1.7 Configure the Alarm Condition

In the **Conditions** section, configure the threshold as follows:

- **Comparison operator:** `Greater/Equal`
- **Threshold value:** `10`
- **Unit:** `USD`

This means CloudWatch will trigger the alarm when the estimated account charge is greater than or equal to **10 USD**.

For a student internship environment, this is a practical early-warning barrier that helps prevent accidental overspending.

![Alarm base configuration](/images/1-worklog/week1/billing/create-alarm-settings.png)

![Threshold set to Greater/Equal](/images/1-worklog/week1/billing/threshold-settings.png)

### 1.8 Configure Notification with SNS

In the **Notification** section:

- choose **Create new topic**
- enter a topic name, for example: `AWS-Billing-Alert-HSmart`
- enter your email address to receive billing alerts

AWS will use Amazon SNS to send the notification whenever the billing alarm changes to the alert state.

![SNS notification configuration](/images/1-worklog/week1/billing/sns-notification.png)

### 1.9 Confirm the Subscription Email

This is the most important operational note in the billing setup:

- AWS will send a confirmation email to the address you entered
- you **must open that email**
- you **must click Confirm Subscription**

If you skip this confirmation step, the billing alarm may be created successfully, but the email notification channel will **not be enabled**. As a result, the alarm exists, but no warning email is delivered.

![Email confirmation step](/images/1-worklog/week1/billing/confirm-subscription.png)

![Subscription confirmed successfully](/images/1-worklog/week1/billing/subscription-confirmed.png)

### 1.10 Verify the Alarm Status

After completing the setup, review the alarm graph and verify that the alarm is in the **OK** state.

This confirms that:

- the billing metric is available
- the threshold has been applied correctly
- the notification workflow is ready to operate

![CloudWatch billing alarm graph](/images/1-worklog/week1/billing/alarm-graph.png)

![CloudWatch alarm in OK state](/images/1-worklog/week1/billing/alarm-ok-state.png)

### 1.11 Worklog Evidence

**Log image code:** `1.1`  
**Recorded parameter:** `Threshold: 10 USD`

Recommended evidence for the internship report:

- screenshot of the metric selection screen
- screenshot of the threshold configuration
- screenshot of the SNS notification step
- screenshot of the CloudWatch alarm graph in `OK` state

## Step 2: Build the IAM Admin Framework

### 2.1 Why IAM Governance Matters

After establishing a cost barrier, the next task was to create a controlled administration model.

The purpose of this step is to apply two professional security principles:

- **Least Privilege:** users should receive only the permissions required for their role.
- **Zero Trust:** the Root account should not be used for daily operations.

In practice, this means using the Root account only for account-level tasks, while day-to-day management should be handled through a dedicated IAM administrator identity.

### 2.2 Find and Open IAM

I first located the **IAM** service from the AWS Management Console.

![Find IAM service](/images/1-worklog/week1/iam-admin/find-iam.png)

### 2.3 Create the IAM Group

I created an IAM group named:

- `FCAJ-Admins`

This group acts as the administrative foundation for the internship environment.

![Create IAM group](/images/1-worklog/week1/iam-admin/create-group.png)

### 2.4 Attach the AdministratorAccess Policy

I assigned the AWS managed policy:

- `AdministratorAccess`

This allows the admin group to manage AWS resources without using the Root account for routine tasks.

Although this is broader than a production least-privilege model, it is a practical setup for a controlled internship lab where the goal is hands-on learning under isolated personal account boundaries.

![Attach AdministratorAccess policy](/images/1-worklog/week1/iam-admin/attach-admin-access.png)

### 2.5 Create the IAM Admin User

Next, I created a dedicated IAM user with the required console identity:

- **User name:** `thanh-admin`
- **Access type:** `Console access`
- **Password mode:** `Custom password`

This user is intended to become the primary administration identity for my daily AWS work.

![Start creating IAM user](/images/1-worklog/week1/iam-admin/create-user-start.png)

### 2.6 Configure Console Access

During console access configuration, the recommended checkbox **Force password change at next sign-in** can be disabled for internship speed and convenience when the environment is fully personal and controlled.

For this internship template, the optimized setup is:

- keep **Console access** enabled,
- use a **Custom password**,
- **skip forced password rotation at first login** to accelerate the onboarding workflow.

![Console access and password setup](/images/1-worklog/week1/iam-admin/user-console-password.png)

### 2.7 Add the User to the Admin Group

After creating the user, I added `thanh-admin` to the `FCAJ-Admins` group so that the user inherits the administrative policy through group membership instead of direct inline assignment.

This follows a cleaner access-management pattern because permissions are controlled at the group level.

![Add user to IAM group](/images/1-worklog/week1/iam-admin/add-user-to-group.png)

### 2.8 Verify IAM User Group Membership

Finally, I verified that the newly created admin user appeared correctly inside the `FCAJ-Admins` group.

This is an important evidence point because it demonstrates that:

- the identity was created successfully,
- the permission model was attached through the group,
- the Root account can now be isolated from regular day-to-day operations.

![IAM user group summary](/images/1-worklog/week1/iam-admin/group-user-summary.png)

## Account Alias Configuration

To improve the professionalism of the login experience, the next recommended step is to create an **IAM account alias**, for example:

- `hsmart-intern-thanh`

This provides two practical benefits:

- it replaces the default 12-digit account ID with a memorable sign-in identifier,
- it creates a cleaner login URL for daily usage and for documentation screenshots.

**Recommended sign-in pattern:**

- `https://hsmart-intern-thanh.signin.aws.amazon.com/console`

**Evidence recommendation:** capture the alias-based sign-in screen after the alias is created.  
At the time of writing this Week 1 report, the current screenshot set mainly covers billing and IAM user/group setup, so the alias login screenshot should be added in a later documentation update if needed.

## Technical Outcome

At the end of Week 1, I completed the baseline governance setup for the internship account:

- A **CloudWatch Billing Alarm** was configured with early warning logic at **10 USD**.
- Billing notifications were connected through **Amazon SNS** and email confirmation was completed.
- A dedicated **IAM admin group** and **IAM admin user** were created.
- Administrative access was shifted away from the Root account for safer daily operations.

## Engineering Reflection

This week reinforced an important engineering lesson: infrastructure work should begin with **guardrails**, not with feature deployment.

For an internship project like **H-Smart**, it is tempting to immediately focus on EC2, databases, storage, or AI workloads. However, setting up billing visibility and identity governance first provides three concrete benefits:

- reduced financial risk,
- improved account security posture,
- cleaner operational discipline for all later AWS experiments.

This foundation will support the next stages of the internship, where I will continue building cloud knowledge with stronger confidence and better account hygiene.
