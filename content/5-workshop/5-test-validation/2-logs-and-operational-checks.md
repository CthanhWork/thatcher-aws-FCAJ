---
title: "Logs and Operational Checks"
weight: 2
---

## CloudWatch Investigation Flow

1. Open the Lambda log group for the deployed function.
2. Select the newest log stream for the failing request.
3. Match the request timestamp with the API Gateway response.
4. Identify whether the failure occurred during validation, authorization, database access, Redis access, or S3 signing.
5. Correct the smallest responsible configuration or code unit, redeploy, then repeat the same request.

## Useful Signals

| Signal | What it can indicate |
| --- | --- |
| Lambda errors | Unhandled exceptions, missing configuration, or dependency issues |
| Duration | Slow database calls, cold starts, or inefficient code paths |
| Throttles | Concurrency is insufficient for current traffic |
| API latency | Gateway integration or backend performance issue |
| RDS connections | Connection pressure or unreleased clients |
| Cache hit rate | Whether Redis is reducing database work |

Set log retention and alarms deliberately. Operational visibility is part of the deployment, not an afterthought after an incident.
