---
title: "Configure API and Runtime"
weight: 3
---

Configure the Lambda function with:

- Node.js 20 runtime
- An execution role with least-privilege log and S3 access
- VPC subnets and security groups that can reach RDS and Redis
- Environment variables or Secrets Manager references for database, cache, JWT, region, and bucket configuration
- A timeout and memory size suitable for the API workload

![Lambda general configuration: memory and timeout](/images/5-Workshop/travel-platform/03-lambda-runtime.png)

Connect API Gateway to the Lambda handler and configure CORS for the frontend origin. Add throttling to protect the API from accidental spikes and expose a lightweight unauthenticated `/health` route for deployment verification.

After configuration changes, use CloudWatch logs to confirm that the function starts without missing environment variables, networking errors, or Prisma runtime errors.
