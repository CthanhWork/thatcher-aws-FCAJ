---
title: "Self-Assessment"
weight: 7
---

## Outcome

The workshop resulted in a working serverless Travel Platform with five completed modules, 43 documented API endpoints, and a deployed cloud data layer. It demonstrated practical application of Lambda, API Gateway, RDS, Redis, S3, IAM, VPC networking, and CloudWatch.

## What Went Well

- The modular backend structure made it possible to deliver auth, places, reviews, trips, and booking workflows independently.
- The serverless deployment path kept infrastructure management small for the MVP.
- Prisma provided a consistent path from schema changes to PostgreSQL access.
- Presigned S3 URLs offered a clean upload flow without handling file data in the API.

## Improvements for the Next Iteration

- Automate deployments and smoke tests with CI/CD.
- Move notification and rating recalculation work to asynchronous processing where traffic requires it.
- Add managed secrets, stronger alarms, WAF protection, and Multi-AZ data services for production readiness.
- Expand automated integration and end-to-end test coverage.
