---
title: "IAM Admin Framework Setup"
date: 2026-04-21
weight: 3
summary: "Created an IAM administration baseline with FCAJ-Admins, AdministratorAccess, thanh-admin, and an account alias."
chapter: false
---

# IAM Admin Framework Setup

## Technical Context

This task implements an IAM administration baseline for the AWS internship environment. The goal is to stop using the Root account for daily work and to follow the Least Privilege and Zero Trust mindset by moving regular operations to a dedicated IAM administrator identity.

This setup is necessary because account governance should be established before provisioning more services or granting broader access for future technical tasks.

## Implementation Steps

### Step 1: Open IAM

Search for and open IAM from the AWS Console.

![Find IAM service](/images/1-worklog/week1/iam-admin/find-iam.png)

### Step 2: Create the Administrative Group

Create a new IAM group named FCAJ-Admins. This group acts as the administrative container for the internship account.

![Create IAM group](/images/1-worklog/week1/iam-admin/create-group.png)

### Step 3: Attach the Required Policy

Attach the AWS managed policy AdministratorAccess to the FCAJ-Admins group.

![Attach AdministratorAccess policy](/images/1-worklog/week1/iam-admin/attach-admin-access.png)

### Step 4: Create the Administrative User

Start creating a new IAM user and define the primary administrator identity:

- user name: thanh-admin
- access type: console access

![Start creating IAM user](/images/1-worklog/week1/iam-admin/create-user-start.png)

### Step 5: Configure Console Credentials

Enable console access and define a custom password for the IAM administrator user.

![Console access and password setup](/images/1-worklog/week1/iam-admin/user-console-password.png)

### Step 6: Add the User to the Admin Group

Assign thanh-admin to the FCAJ-Admins group so that permissions are inherited through group membership.

![Add user to IAM group](/images/1-worklog/week1/iam-admin/add-user-to-group.png)

### Step 7: Verify the Group Membership

Review the result and verify that the user is listed correctly under the admin group.

![IAM user group summary](/images/1-worklog/week1/iam-admin/group-user-summary.png)

### Step 8: Configure the Account Alias

Configure the account alias hsmart-intern-thanh so that the console sign-in URL becomes easier to remember and more professional for daily use.

## Critical Configuration

| Parameter | Value |
| --- | --- |
| IAM Group | FCAJ-Admins |
| Managed Policy | AdministratorAccess |
| IAM User | thanh-admin |
| Access Type | Console access |
| Password Mode | Custom password |
| Account Alias | hsmart-intern-thanh |

## Evidence & Verification

### Verification Checklist

- Confirm that the IAM group FCAJ-Admins exists.
- Confirm that AdministratorAccess is attached to the group.
- Confirm that the IAM user thanh-admin was created successfully.
- Confirm that the user is assigned to the correct group.
- Confirm that the account alias is configured for the account.

Evidence currently available: group creation, policy attachment, user creation, console access configuration, and user-to-group membership.

## Troubleshooting

- Issue: The IAM user does not inherit the expected permissions.
  Resolution: Verify that thanh-admin was added to the FCAJ-Admins group and that the group has AdministratorAccess attached.

- Issue: The sign-in URL remains difficult to track using the 12-digit account ID.
  Resolution: Configure the account alias hsmart-intern-thanh and use it for future IAM console sign-in workflows.
