---
title: "Workshop"
weight: 5
chapter: false
pre: " <b> 5. </b> "
---

## Serverless Travel Platform on AWS

This workshop documents the design, deployment, and validation of a cloud-native Travel Platform. The application lets users register, discover places, write reviews, create itineraries, and manage bookings through a serverless backend.

The workshop is based on a working implementation rather than a conceptual architecture. The deployed core uses AWS Lambda, API Gateway, Amazon RDS for PostgreSQL, Amazon S3, CloudWatch, and VPC networking. The Next.js frontend runs on Vercel behind a custom domain. Redis integration is supported by the code, while the current deployment uses an in-memory cache fallback until a reachable Redis endpoint is configured.

## Current Deployment

| Resource | Current value |
| --- | --- |
| Live application | [https://travel.thatcherdev.id.vn](https://travel.thatcherdev.id.vn) |
| Public source code | [CthanhWork/travel-platform-aws](https://github.com/CthanhWork/travel-platform-aws) |
| Backend | AWS Lambda behind API Gateway |
| Database | Amazon RDS for PostgreSQL in a private VPC path |
| Demo catalog | 301 places across 10 Vietnamese travel cities |
| Data source | OpenStreetMap-derived catalog with stable source IDs |
| Verified flows | Health check, registration, login, places listing, search, and category filters |

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
