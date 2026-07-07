---
title: "Day 2 - Deploy ElastiCache Redis and Run Migrations"
date: 2026-06-09
weight: 2
summary: "Deployed ElastiCache Redis cluster for caching and session storage, created cache subnet group, tested Redis connectivity, and successfully ran Prisma database migrations to RDS via SSH tunnel."
chapter: false
---

## Why I Did This

ElastiCache Redis provides managed in-memory caching for the Travel Platform, enabling fast session storage, query result caching, and real-time data access. Running Prisma migrations establishes the database schema in production RDS.

## Implementation Steps

### Step 1: Create Cache Subnet Group

**Via AWS Console:**

1. **ElastiCache Console** → **Subnet groups** → **Create subnet group**
2. **Name**: `travel-platform-cache-subnet-group`
3. **Description**: `Subnet group for Travel Platform Redis`
4. **VPC**: `travel-platform-vpc`
5. **Availability Zones**: Select both AZs
6. **Subnets**: Select both **private subnets** (10.0.11.0/24, 10.0.12.0/24)
7. **Create**

![Create Cache Subnet Group](../images/Tạo%20Cache%20Subnet%20Group.png)

**Via AWS CLI:**

```bash
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name travel-platform-cache-subnet-group \
  --cache-subnet-group-description "Subnet group for Travel Platform Redis" \
  --subnet-ids subnet-xxxxx subnet-yyyyy
```

### Step 2: Create Security Group for Redis

```bash
# Create security group
aws ec2 create-security-group \
  --group-name redis-sg \
  --description "Security group for ElastiCache Redis" \
  --vpc-id $VPC_ID

# Get Redis security group ID
REDIS_SG_ID=$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=redis-sg" \
  --query 'SecurityGroups[0].GroupId' --output text)

# Allow Redis from bastion and private subnets
aws ec2 authorize-security-group-ingress \
  --group-id $REDIS_SG_ID \
  --protocol tcp \
  --port 6379 \
  --cidr 10.0.0.0/16
```

### Step 3: Create ElastiCache Redis Cluster

**Via AWS Console:**

1. **ElastiCache Console** → **Redis clusters** → **Create Redis cluster**

**Cluster mode:**
- Select: **Cluster Mode disabled** (design your own cluster)

**Cluster info:**
- **Name**: `travel-platform-redis`
- **Description**: `Redis cache for Travel Platform`
- **Location**: AWS Cloud

**Cluster settings:**
- **Engine version**: 7.1 (latest)
- **Port**: 6379 (default)
- **Parameter group**: `default.redis7`
- **Node type**: `cache.t4g.micro` (0.5 GiB memory)
- **Number of replicas**: 0 (dev) or 1 (prod for high availability)

**Connectivity:**
- **VPC**: `travel-platform-vpc`
- **Subnet group**: `travel-platform-cache-subnet-group`
- **Availability Zone placement**: No preference

**Security:**
- **Security groups**: Select `redis-sg`
- **Encryption at rest**: Disabled (optional, enable for production)
- **Encryption in-transit**: Disabled (optional, enable for production)

**Backup:**
- **Enable automatic backups**: No (dev) / Yes (prod)

2. **Create**

**Via AWS CLI:**

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id travel-platform-redis \
  --engine redis \
  --engine-version 7.1 \
  --cache-node-type cache.t4g.micro \
  --num-cache-nodes 1 \
  --cache-subnet-group-name travel-platform-cache-subnet-group \
  --security-group-ids $REDIS_SG_ID \
  --tags Key=Project,Value=TravelPlatform Key=Environment,Value=Dev
```

**Monitor creation (~5 minutes):**

```bash
aws elasticache describe-cache-clusters \
  --cache-cluster-id travel-platform-redis \
  --query 'CacheClusters[0].CacheClusterStatus'
```

### Step 4: Get Redis Endpoint

```bash
aws elasticache describe-cache-clusters \
  --cache-cluster-id travel-platform-redis \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text
```

**Output:**
```
travel-platform-redis.abc123.0001.apse1.cache.amazonaws.com
```

### Step 5: Test Redis Connection from Bastion

**SSH into bastion:**

```bash
ssh -i your-key.pem ec2-user@$BASTION_IP
```

**Install Redis CLI:**

```bash
# Install Redis tools
sudo dnf install redis6 -y

# Verify installation
redis-cli --version
```

**Connect to Redis:**

```bash
redis-cli -h travel-platform-redis.abc123.0001.apse1.cache.amazonaws.com -p 6379
```

**If connection succeeds:**
```
travel-platform-redis.abc123.0001.apse1.cache.amazonaws.com:6379>
```

**Run test commands:**

```redis
# Ping server
PING
# Output: PONG

# Set a key
SET test:key "Hello Redis!"

# Get the key
GET test:key
# Output: "Hello Redis!"

# Set with expiration (10 seconds)
SETEX session:user123 10 "active"

# Check TTL
TTL session:user123
# Output: (integer) 8

# Wait 10 seconds and check again
GET session:user123
# Output: (nil)

# Hash operations (for sessions)
HSET user:1 name "John Doe" email "john@example.com"
HGETALL user:1

# List operations
LPUSH bookings:pending "booking-123" "booking-456"
LRANGE bookings:pending 0 -1

# Clean up test data
DEL test:key
DEL user:1
DEL bookings:pending

# Exit
EXIT
```

### Step 6: Setup SSH Tunnel for Prisma Migrations

**On your local machine:**

```bash
# Create SSH tunnel for RDS
# Format: ssh -L local_port:rds_endpoint:rds_port bastion_user@bastion_ip
ssh -i your-key.pem \
  -L 5432:travel-platform-db.xxxxx.rds.amazonaws.com:5432 \
  ec2-user@$BASTION_IP

# Keep this terminal open!
# Port 5432 on localhost now forwards to RDS through bastion
```

**Open new terminal for Prisma commands.**

### Step 7: Configure Prisma Schema

**File: `backend/prisma/schema.prisma`**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  bookings  Booking[]
  reviews   Review[]

  @@map("users")
}

enum Role {
  USER
  ADMIN
}

model Category {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  places Place[]

  @@map("categories")
}

model Place {
  id          String   @id @default(uuid())
  name        String
  description String
  address     String
  city        String
  country     String
  latitude    Float
  longitude   Float
  imageUrl    String?
  rating      Float    @default(0)
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category Category  @relation(fields: [categoryId], references: [id])
  bookings Booking[]
  reviews  Review[]

  @@map("places")
}

model Booking {
  id        String        @id @default(uuid())
  userId    String
  placeId   String
  startDate DateTime
  endDate   DateTime
  guests    Int
  totalPrice Float
  status    BookingStatus @default(PENDING)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  user  User  @relation(fields: [userId], references: [id])
  place Place @relation(fields: [placeId], references: [id])

  @@map("bookings")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Review {
  id        String   @id @default(uuid())
  userId    String
  placeId   String
  rating    Int
  comment   String
  createdAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  place Place @relation(fields: [placeId], references: [id])

  @@map("reviews")
}
```

### Step 8: Create Production Environment File

**File: `backend/.env.production`**

```bash
# Database (via SSH tunnel)
DATABASE_URL="postgresql://postgres:YourPassword@localhost:5432/travelplatform"

# Redis
REDIS_URL="redis://travel-platform-redis.abc123.0001.apse1.cache.amazonaws.com:6379"

# JWT
JWT_SECRET="your-jwt-secret-here"

# Environment
NODE_ENV=production
```

**Note:** Using `localhost:5432` because of SSH tunnel!

### Step 9: Generate Prisma Client and Run Migrations

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Deploy migrations to production RDS
npx prisma migrate deploy
```

**Expected output:**

```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "travelplatform", schema "public" at "localhost:5432"

2 migrations found in prisma/migrations

Applying migration `20240608120000_init`
Applying migration `20240608120100_add_categories`

The following migration(s) have been applied:

migrations/
  └─ 20240608120000_init/
      └─ migration.sql
  └─ 20240608120100_add_categories/
      └─ migration.sql

All migrations have been successfully applied.
```

**Verify migrations:**

```bash
# Connect to RDS via bastion
psql -h travel-platform-db.xxxxx.rds.amazonaws.com -U postgres -d travelplatform

# List tables
\dt

# Should see:
# users, categories, places, bookings, reviews, _prisma_migrations

# Check schema
\d users
```

### Step 10: Seed Initial Data

**File: `backend/prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed categories
  const categories = [
    { name: 'Restaurant', slug: 'restaurant' },
    { name: 'Hotel', slug: 'hotel' },
    { name: 'Attraction', slug: 'attraction' },
    { name: 'Shopping', slug: 'shopping' },
    { name: 'Nightlife', slug: 'nightlife' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✓ Categories seeded');

  // Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@travelplatform.com' },
    update: {},
    create: {
      email: 'admin@travelplatform.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✓ Admin user created (email: admin@travelplatform.com, password: admin123)');

  // Seed sample places
  const restaurantCategory = await prisma.category.findUnique({
    where: { slug: 'restaurant' },
  });

  if (restaurantCategory) {
    await prisma.place.upsert({
      where: { id: 'sample-place-1' },
      update: {},
      create: {
        id: 'sample-place-1',
        name: 'Tokyo Sushi Restaurant',
        description: 'Authentic Japanese sushi restaurant in Singapore',
        address: '123 Orchard Road',
        city: 'Singapore',
        country: 'Singapore',
        latitude: 1.3048,
        longitude: 103.8318,
        imageUrl: 'https://example.com/sushi.jpg',
        rating: 4.5,
        categoryId: restaurantCategory.id,
      },
    });
  }

  console.log('✓ Sample places seeded');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed:**

```bash
npx prisma db seed
```

## What I Learned

- ElastiCache Redis provides managed in-memory caching
- Redis supports multiple data structures (strings, hashes, lists, sets)
- SSH tunnel enables secure access to private resources from local machine
- Prisma migrations track schema changes with version control
- cache.t4g.micro provides 0.5 GiB memory (~10,000 sessions)
- Redis can store sessions, cache query results, and real-time data
- TTL (Time To Live) enables automatic expiration of cached data

## Cost Breakdown

```
ElastiCache Redis cache.t4g.micro:
- Instance: $0.017/hour × 730 hours = $12.41/month
- Data transfer: Minimal (within VPC = free)
Total: ~$12.41/month
```

## Reference Materials

- [ElastiCache for Redis User Guide](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Redis Commands](https://redis.io/commands/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
