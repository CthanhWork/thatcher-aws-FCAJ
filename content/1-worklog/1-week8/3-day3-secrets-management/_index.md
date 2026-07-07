---
title: "Day 3 - Secrets Management and Database Seeding"
date: 2026-06-10
weight: 3
summary: "Configured AWS Secrets Manager for secure credential storage, set up SSM Parameter Store as cost-effective alternative, stored database and Redis connection strings, and completed database seeding with initial application data."
chapter: false
---

## Why I Did This

Hardcoding credentials in code or environment files creates security risks. AWS Secrets Manager and SSM Parameter Store provide encrypted, centralized secret storage with automatic rotation capability. This ensures credentials are never exposed in code repositories or logs.

## Implementation Steps

### Step 1: Create Secrets in AWS Secrets Manager

**Secret 1: Database URL**

```bash
# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier travel-platform-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

# Create secret
aws secretsmanager create-secret \
  --name travel-platform/database-url \
  --description "Database connection string for Travel Platform" \
  --secret-string "postgresql://postgres:YourStrongPassword@${RDS_ENDPOINT}:5432/travelplatform" \
  --tags Key=Project,Value=TravelPlatform Key=Environment,Value=Production
```

**Secret 2: Redis URL**

```bash
# Get Redis endpoint
REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
  --cache-cluster-id travel-platform-redis \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text)

# Create secret
aws secretsmanager create-secret \
  --name travel-platform/redis-url \
  --description "Redis connection string for Travel Platform" \
  --secret-string "redis://${REDIS_ENDPOINT}:6379"
```

**Secret 3: JWT Secret**

```bash
# Generate random JWT secret (256-bit)
JWT_SECRET=$(openssl rand -base64 32)

# Create secret
aws secretsmanager create-secret \
  --name travel-platform/jwt-secret \
  --description "JWT secret for Travel Platform authentication" \
  --secret-string "$JWT_SECRET"
```

**Secret 4: Admin Credentials**

```bash
# Store admin credentials as JSON
aws secretsmanager create-secret \
  --name travel-platform/admin-credentials \
  --description "Admin user credentials" \
  --secret-string '{
    "email": "admin@travelplatform.com",
    "password": "ChangeThisPassword123!",
    "role": "ADMIN"
  }'
```

### Step 2: Verify Secrets

**List all secrets:**

```bash
aws secretsmanager list-secrets \
  --query 'SecretList[?contains(Name, `travel-platform`)].Name' \
  --output table
```

**Output:**
```
-------------------------------------
|          ListSecrets              |
+-----------------------------------+
| travel-platform/database-url      |
| travel-platform/redis-url         |
| travel-platform/jwt-secret        |
| travel-platform/admin-credentials |
+-----------------------------------+
```

**Retrieve a secret:**

```bash
aws secretsmanager get-secret-value \
  --secret-id travel-platform/database-url \
  --query SecretString \
  --output text
```

### Step 3: Set Up SSM Parameter Store (Cost-Effective Alternative)

**Why Parameter Store?**
- Free tier: 10,000 parameters
- $0 cost for standard parameters
- No automatic rotation (manual only)
- Good for non-critical secrets

**Store database URL:**

```bash
aws ssm put-parameter \
  --name /travel-platform/database-url \
  --value "postgresql://postgres:YourPassword@${RDS_ENDPOINT}:5432/travelplatform" \
  --type SecureString \
  --description "Database connection string" \
  --tags Key=Project,Value=TravelPlatform
```

**Store Redis URL:**

```bash
aws ssm put-parameter \
  --name /travel-platform/redis-url \
  --value "redis://${REDIS_ENDPOINT}:6379" \
  --type SecureString \
  --description "Redis connection string"
```

**Store JWT secret:**

```bash
aws ssm put-parameter \
  --name /travel-platform/jwt-secret \
  --value "$JWT_SECRET" \
  --type SecureString \
  --description "JWT secret for authentication"
```

**Retrieve parameter:**

```bash
aws ssm get-parameter \
  --name /travel-platform/database-url \
  --with-decryption \
  --query Parameter.Value \
  --output text
```

**Retrieve multiple parameters:**

```bash
aws ssm get-parameters \
  --names /travel-platform/database-url /travel-platform/redis-url /travel-platform/jwt-secret \
  --with-decryption \
  --query 'Parameters[*].[Name,Value]' \
  --output table
```

### Step 4: Create IAM Policy for Secret Access

**Policy for Lambda/ECS to access secrets:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": [
        "arn:aws:secretsmanager:ap-southeast-1:123456789:secret:travel-platform/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters"
      ],
      "Resource": [
        "arn:aws:ssm:ap-southeast-1:123456789:parameter/travel-platform/*"
      ]
    }
  ]
}
```

**Create and attach policy:**

```bash
# Create policy
aws iam create-policy \
  --policy-name TravelPlatformSecretsAccess \
  --policy-document file://secrets-policy.json

# Attach to Lambda execution role
aws iam attach-role-policy \
  --role-name LambdaExecutionRole \
  --policy-arn arn:aws:iam::123456789:policy/TravelPlatformSecretsAccess
```

### Step 5: Load Secrets in Application Code

**Node.js example (using AWS SDK v3):**

```typescript
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'ap-southeast-1' });

async function getSecret(secretName: string): Promise<string> {
  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );
    return response.SecretString!;
  } catch (error) {
    console.error(`Error retrieving secret ${secretName}:`, error);
    throw error;
  }
}

// Load secrets on application startup
async function loadConfig() {
  const databaseUrl = await getSecret('travel-platform/database-url');
  const redisUrl = await getSecret('travel-platform/redis-url');
  const jwtSecret = await getSecret('travel-platform/jwt-secret');

  return {
    DATABASE_URL: databaseUrl,
    REDIS_URL: redisUrl,
    JWT_SECRET: jwtSecret,
  };
}

// Use in application
export const config = await loadConfig();
```

**Using Parameter Store:**

```typescript
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: 'ap-southeast-1' });

async function getParameter(name: string): Promise<string> {
  const response = await ssmClient.send(
    new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    })
  );
  return response.Parameter!.Value!;
}

// Load parameters
const databaseUrl = await getParameter('/travel-platform/database-url');
```

### Step 6: Complete Database Seeding

**Enhanced seed script with more data:**

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Seed Categories
  console.log('📦 Seeding categories...');
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
  console.log(`✓ Created ${categories.length} categories\n`);

  // 2. Seed Admin User
  console.log('👤 Seeding admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@travelplatform.com' },
    update: {},
    create: {
      email: 'admin@travelplatform.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✓ Admin user created');
  console.log('  Email: admin@travelplatform.com');
  console.log('  Password: admin123\n');

  // 3. Seed Test Users
  console.log('👥 Seeding test users...');
  const testUsers = [
    { email: 'john@example.com', name: 'John Doe', password: 'password123' },
    { email: 'jane@example.com', name: 'Jane Smith', password: 'password123' },
    { email: 'bob@example.com', name: 'Bob Johnson', password: 'password123' },
  ];

  for (const user of testUsers) {
    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashed,
        role: 'USER',
      },
    });
  }
  console.log(`✓ Created ${testUsers.length} test users\n`);

  // 4. Seed Places
  console.log('🏨 Seeding places...');
  
  const restaurantCat = await prisma.category.findUnique({
    where: { slug: 'restaurant' },
  });

  const hotelCat = await prisma.category.findUnique({
    where: { slug: 'hotel' },
  });

  const attractionCat = await prisma.category.findUnique({
    where: { slug: 'attraction' },
  });

  const places = [
    {
      name: 'Tokyo Sushi Bar',
      description: 'Authentic Japanese sushi restaurant with fresh ingredients',
      address: '123 Orchard Road, #01-23',
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.3048,
      longitude: 103.8318,
      imageUrl: 'https://example.com/sushi.jpg',
      rating: 4.5,
      categoryId: restaurantCat!.id,
    },
    {
      name: 'Marina Bay Hotel',
      description: 'Luxury 5-star hotel with stunning city views',
      address: '10 Bayfront Avenue',
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.2834,
      longitude: 103.8607,
      imageUrl: 'https://example.com/hotel.jpg',
      rating: 4.8,
      categoryId: hotelCat!.id,
    },
    {
      name: 'Gardens by the Bay',
      description: 'Nature park featuring futuristic Supertree structures',
      address: '18 Marina Gardens Drive',
      city: 'Singapore',
      country: 'Singapore',
      latitude: 1.2816,
      longitude: 103.8636,
      imageUrl: 'https://example.com/gardens.jpg',
      rating: 4.9,
      categoryId: attractionCat!.id,
    },
  ];

  for (const place of places) {
    await prisma.place.create({ data: place });
  }
  console.log(`✓ Created ${places.length} places\n`);

  // 5. Seed Sample Bookings
  console.log('📅 Seeding sample bookings...');
  
  const user = await prisma.user.findFirst({ where: { role: 'USER' } });
  const hotel = await prisma.place.findFirst({
    where: { name: 'Marina Bay Hotel' },
  });

  if (user && hotel) {
    await prisma.booking.create({
      data: {
        userId: user.id,
        placeId: hotel.id,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-07-05'),
        guests: 2,
        totalPrice: 1200.0,
        status: 'CONFIRMED',
      },
    });
    console.log('✓ Created 1 sample booking\n');
  }

  // 6. Seed Sample Reviews
  console.log('⭐ Seeding sample reviews...');
  
  const restaurant = await prisma.place.findFirst({
    where: { name: 'Tokyo Sushi Bar' },
  });

  if (user && restaurant) {
    await prisma.review.create({
      data: {
        userId: user.id,
        placeId: restaurant.id,
        rating: 5,
        comment: 'Amazing sushi! Fresh ingredients and great service.',
      },
    });
    console.log('✓ Created 1 sample review\n');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
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

### Step 7: Verify Database Setup

**Test connection script:**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySetup() {
  console.log('🔍 Verifying database setup...\n');

  try {
    // Test connection
    await prisma.$connect();
    console.log('✓ Database connection successful');

    // Count records
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const placeCount = await prisma.place.count();
    const bookingCount = await prisma.booking.count();
    const reviewCount = await prisma.review.count();

    console.log('\n📊 Database Statistics:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Categories: ${categoryCount}`);
    console.log(`  Places: ${placeCount}`);
    console.log(`  Bookings: ${bookingCount}`);
    console.log(`  Reviews: ${reviewCount}`);

    // Check admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@travelplatform.com' },
    });

    if (admin) {
      console.log('\n✓ Admin user exists');
      console.log(`  Email: ${admin.email}`);
      console.log(`  Role: ${admin.role}`);
    }

    console.log('\n✅ Database setup verification complete!');
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();
```

**Run verification:**

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/travelplatform" \
npx ts-node verify-setup.ts
```

## What I Learned

- Secrets Manager provides automatic secret rotation (every 30/60/90 days)
- Parameter Store is free but lacks automatic rotation
- Secrets Manager costs $0.40/secret/month + $0.05 per 10,000 API calls
- Parameter Store: free for standard parameters, $0.05/advanced parameter
- IAM policies control which services can access secrets
- Secrets should never be committed to git repositories
- AWS SDK automatically handles secret decryption
- Database seeding creates initial data for testing and demo

## Cost Comparison

**Secrets Manager (4 secrets):**
```
4 secrets × $0.40/month = $1.60/month
10,000 API calls × $0.05/10k = $0.05/month
Total: ~$1.65/month
```

**Parameter Store (4 parameters):**
```
Standard parameters: FREE
Advanced parameters: $0.05/parameter/month = $0.20/month
API calls: FREE (first 1 million)
Total: $0 - $0.20/month
```

**Recommendation:** Use Parameter Store for dev/test, Secrets Manager for production (automatic rotation).

## Security Best Practices

- ✅ Store all credentials in Secrets Manager or Parameter Store
- ✅ Never commit secrets to git
- ✅ Use IAM policies to restrict secret access
- ✅ Enable CloudTrail to audit secret access
- ✅ Rotate secrets regularly (automatic with Secrets Manager)
- ✅ Use encrypted parameters in Parameter Store (SecureString)
- ❌ Don't log secret values in application logs
- ❌ Don't expose secrets in error messages

## Complete Setup Checklist

✅ RDS PostgreSQL deployed (db.t4g.micro)  
✅ ElastiCache Redis deployed (cache.t4g.micro)  
✅ DB subnet group created  
✅ Cache subnet group created  
✅ Security groups configured  
✅ Bastion host set up  
✅ Database connectivity tested  
✅ Redis connectivity tested  
✅ Prisma migrations deployed  
✅ Secrets stored in Secrets Manager  
✅ Secrets stored in Parameter Store  
✅ IAM policies created  
✅ Database seeded with initial data  
✅ Admin user created  
✅ Test users created  
✅ Sample places created  
✅ Setup verified  

**Next steps:** Deploy backend application to Lambda/ECS in Week 9!

## Reference Materials

- [AWS Secrets Manager User Guide](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [Rotating Secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- [Prisma Seeding](https://www.prisma.io/docs/guides/database/seed-database)
