---
title: "Overview"
weight: 1
---

## Workshop Goal

Build and operate a practical Travel Platform on AWS using a serverless-first design. The focus is not only on releasing features, but also on making the system understandable, secure, observable, and economical for a small product team.

The platform supports five completed modules:

| Module | Main capabilities | API endpoints |
| --- | --- | ---: |
| Authentication | Register, login, token refresh, password recovery, profile | 7 |
| Places | Browse, search, CRUD, image upload, view tracking | 7 |
| Reviews | Ratings, helpful votes, reports, owner replies | 7 |
| Trips | Saved places, itinerary planning, public sharing | 12 |
| Business and Bookings | Business claims, bookings, status workflow, admin views | 10 |

## Learning Outcomes

After completing the workshop, a participant can:

- Explain when a serverless API is a good fit for a web product.
- Deploy a Node.js and TypeScript API to AWS Lambda through an S3 artifact bucket.
- Connect a Lambda API safely to PostgreSQL and Redis.
- Use presigned S3 URLs for direct browser uploads without exposing AWS credentials.
- Validate API behavior and diagnose a failed request with CloudWatch logs.

## Scope

The workshop documents the deployed MVP architecture: Lambda, API Gateway, RDS PostgreSQL, Redis, S3, IAM, VPC networking, and CloudWatch. Services such as Cognito, SQS, SNS, SES, EventBridge, OpenSearch, WAF, and CloudFront are described only as production-growth options where relevant; they are not presented as part of the deployed MVP unless explicitly stated.

Proceed to [Architecture Description](../2-architecture-description/) to see how the components work together.
