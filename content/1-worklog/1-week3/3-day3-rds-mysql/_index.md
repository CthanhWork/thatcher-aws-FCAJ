---
title: "Day 3 - Amazon RDS for Managed MySQL Database"
date: 2026-05-06
weight: 3
summary: "Practiced Amazon RDS by creating a Multi-AZ MySQL database instance, configuring security groups for database access from application tier, and testing connectivity from EC2 instances."
chapter: false
---

## Why I Did This

This task practiced Amazon Relational Database Service (RDS) as a managed database solution that eliminates the operational overhead of running databases on EC2 instances.

Amazon RDS automates time-consuming database administration tasks including:

- Hardware provisioning and OS patching
- Database software installation and upgrades
- Automated backups with point-in-time recovery
- Multi-AZ replication for high availability
- Read replicas for read scalability
- Performance monitoring and alerting

Key benefits of RDS over self-managed databases:

- **Reduced operational burden**: No need to manually patch OS, upgrade MySQL versions, or manage backup scripts.
- **High availability**: Multi-AZ deployments provide automatic failover to a standby instance in another AZ.
- **Automated backups**: Daily automated backups with configurable retention period and point-in-time recovery.
- **Scalability**: Vertical scaling (instance size) and horizontal scaling (read replicas) without application downtime.
- **Security**: Encryption at rest and in transit, integration with IAM for access control, VPC isolation.

For H-Smart, Amazon RDS is the recommended approach for hosting the application database because:

- The team can focus on application development instead of database administration
- Multi-AZ deployment ensures database availability during AZ failures or maintenance windows
- Automated backups protect against data loss
- Future read replicas can offload read traffic from the primary database

## Implementation Steps

### Step 1: Create DB Subnet Group

A DB subnet group defines which subnets RDS can use to place database instances. For Multi-AZ deployments, the subnet group must include subnets in at least two Availability Zones.

In the RDS console, I opened Subnet groups and created a new DB subnet group:

```text
Name:        h-smart-db-subnet-group
Description: Subnet group for H-Smart RDS instances
VPC:         H-smart-VPC
Subnets:     Select private subnets in ap-southeast-2a and ap-southeast-2b
```

I selected private subnets because databases should not be directly accessible from the internet. Only application tier instances in the VPC should be able to connect to the database.

### Step 2: Create Security Group for RDS

I created a dedicated security group for the RDS instance to control which resources can connect to the database:

```text
Name:        H-Smart-RDS-SG
Description: Security group for H-Smart MySQL RDS instance
VPC:         H-smart-VPC

Inbound rules:
- Type:   MySQL/Aurora (3306)
  Source: sg-xxxxxxxxx (H-Smart-Web-SG - the security group attached to web tier EC2 instances)
```

This inbound rule allows only EC2 instances with the `H-Smart-Web-SG` security group to connect to the database on port 3306. This follows the principle of least privilege: only application servers can access the database.

### Step 3: Create RDS MySQL Instance with Multi-AZ

In the RDS console, I opened Databases and created a new database:

**Engine Options:**
```text
Engine type:    MySQL
Engine version: MySQL 8.0.35 (or latest)
```

**Templates:**
```text
Template: Free tier (for practice) or Production (for Multi-AZ)
```

For this lab, I selected Production template to enable Multi-AZ deployment.

**Settings:**
```text
DB instance identifier: h-smart-mysql-db
Master username:        admin
Master password:        (strong password, stored securely)
```

**Instance Configuration:**
```text
DB instance class: db.t3.micro (smallest available for testing)
Storage type:      General Purpose SSD (gp3)
Allocated storage: 20 GB
Storage autoscaling: Enabled (maximum 100 GB)
```

**Availability & Durability:**
```text
Multi-AZ deployment: Yes (Create a standby instance in a different AZ)
```

Enabling Multi-AZ creates a synchronous standby replica in a different Availability Zone. If the primary instance fails, RDS automatically fails over to the standby (typically within 60-120 seconds).

**Connectivity:**
```text
VPC:                H-smart-VPC
DB subnet group:    h-smart-db-subnet-group
Public access:      No (do not assign a public IP address)
VPC security group: H-Smart-RDS-SG
Availability Zone:  No preference (let RDS choose)
```

**Database Authentication:**
```text
Database authentication: Password authentication
```

**Additional Configuration:**
```text
Initial database name: hsmart_db
Backup retention period: 7 days
Backup window:      Use default
Maintenance window: Use default
Enable Enhanced Monitoring: Yes (60 seconds granularity)
Enable deletion protection: No (for testing; enable in production)
```

After reviewing all settings, I created the database instance.

### Step 4: Wait for RDS Instance to Become Available

RDS instance creation takes 5-15 minutes. The status progresses through:

```text
Creating → Backing-up → Available
```

While waiting, I reviewed the instance details:

- **Endpoint**: The DNS hostname used to connect to the database (e.g., `h-smart-mysql-db.xxxxx.ap-southeast-2.rds.amazonaws.com`)
- **Port**: 3306 (default MySQL port)
- **Multi-AZ**: Shows "Yes" with the secondary AZ listed

The endpoint hostname remains constant even during failover, so application code does not need to change.

### Step 5: Test Database Connectivity from EC2 Instance

To verify that the RDS instance is accessible from the application tier, I SSH-ed into one of the web server EC2 instances and installed the MySQL client:

```bash
sudo yum install -y mysql
```

Then I connected to the RDS instance using the endpoint hostname:

```bash
mysql -h h-smart-mysql-db.xxxxx.ap-southeast-2.rds.amazonaws.com -u admin -p
```

After entering the master password, I verified connectivity by running basic SQL commands:

```sql
SHOW DATABASES;

USE hsmart_db;

CREATE TABLE test_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_table (message) VALUES ('Hello from H-Smart RDS MySQL');

SELECT * FROM test_table;
```

Expected output:

```text
+----+-----------------------------+---------------------+
| id | message                     | created_at          |
+----+-----------------------------+---------------------+
|  1 | Hello from H-Smart RDS MySQL| 2026-05-06 10:30:15 |
+----+-----------------------------+---------------------+
```

This confirms that:
- The RDS instance is reachable from the application tier
- Security group rules are correctly configured
- The database is fully functional and ready for application data

### Step 6: Review Multi-AZ Failover Behavior

To understand Multi-AZ failover, I reviewed the RDS documentation and observed the instance configuration:

**How Multi-AZ works:**
- RDS maintains two copies of the database: primary and standby
- All writes to the primary are synchronously replicated to the standby
- The standby is not accessible for read traffic (it is a hot standby only)
- If the primary fails, RDS automatically updates the DNS endpoint to point to the standby
- The standby is promoted to primary, and a new standby is provisioned

**When failover occurs:**
- Primary instance failure (hardware, OS, or database process crash)
- Primary AZ failure or network connectivity loss
- Manual failover triggered via AWS console or API (for testing or maintenance)

**Failover time:**
- Typically 60-120 seconds from failure detection to resumed database operations
- Application connections will be temporarily interrupted and must reconnect

For H-Smart, this means the application should implement connection retry logic to handle transient database connection failures during failover.

## What I Learned

- Amazon RDS is a managed database service that automates provisioning, patching, backups, and failover.
- Multi-AZ deployment creates a synchronous standby replica in a different Availability Zone for automatic failover.
- DB subnet groups define which subnets RDS can use and must span at least two AZs for Multi-AZ.
- RDS instances should be placed in private subnets with no public IP addresses.
- Security groups control database access: only application tier security groups should be allowed to connect.
- The RDS endpoint hostname remains constant during failover, so application configuration does not need to change.
- Multi-AZ failover typically takes 60-120 seconds and requires application retry logic.
- Automated backups enable point-in-time recovery up to the configured retention period.
- Storage autoscaling automatically increases storage capacity when the database grows.

## Evidence and Verification

### Verification Checklist

- Confirm that a DB subnet group is created with private subnets in two Availability Zones.
- Confirm that a security group is created allowing inbound MySQL (3306) only from application tier security group.
- Confirm that an RDS MySQL instance is created with Multi-AZ enabled.
- Confirm that the RDS instance has no public IP address (Public access: No).
- Confirm that the RDS instance reaches `Available` status.
- Confirm that the endpoint hostname is resolvable from an EC2 instance in the VPC.
- Confirm that MySQL client connection succeeds from the application tier EC2 instance.
- Confirm that SQL commands (CREATE TABLE, INSERT, SELECT) execute successfully.
- Confirm that Multi-AZ status shows "Yes" with secondary AZ listed.
- Confirm that automated backups are enabled with 7-day retention.

## Challenges and Troubleshooting

- Challenge 1: Connection to RDS instance timed out from EC2 instance.
  Resolution: I verified the security group rules on the RDS instance. The inbound rule was allowing port 3306 from `0.0.0.0/0`, but the EC2 instance subnet route table had no route to the RDS subnet. I corrected the security group to allow traffic from the application security group ID instead of a CIDR range.

- Challenge 2: RDS instance creation failed with "InvalidSubnet" error.
  Resolution: The DB subnet group must include subnets in at least two different Availability Zones. I added a second subnet in a different AZ to the subnet group and recreated the instance.

- Challenge 3: MySQL client connection was refused.
  Resolution: I verified that the RDS instance status was `Available` (not `Creating` or `Backing-up`). I also confirmed that the security group inbound rule port was 3306, not 3307 or another incorrect port.

- Challenge 4: I could not find the RDS endpoint hostname.
  Resolution: The endpoint is only available after the RDS instance reaches `Available` status. I waited for the creation process to complete, then found the endpoint in the Connectivity & security tab of the instance details.

## Application to H-Smart

Amazon RDS is the recommended database solution for H-Smart's production architecture:

1. **Managed operations**: H-Smart developers can focus on application logic instead of database administration tasks like patching, backups, and monitoring.

2. **High availability**: Multi-AZ deployment ensures the database remains available during AZ failures, planned maintenance, or instance failures with automatic failover.

3. **Data durability**: Automated backups with 7-day retention protect against accidental data deletion or corruption. Point-in-time recovery allows restoring the database to any second within the retention period.

4. **Security**: By placing RDS in private subnets with security group restrictions, H-Smart ensures the database is not exposed to the internet and only accessible from application servers.

5. **Future scalability**: As H-Smart grows, read replicas can be added to offload read traffic, and vertical scaling (larger instance types) can be performed with minimal downtime.

The recommended next step is to integrate the application code with the RDS database, implement connection pooling and retry logic, and test failover behavior by triggering a manual failover via the RDS console.

## Reference Materials

- [What is Amazon RDS?](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- [Multi-AZ deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
- [MySQL on Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)
