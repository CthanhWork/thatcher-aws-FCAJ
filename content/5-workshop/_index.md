---
title: "Workshop"
weight: 5
chapter: false
pre: " <b> 5. </b> "
---

## Serverless Travel Platform on AWS

This workshop documents the design, deployment, and validation of a cloud-native Travel Platform. The application lets users discover places, write reviews, create itineraries, and manage bookings through a serverless backend.

The workshop is based on a working implementation rather than a conceptual architecture. The deployed core uses AWS Lambda, API Gateway, Amazon RDS for PostgreSQL, ElastiCache for Redis, and Amazon S3. It contains five completed business modules and 43 API endpoints.

| Area | What this workshop covers |
| --- | --- |
| Architecture | Serverless request flow, data layer, security boundaries, and service choices |
| Deployment | Packaging a TypeScript Lambda, publishing it through S3, and configuring the frontend |
| Validation | Health checks, protected APIs, core user journeys, and CloudWatch logs |
| Operations | Cost-aware configuration, troubleshooting, and resource cleanup |

## Workshop Navigation

1. [Overview](1-overview/)
2. [Architecture Description](2-architecture-description/)
3. [Prerequisites](3-prerequisites/)
4. [Deployment Guide](4-deployment-guide/)
5. [Test and Validation](5-test-validation/)
6. [Clean-up](6-clean-up/)
7. [Self-Assessment](7-self-assessment/)
8. [Sharing and Feedback](8-sharing-feedback/)

> The public workshop intentionally uses placeholders for account IDs, bucket names, database endpoints, and secrets. These values must be supplied from the target AWS environment during deployment.
