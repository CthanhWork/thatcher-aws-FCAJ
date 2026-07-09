---
title: "Day 2 - Prisma ORM Integration with Lambda"
date: 2026-06-16
weight: 2
summary: "Integrated Prisma ORM with the Lambda backend, configured connection handling for serverless execution, and prepared database migrations for the Travel Platform schema."
chapter: false
---

## Why I Did This

The Travel Platform backend needs a stable data access layer before authentication and business modules can be built. Prisma gives a type-safe way to work with PostgreSQL while keeping the code readable and maintainable.

For Lambda, the important part is not just using Prisma, but using it in a way that does not create too many database connections.

## Implementation Steps

### Step 1: Initialize Prisma

I added Prisma to the project and created the first schema baseline.

Key files:

- `prisma/schema.prisma`
- `.env`
- `src/lib/prisma.ts`

### Step 2: Define the Database Client Pattern

I set up Prisma Client as a reusable singleton so Lambda warm starts can reuse the same client instance.

Example pattern:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

This helps avoid creating a new connection pool on every invocation.

### Step 3: Prepare the First Schema

I structured the schema to support future modules such as users, refresh tokens, places, reviews, and trips.

The important part of this day was validating that the data model can evolve without forcing a rewrite later.

### Step 4: Plan Migrations

I prepared the migration workflow so schema changes can be applied consistently:

- Generate migrations locally
- Review SQL output
- Apply to the development database
- Keep schema and application code in sync

### Step 5: Validate Connectivity

I tested that the Lambda-side code can read the database URL and initialize Prisma without runtime errors.

## Verification

- Confirm Prisma Client initializes correctly in the Lambda codebase.
- Confirm the singleton pattern is in place.
- Confirm the schema file exists and is version-controlled.
- Confirm migration commands can run against the target database.

## What I Learned

- Serverless databases need connection discipline.
- Prisma is a strong fit for schema-driven backend development.
- The client lifecycle inside Lambda matters as much as the schema itself.

## Application to Travel Platform

This work gives the backend a clean data layer for authentication and later business modules. It also reduces the chance of connection storms once the API starts handling real traffic.

