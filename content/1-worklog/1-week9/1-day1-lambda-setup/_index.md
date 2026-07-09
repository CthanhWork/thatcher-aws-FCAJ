---
title: "Day 1 - Lambda Function Setup and Layer Creation"
date: 2026-06-15
weight: 1
summary: "Set up the Travel Platform Lambda function baseline with TypeScript, created a reusable Lambda Layer for dependencies, and prepared the function for VPC access to RDS and Redis."
chapter: false
---

## Why I Did This

Week 9 starts the backend application layer for the Travel Platform. The goal of Day 1 was to establish a clean Lambda foundation that can later support authentication, Prisma database access, and API Gateway integration.

I also needed to solve the package-size problem early. The application depends on several libraries, so moving shared dependencies into a Lambda Layer keeps the deployment package smaller and easier to maintain.

## Implementation Steps

### Step 1: Create the Project Skeleton

I organized the backend code into a deployable Lambda structure:

```text
travel-platform-api/
├── src/
│   ├── handlers/
│   ├── lib/
│   └── index.ts
├── prisma/
├── layers/
│   └── nodejs/
└── scripts/
```

This structure separates business logic, reusable helpers, Prisma assets, and deployment tooling.

### Step 2: Configure TypeScript Build Output

I set up TypeScript compilation so the Lambda runtime only receives JavaScript output instead of source files.

Typical build goals:

- Compile `src/**/*.ts` to `dist/`
- Preserve source maps for debugging
- Keep runtime code small and deterministic

Example compiler shape:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  }
}
```

### Step 3: Create the Lambda Layer

The layer contains packages that will be shared by multiple handlers.

Typical contents:

- `@aws-sdk/*` helpers
- `jsonwebtoken`
- `bcrypt`
- `zod`
- `winston`
- Prisma client runtime support

The layer is packaged under `layers/nodejs/node_modules` so Lambda can load it automatically.

### Step 4: Prepare Lambda Runtime Settings

I configured the function baseline with settings that fit this backend workload:

- Runtime: Node.js 20.x
- Handler: `index.handler`
- Memory: 512 MB
- Timeout: 30 seconds
- Architecture: ARM64 where possible for cost efficiency

### Step 5: Prepare VPC Connectivity

Because the backend must talk to private RDS and Redis resources, I prepared the Lambda networking plan:

- Attach the function to the VPC
- Place it in private subnets
- Use security groups that can reach the database and cache layers

## Verification

- Confirm the Lambda source compiles successfully.
- Confirm the layer package is created in the expected folder structure.
- Confirm the function configuration includes the correct runtime and timeout.
- Confirm the function is ready to be attached to private subnets.

## What I Learned

- Lambda layers are the right place for shared dependencies that do not belong in business logic.
- Keeping source and deployment artifacts separate makes later API work much easier.
- VPC-based Lambda design needs to be planned together with RDS and Redis, not added later as an afterthought.

## Application to Travel Platform

This setup becomes the foundation for all future backend work in Week 9 and Week 10. Once the layer and build flow are stable, I can focus on business features instead of deployment friction.

