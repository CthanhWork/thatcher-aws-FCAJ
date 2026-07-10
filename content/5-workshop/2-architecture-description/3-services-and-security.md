---
title: "AWS Services and Security"
weight: 3
---

## Service Selection

| Service | Responsibility in the MVP |
| --- | --- |
| API Gateway | Public HTTPS entry point and request routing |
| Lambda | TypeScript API runtime and business logic |
| RDS PostgreSQL | Primary transactional data store |
| ElastiCache Redis | Cache and short-lived application state |
| S3 | Lambda deployment artifacts and image objects |
| CloudWatch | Function logs and operational diagnostics |
| IAM | Least-privilege access from Lambda to AWS resources |

## Security Controls

- Keep RDS and Redis in private subnets. Do not expose either service directly to the public internet.
- Allow inbound database and cache traffic only from the Lambda security group.
- Store connection strings, JWT signing values, and other credentials in Lambda environment configuration or Secrets Manager. Never commit them to source control.
- Grant the Lambda execution role only the S3 prefix, log groups, and resource actions it needs.
- Use expiring presigned URLs for image uploads and validate file type and ownership before issuing one.
- Validate API payloads with schemas and enforce role checks for owner and admin actions.
- Apply API Gateway throttling and restrictive CORS rules for the production frontend origin.

## Network and Permission Evidence

The Lambda configuration attaches the API runtime to the application VPC and its security group. The RDS connectivity page shows the managed PostgreSQL instance and its network configuration, while the Lambda permissions page records the API Gateway invoke permission and CloudWatch-related access.

![Lambda VPC and security group configuration](/images/5-Workshop/travel-platform/04-lambda-vpc.png)

![Lambda permissions and API Gateway invocation policy](/images/5-Workshop/travel-platform/05-lambda-permissions.png)

![RDS connectivity and security configuration](/images/5-Workshop/travel-platform/09-rds-network.png)

## Production Extensions

Cognito can replace or complement application-managed authentication. AWS WAF can protect the API from common web attacks. SQS, SNS, SES, and EventBridge are appropriate for email, notification, and scheduled workloads once those flows need independent scaling or retry behavior.
