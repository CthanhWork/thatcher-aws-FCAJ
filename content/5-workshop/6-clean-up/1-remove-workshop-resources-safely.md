---
title: "Remove Workshop Resources Safely"
weight: 1
---

Remove temporary workshop resources when they are no longer required to avoid unnecessary charges. Back up any data you want to keep before deleting persistent services.

## Recommended Order

1. Disable or remove the frontend deployment and custom domain mappings.
2. Delete the API Gateway stage or API after confirming no clients use it.
3. Delete the Lambda function, its unused layer versions, and related log groups as required by retention policy.
4. Empty only the artifact or test-upload S3 buckets created for the workshop, then delete them if they are no longer needed.
5. Take a final RDS snapshot, then remove the test database instance.
6. Delete the Redis replication group or cache cluster.
7. Remove security groups, IAM roles, and VPC resources only after confirming they are not shared with another workload.

> Do not delete a shared VPC, production database, or shared S3 bucket merely because it appears in this workshop. Verify ownership and dependencies first.
