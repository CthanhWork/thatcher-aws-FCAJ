---
title: "Application Configuration"
weight: 2
---

## Backend Variables

Create the backend configuration from the repository example file. The exact names may vary, but the deployment needs values for the database, Redis, JWT signing key, AWS Region, and S3 bucket.

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@RDS_ENDPOINT:5432/travelplatform
REDIS_URL=redis://REDIS_ENDPOINT:6379
JWT_SECRET=replace-with-a-long-random-secret
AWS_REGION=ap-southeast-2
S3_BUCKET_UPLOADS=replace-with-your-bucket
```

Do not commit this file. Prefer AWS Secrets Manager for production credentials, and configure Lambda with references or protected environment variables.

## Frontend Variables

The frontend needs the deployed API base URL, not a local development URL:

```env
NEXT_PUBLIC_API_URL=https://API_ID.execute-api.REGION.amazonaws.com
```

Rebuild the frontend after changing this value.
