---
title: "Day 1 - IAM Security Framework Setup"
date: 2026-06-01
weight: 1
summary: "Setup IAM security framework by creating admin user to replace root account, creating service roles for Lambda and ECS, and enabling CloudTrail for comprehensive audit logging."
chapter: false
---

## Why I Did This

Proper IAM setup is the foundation of AWS security. Root account should never be used for daily operations, and all services require specific roles with least-privilege permissions.

For the travel platform project, IAM security ensures only authorized services can access databases, secrets, and other resources.

## Implementation Steps

### Step 1: Create Admin IAM User

**Replace root account usage:**

1. Navigate to IAM Console: https://console.aws.amazon.com/iam
2. Click **Users** → **Create user**
3. User name: `admin-user`
4. Tick **Provide user access to the AWS Management Console**
5. Choose **I want to create an IAM user**
6. Password: Custom or auto-generate
7. Next → **Attach policies**:
   - Tick `AdministratorAccess`
8. **Create user**
9. **Download credentials (CSV file)** - store securely!

**Test login:**
- Use the Console sign-in URL from the CSV
- Login with `admin-user` credentials
- Verify access to AWS services

**Important:** Never use root account again for daily operations.

### Step 2: Create Lambda Execution Role

**For serverless backend functions:**

1. IAM Console → **Roles** → **Create role**
2. Trusted entity: **AWS service** → **Lambda**
3. **Permissions policies**:
   - `AWSLambdaBasicExecutionRole` (CloudWatch Logs)
   - `AWSLambdaVPCAccessExecutionRole` (VPC access)
   - `AmazonRDSDataFullAccess` (database access)
   - `AmazonElastiCacheFullAccess` (Redis access)
4. Role name: `LambdaExecutionRole`
5. **Create role**

![Lambda Execution Role](/images/week7/day1/lambda-role.png)

### Step 3: Create ECS Task Execution Role

**For container deployments:**

1. IAM Console → **Roles** → **Create role**
2. Trusted entity: **AWS service** → **Elastic Container Service** → **Elastic Container Service Task**
3. **Permissions policies**:
   - `AmazonECSTaskExecutionRolePolicy`
   - `AmazonEC2ContainerRegistryReadOnly`
4. Role name: `ECSTaskExecutionRole`
5. **Create role**

![ECS Task Execution Role](/images/week7/day1/ecs-role.png)

### Step 4: Enable AWS CloudTrail

**Audit all API calls:**

1. CloudTrail Console: https://console.aws.amazon.com/cloudtrail
2. **Create trail**
3. Trail name: `travel-platform-audit`
4. **Storage location**: Create new S3 bucket (auto-generated name)
5. Next → Select **Management events** (captures all API calls)
6. **Create trail**

![CloudTrail Setup](/images/week7/day1/cloudtrail.png)

**What CloudTrail logs:**
- Who made the API call (IAM user/role)
- When the call was made
- What action was performed
- Which resources were affected

## What I Learned

- Root account should only be used for account recovery
- IAM users need MFA for production environments
- Service roles follow least-privilege principle
- CloudTrail provides complete audit trail for compliance
- IAM policies can be tested before applying to production

## Application to Travel Platform

**IAM structure for project:**
```text
Root Account (locked with MFA)
 └── admin-user (daily admin operations)
 └── LambdaExecutionRole (backend API functions)
 └── ECSTaskExecutionRole (container deployments)
 └── RDSAccessRole (database read/write)
 └── CloudTrail (audit all actions)
```

**Next steps:**
- Enable MFA for admin-user
- Create read-only user for monitoring dashboards
- Setup IAM Access Analyzer to detect public access

## Reference Materials

- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [CloudTrail User Guide](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)
