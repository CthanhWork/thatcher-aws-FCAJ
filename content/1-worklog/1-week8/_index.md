---
title: "Week 8"
date: 2026-06-08
weight: 8
summary: "Week 8 covers production database and caching infrastructure including RDS PostgreSQL deployment, ElastiCache Redis setup, and secure secrets management with AWS Secrets Manager and Parameter Store."
chapter: false
---

## Weekly Objective

This week focuses on deploying production-ready database and caching infrastructure for the Travel Platform. The emphasis is on RDS PostgreSQL for relational data, ElastiCache Redis for caching and session management, and secure credential storage using AWS Secrets Manager.

## Tasks To Be Carried Out This Week

<table>
  <thead>
    <tr>
      <th>Day</th>
      <th>Task</th>
      <th>Start Date</th>
      <th>Completion Date</th>
      <th>Reference Material</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>
        <ul>
          <li><a href="1-day1-rds-deployment/">Deploy RDS PostgreSQL database</a></li>
          <li><a href="1-day1-rds-deployment/">Create DB subnet group and configure multi-AZ</a></li>
          <li><a href="1-day1-rds-deployment/">Set up bastion host for database access</a></li>
          <li><a href="1-day1-rds-deployment/">Test database connectivity and run initial queries</a></li>
        </ul>
      </td>
      <td>06/08/2026</td>
      <td>06/08/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html">Amazon RDS User Guide</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html">RDS for PostgreSQL</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.Scenarios.html">DB instance in VPC</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-elasticache-redis/">Deploy ElastiCache Redis cluster</a></li>
          <li><a href="2-day2-elasticache-redis/">Create cache subnet group</a></li>
          <li><a href="2-day2-elasticache-redis/">Test Redis connectivity and basic operations</a></li>
          <li><a href="2-day2-elasticache-redis/">Run Prisma migrations to RDS via SSH tunnel</a></li>
        </ul>
      </td>
      <td>06/09/2026</td>
      <td>06/09/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html">ElastiCache for Redis</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/GettingStarted.html">Getting Started with Redis</a></li>
          <li><a href="https://www.prisma.io/docs/concepts/components/prisma-migrate">Prisma Migrate</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-secrets-management/">Set up AWS Secrets Manager for credentials</a></li>
          <li><a href="3-day3-secrets-management/">Store database and Redis connection strings securely</a></li>
          <li><a href="3-day3-secrets-management/">Configure SSM Parameter Store as cost-effective alternative</a></li>
          <li><a href="3-day3-secrets-management/">Seed initial database data and verify setup</a></li>
        </ul>
      </td>
      <td>06/10/2026</td>
      <td>06/10/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html">AWS Secrets Manager</a></li>
          <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html">Parameter Store</a></li>
          <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html">Rotating Secrets</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: Deploy RDS PostgreSQL Database](1-day1-rds-deployment/)
- [Day 2: Deploy ElastiCache Redis and Run Migrations](2-day2-elasticache-redis/)
- [Day 3: Secrets Management and Database Seeding](3-day3-secrets-management/)

## Architecture Overview

```text
Travel Platform Data Layer

VPC (10.0.0.0/16)
├── Public Subnets (10.0.1.0/24, 10.0.2.0/24)
│   └── Bastion Host (EC2 t4g.nano)
│       └── SSH access from your IP only
│
└── Private Subnets (10.0.11.0/24, 10.0.12.0/24)
    ├── RDS PostgreSQL (db.t4g.micro)
    │   ├── Multi-AZ for high availability
    │   ├── Automated backups (7 days retention)
    │   └── Encrypted at rest
    │
    └── ElastiCache Redis (cache.t4g.micro)
        ├── Session storage
        ├── Query result caching
        └── Real-time data caching

AWS Secrets Manager
├── travel-platform/database-url
├── travel-platform/redis-url
└── travel-platform/jwt-secret
```

## Cost Estimation

| Service | Instance Type | Monthly Cost |
|---------|--------------|--------------|
| RDS PostgreSQL | db.t4g.micro (20GB) | ~$15 |
| ElastiCache Redis | cache.t4g.micro | ~$12 |
| EC2 Bastion | t4g.nano | ~$3 |
| Secrets Manager | 3 secrets | $1.20 |
| **Total** | | **~$31/month** |

**Cost optimization tips:**
- Stop bastion host when not in use
- Use Parameter Store instead of Secrets Manager (free tier)
- Enable RDS storage autoscaling to avoid over-provisioning
- Consider Aurora Serverless for variable workloads

## Note For Mentors

Week 8 bridges infrastructure setup (Week 7) with application deployment, focusing on production-ready database and caching layers. Day 1 covers RDS PostgreSQL deployment with proper subnet groups and security. Day 2 adds ElastiCache Redis for caching and includes running Prisma migrations via SSH tunnel. Day 3 completes the setup with secure secrets management and database seeding, preparing the infrastructure for backend deployment in Week 9.
