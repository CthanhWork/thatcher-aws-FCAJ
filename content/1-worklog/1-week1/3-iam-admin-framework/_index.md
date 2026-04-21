---
title: "IAM Admin Framework Setup"
date: 2026-04-20
weight: 3
chapter: false
---

# IAM Admin Framework Setup

## Objective

The purpose of this task is to isolate day-to-day administration from the Root account and establish a cleaner identity management model for the internship environment.

## Step 1: Find IAM

Search for and open **IAM** from the AWS Console.

![Find IAM service](/images/1-worklog/week1/iam-admin/find-iam.png)

## Step 2: Create the Admin Group

Create an IAM group named:

- `FCAJ-Admins`

![Create IAM group](/images/1-worklog/week1/iam-admin/create-group.png)

## Step 3: Attach the AdministratorAccess Policy

Attach the AWS managed policy:

- `AdministratorAccess`

![Attach AdministratorAccess policy](/images/1-worklog/week1/iam-admin/attach-admin-access.png)

## Step 4: Create the IAM User

Create a dedicated IAM user for daily administration.

Recommended values:

- **User name:** `thanh-admin`
- **Access type:** `Console access`
- **Password mode:** `Custom password`

![Start creating IAM user](/images/1-worklog/week1/iam-admin/create-user-start.png)

## Step 5: Configure Console Password

Enable console access and assign a custom password.

For a personal internship environment, you may skip the forced password change step to speed up the setup process.

![Console access and password setup](/images/1-worklog/week1/iam-admin/user-console-password.png)

## Step 6: Add the User to the Admin Group

Add `thanh-admin` to the `FCAJ-Admins` group so the user inherits administrative permissions through group membership.

![Add user to IAM group](/images/1-worklog/week1/iam-admin/add-user-to-group.png)

## Step 7: Verify Group Membership

Verify that the user appears correctly inside the admin group.

![IAM user group summary](/images/1-worklog/week1/iam-admin/group-user-summary.png)

## Recommended Next Step

Create an account alias, for example:

- `hsmart-intern-thanh`

This helps replace the 12-digit account ID with a cleaner and more memorable console sign-in URL.
