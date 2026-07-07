---
title: "Day 3 - Security Groups for Multi-Tier Architecture"
date: 2026-06-03
weight: 3
summary: "Configured Security Groups for RDS, Redis, and Lambda/ECS following least-privilege network access principles for multi-tier application architecture."
chapter: false
---

## Implementation Steps

### RDS Security Group
```text
Name: rds-sg
Inbound: PostgreSQL (5432) from backend-sg
```

### Redis Security Group
```text
Name: redis-sg
Inbound: TCP (6379) from backend-sg
```

### Backend Security Group
```text
Name: backend-sg
Inbound: HTTP (80) from 0.0.0.0/0
Outbound: All traffic
```

## What I Learned
- Security groups are stateful firewalls
- Reference other security groups in rules (not CIDR)
- Least privilege: only allow required ports

## Reference Materials
- [Security Groups](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
