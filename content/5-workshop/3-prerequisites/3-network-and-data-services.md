---
title: "Network and Data Services"
weight: 3
---

Before deploying the API, prepare the persistent layer:

- A VPC with private subnets for PostgreSQL and Redis.
- Security groups that permit Lambda-to-RDS PostgreSQL traffic and Lambda-to-Redis traffic only.
- An RDS PostgreSQL database with the target schema applied through Prisma or the supplied SQL setup.
- An ElastiCache Redis endpoint reachable from the Lambda network configuration.
- An S3 bucket for deployment artifacts and, if desired, a separate bucket or prefix for uploads.

Run the schema generation and migration steps from the backend directory before packaging the function:

```powershell
npm install
npx prisma generate
npx prisma migrate deploy
```

Use a non-production database for this workshop when possible. It makes testing and cleanup safer.
