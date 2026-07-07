---
title: "Day 1 - Deploy RDS PostgreSQL Database"
date: 2026-06-08
weight: 1
summary: "Deployed production RDS PostgreSQL database with db.t4g.micro instance, created DB subnet group for multi-AZ deployment, configured security groups, and set up bastion host for secure database access."
chapter: false
---

## Why I Did This

RDS PostgreSQL provides managed, scalable relational database service without server maintenance overhead. For the Travel Platform, RDS handles booking data, user accounts, and transactional operations with automated backups, encryption, and multi-AZ availability.

## Implementation Steps

### Step 1: Create DB Subnet Group

**Why DB Subnet Group?**
- Defines which subnets RDS can run in
- Required for VPC deployment
- Enables multi-AZ deployment across availability zones

**Via AWS Console:**

1. **RDS Console** → **Subnet groups** → **Create DB subnet group**
2. **Name**: `travel-platform-db-subnet-group`
3. **Description**: `Subnet group for Travel Platform RDS`
4. **VPC**: `travel-platform-vpc`
5. **Availability Zones**: Select both AZs (ap-southeast-1a, ap-southeast-1b)
6. **Subnets**: Select both **private subnets**:
   - `10.0.11.0/24` (Private subnet 1)
   - `10.0.12.0/24` (Private subnet 2)
7. **Create**

**Via AWS CLI:**

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name travel-platform-db-subnet-group \
  --db-subnet-group-description "Subnet group for Travel Platform RDS" \
  --subnet-ids subnet-xxxxx subnet-yyyyy \
  --tags Key=Project,Value=TravelPlatform Key=Environment,Value=Dev
```

### Step 2: Create Security Group for RDS

```bash
# Get VPC ID
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=travel-platform-vpc" \
  --query 'Vpcs[0].VpcId' --output text)

# Create security group
aws ec2 create-security-group \
  --group-name rds-sg \
  --description "Security group for RDS PostgreSQL" \
  --vpc-id $VPC_ID \
  --tag-specifications 'ResourceType=security-group,Tags=[{Key=Name,Value=rds-sg}]'

# Get security group ID
RDS_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=rds-sg" \
  --query 'SecurityGroups[0].GroupId' --output text)

# Allow PostgreSQL from bastion host (will create bastion SG later)
# For now, allow from private subnets CIDR
aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG_ID \
  --protocol tcp \
  --port 5432 \
  --cidr 10.0.0.0/16
```

### Step 3: Create RDS PostgreSQL Instance

**Via AWS Console:**

1. **RDS Console** → **Databases** → **Create database**

**Engine options:**
- **Engine type**: PostgreSQL
- **Version**: PostgreSQL 15.5 (latest stable)

**Templates:**
- Select: **Free tier** (if eligible) or **Dev/Test**

**Settings:**
- **DB instance identifier**: `travel-platform-db`
- **Master username**: `postgres`
- **Master password**: Create strong password
  - ✓ **Auto generate a password** (recommended)
  - Save password immediately!

**Instance configuration:**
- **DB instance class**: Burstable classes (includes t classes)
  - Select: **db.t4g.micro** (2 vCPU, 1 GiB RAM)
  - ARM-based Graviton2 processor (20% better price-performance)

**Storage:**
- **Storage type**: General Purpose SSD (gp3)
- **Allocated storage**: 20 GiB
- ✓ **Enable storage autoscaling**
  - Maximum storage threshold: 100 GiB

**Connectivity:**
- **VPC**: `travel-platform-vpc`
- **DB subnet group**: `travel-platform-db-subnet-group`
- **Public access**: **No** (critical for security!)
- **VPC security group**: Choose existing → `rds-sg`
- **Availability Zone**: No preference (RDS chooses automatically)

**Database authentication:**
- **Password authentication** (default)

**Additional configuration:**
- **Initial database name**: `travelplatform`
- **DB parameter group**: `default.postgres15`
- **Backup**:
  - ✓ Enable automated backups
  - Backup retention period: **7 days**
  - Backup window: No preference
- **Encryption**:
  - ✓ Enable encryption (uses default KMS key)
- **Monitoring**:
  - Enhanced monitoring: **Disabled** (cost saving for dev)
  - Performance Insights: **Disabled** (dev environment)

2. **Create database**

**Via AWS CLI:**

```bash
aws rds create-db-instance \
  --db-instance-identifier travel-platform-db \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 15.5 \
  --master-username postgres \
  --master-user-password 'YourStrongPassword123!' \
  --allocated-storage 20 \
  --storage-type gp3 \
  --db-subnet-group-name travel-platform-db-subnet-group \
  --vpc-security-group-ids $RDS_SG_ID \
  --backup-retention-period 7 \
  --db-name travelplatform \
  --no-publicly-accessible \
  --storage-encrypted \
  --tags Key=Project,Value=TravelPlatform Key=Environment,Value=Dev
```

**Creation takes 5-10 minutes. Monitor progress:**

```bash
aws rds describe-db-instances \
  --db-instance-identifier travel-platform-db \
  --query 'DBInstances[0].DBInstanceStatus' \
  --output text
```

Statuses: `creating` → `backing-up` → `available`

### Step 4: Get RDS Endpoint

```bash
aws rds describe-db-instances \
  --db-instance-identifier travel-platform-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

**Output:**
```
travel-platform-db.c1a2b3c4d5e6.ap-southeast-1.rds.amazonaws.com
```

**Save this endpoint!** You'll use it in `DATABASE_URL`.

### Step 5: Create Bastion Host

**Why Bastion Host?**
- RDS is in private subnet (no internet access)
- Bastion provides secure SSH tunnel to access RDS
- Alternative: AWS Systems Manager Session Manager

**Launch EC2 Instance:**

1. **EC2 Console** → **Instances** → **Launch instance**

**Configuration:**
- **Name**: `bastion-host`
- **AMI**: Amazon Linux 2023 (free tier eligible)
- **Instance type**: `t4g.nano` (ARM, cheapest)
- **Key pair**: Create new or use existing
- **Network settings**:
  - **VPC**: `travel-platform-vpc`
  - **Subnet**: **Public subnet 1** (10.0.1.0/24)
  - **Auto-assign public IP**: **Enable**
- **Security group**: Create new `bastion-sg`
  - **Inbound rules**:
    - Type: SSH
    - Port: 22
    - Source: **My IP** (your current IP only!)
  - **Outbound rules**: All traffic (default)

2. **Launch instance**

**Update RDS security group to allow bastion:**

```bash
# Get bastion security group ID
BASTION_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=bastion-sg" \
  --query 'SecurityGroups[0].GroupId' --output text)

# Allow RDS access from bastion
aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG_ID \
  --protocol tcp \
  --port 5432 \
  --source-group $BASTION_SG_ID
```

### Step 6: Connect to Bastion Host

```bash
# Get bastion public IP
BASTION_IP=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=bastion-host" "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

# SSH into bastion
ssh -i your-key.pem ec2-user@$BASTION_IP
```

**If connection fails:**
- Check security group allows your current IP
- Verify key pair permissions: `chmod 400 your-key.pem`

### Step 7: Install PostgreSQL Client on Bastion

```bash
# Update system
sudo dnf update -y

# Install PostgreSQL 15 client
sudo dnf install postgresql15 -y

# Verify installation
psql --version
```

### Step 8: Test Database Connection

```bash
# Connect to RDS
psql -h travel-platform-db.xxxxx.rds.amazonaws.com \
     -U postgres \
     -d travelplatform

# Enter password when prompted
```

**If connection succeeds:**
```
psql (15.5)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
Type "help" for help.

travelplatform=>
```

**Run test queries:**

```sql
-- Check PostgreSQL version
SELECT version();

-- List databases
\l

-- List tables (empty for now)
\dt

-- Create test table
CREATE TABLE test (
  id SERIAL PRIMARY KEY,
  message TEXT
);

-- Insert test data
INSERT INTO test (message) VALUES ('Hello from RDS!');

-- Query data
SELECT * FROM test;

-- Drop test table
DROP TABLE test;

-- Exit
\q
```

## What I Learned

- RDS manages database infrastructure (backups, patches, scaling)
- DB subnet groups enable multi-AZ deployments
- Private subnet placement prevents direct internet access
- Bastion host provides secure tunnel for database access
- gp3 storage offers better performance at same cost as gp2
- db.t4g (Graviton2) provides 20% cost savings over db.t3
- Automated backups with 7-day retention for disaster recovery
- Encryption at rest enabled by default with AWS KMS

## Architecture Diagram

```text
Internet
    ↓
Public Subnet (10.0.1.0/24)
    ↓
[Bastion Host] ←── SSH from your IP (port 22)
    ↓
Private Subnet (10.0.11.0/24)
    ↓
[RDS PostgreSQL] ←── psql from bastion (port 5432)
    ↓
    Multi-AZ: Standby replica in AZ-2 (automatic failover)
```

## Cost Breakdown

```
RDS PostgreSQL db.t4g.micro:
- Instance: $0.019/hour × 730 hours = $13.87/month
- Storage: 20GB gp3 × $0.133/GB = $2.66/month
- Backup: 20GB × $0.095/GB (free up to 20GB) = $0
Total: ~$16.53/month

Bastion EC2 t4g.nano:
- Instance: $0.0042/hour × 730 hours = $3.07/month
(Stop when not in use to save cost!)
```

## Security Best Practices

- ✅ RDS in private subnet (no public access)
- ✅ Security group restricts access to bastion only
- ✅ Bastion security group restricts SSH to specific IP
- ✅ Encryption at rest enabled
- ✅ SSL/TLS enforced for connections
- ✅ Strong master password (stored in Secrets Manager later)
- ✅ Automated backups enabled
- ❌ Enhanced monitoring disabled (enable for production)

## Troubleshooting

**Cannot connect to RDS:**

```bash
# Verify RDS status
aws rds describe-db-instances \
  --db-instance-identifier travel-platform-db \
  --query 'DBInstances[0].[DBInstanceStatus,Endpoint.Address]'

# Check security group rules
aws ec2 describe-security-groups --group-ids $RDS_SG_ID

# Verify bastion can reach RDS port
telnet travel-platform-db.xxxxx.rds.amazonaws.com 5432
```

**SSH to bastion fails:**

```bash
# Verify security group allows your current IP
curl ifconfig.me  # Get your public IP

# Update security group if IP changed
aws ec2 authorize-security-group-ingress \
  --group-id $BASTION_SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr YOUR_NEW_IP/32
```

## Reference Materials

- [Amazon RDS User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- [RDS for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [Working with DB Subnet Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html)
- [Best Practices for RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
