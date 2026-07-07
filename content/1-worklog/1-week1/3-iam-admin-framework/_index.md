---
title: "IAM Admin Framework Setup"
date: 2026-04-21
weight: 3
summary: "Created an IAM administration baseline with FCAJ-Admins, AdministratorAccess, thanh-admin, and an account alias."
chapter: false
---

## Why I Did This

This task implemented an IAM administration baseline for the internship AWS environment. The immediate goal was to stop relying on the root account for daily work and move to a dedicated administrator identity that is easier to manage and safer to audit.

I treated this as the first identity governance checkpoint for the account. Even though the user still has broad access, building an admin group and a named IAM user is a better starting point than doing all operational work under the root identity.

## Implementation Steps

### Step 1: Access IAM Service

Search for and open IAM from the AWS Console.

![AWS Console search result showing the IAM service](../../../images/1-worklog/week1/iam-admin/find-iam.png)

### Step 2: Create Admin Group

Create a new IAM group named FCAJ-Admins. This group acts as the administrative container for the internship account.

![IAM group creation page for the FCAJ-Admins group](../../../images/1-worklog/week1/iam-admin/create-group.png)

### Step 3: Attach AdministratorAccess Policy

Attach the AWS managed policy AdministratorAccess to the FCAJ-Admins group.

![Policy attachment step showing AdministratorAccess for the admin group](../../../images/1-worklog/week1/iam-admin/attach-admin-access.png)

### Step 4: Create Admin User and Enable Console Access

In the user creation wizard, define the main administrator identity for the internship account. In this flow, I entered the user name thanh-admin and enabled access to the AWS Management Console so the account can be used for daily administration instead of relying on the root user.

The two screenshots below belong to the same creation flow. The first screen captures the user details, and the second screen captures the console access configuration with a custom password.

![IAM user creation screen for the thanh-admin identity](../../../images/1-worklog/week1/iam-admin/create-user-start.png)
![Console access configuration with a custom password for thanh-admin](../../../images/1-worklog/week1/iam-admin/user-console-password.png)

### Step 5: Assign User to Group

Assign thanh-admin to the FCAJ-Admins group so that permissions are inherited through group membership.

![IAM workflow assigning thanh-admin to the FCAJ-Admins group](../../../images/1-worklog/week1/iam-admin/add-user-to-group.png)

### Step 6: Final Review and Verification

Review the result and verify that the user was created successfully and is listed under the correct admin group.

![IAM user group summary showing thanh-admin under FCAJ-Admins](../../../images/1-worklog/week1/iam-admin/group-user-summary.png)

### Step 7: Create Account Alias

The account alias is still part of the target IAM baseline, but I do not yet have a dedicated screenshot for this step. The intended alias is hsmart-intern-thanh so the sign-in URL becomes easier to remember and more professional for daily use.

Expected sign-in URL:

```text
https://hsmart-intern-thanh.signin.aws.amazon.com/console
```

## What I Learned

- Group-based permission assignment is easier to maintain than attaching permissions directly to each user.
- An IAM administrator user is still different from the root user, which means daily operations can be moved away from the highest-risk identity.
- A readable account alias improves operational usability because the team can remember the sign-in URL more easily than a 12-digit account ID.
- MFA should be enabled for the administrator account as soon as possible because password-only access is still a significant security risk.

## Evidence and Verification

### Verification Checklist

- Confirm that the IAM group FCAJ-Admins exists.
- Confirm that AdministratorAccess is attached to the group.
- Confirm that the IAM user thanh-admin was created successfully.
- Confirm that the user is assigned to the correct group.
- Confirm that the account alias is configured for the account.

Evidence currently available: service access, group creation, policy attachment, user creation, console access configuration, and user-to-group membership. I still need to capture a dedicated screenshot for the account alias step in a later session.

## Challenges and Troubleshooting

- Challenge 1: This task did not produce a blocking console error, but the main governance risk was continuing to perform daily work with the root account out of convenience.
  Resolution: I created a separate administrator identity and documented it as the default identity for future console work.

- Challenge 2: The default sign-in experience based on the 12-digit account ID is harder to remember and easier to mistype during repeated sign-ins.
  Resolution: I configured the account alias hsmart-intern-thanh so the sign-in URL becomes easier to share and use.

## Application to H-Smart

This IAM baseline is directly relevant to H-Smart. When the project grows, I should not give every contributor the same broad permissions. The long-term direction is to split access by responsibility, for example limiting image storage access to the S3 layer, backend deployment access to the application team, and database administration to a smaller trusted scope.

## Reference Materials

- [IAM user groups](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html)
- [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Using an alias for your AWS account ID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console-account-alias.html)
