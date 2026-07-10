---
title: "Week 10"
date: 2026-06-22
weight: 10
summary: "Week 10 covers implementing core business modules including Places management with S3 image uploads, Reviews with rating calculation, and Trip planner with public sharing functionality."
chapter: false
---

## Weekly Objective

This week focuses on building the core business logic modules for the Travel Platform, including Places management with Redis caching and S3 presigned URLs, Reviews with automatic rating calculation, and Trip planner with itinerary management and public sharing capabilities.

## Tasks To Be Carried Out This Week

<table>
  <thead>
    <tr>
      <th>Day</th>
      <th>Task</th>
      <th>Start Date</th>
      <th>Completion Date</th>
      <th>Reference Material</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>
        <ul>
          <li><a href="1-day1-places-module/">Build Places module with CRUD operations</a></li>
          <li><a href="1-day1-places-module/">Implement search with filters (category, city, price, rating)</a></li>
          <li><a href="1-day1-places-module/">Add Redis caching for place listings (5 min TTL)</a></li>
          <li><a href="1-day1-places-module/">Implement place view tracking for analytics</a></li>
        </ul>
      </td>
      <td>06/22/2026</td>
      <td>06/22/2026</td>
      <td>
        <ul>
          <li><a href="https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting">Prisma Filtering</a></li>
          <li><a href="https://redis.io/docs/manual/patterns/twitter-clone/">Redis Caching Patterns</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/BestPractices.html">ElastiCache Best Practices</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-s3-image-upload/">Implement S3 presigned URLs for image uploads</a></li>
          <li><a href="2-day2-s3-image-upload/">Create S3 bucket with proper CORS configuration</a></li>
          <li><a href="2-day2-s3-image-upload/">Generate presigned upload URLs with expiration</a></li>
          <li><a href="2-day2-s3-image-upload/">Test image upload flow from client to S3</a></li>
        </ul>
      </td>
      <td>06/23/2026</td>
      <td>06/23/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html">S3 Presigned URLs</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html">S3 CORS Configuration</a></li>
          <li><a href="https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html">AWS SDK for JavaScript v3</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-reviews-module/">Build Reviews module with star ratings</a></li>
          <li><a href="3-day3-reviews-module/">Implement automatic average rating calculation</a></li>
          <li><a href="3-day3-reviews-module/">Add vote review as helpful feature with Redis tracking</a></li>
          <li><a href="3-day3-reviews-module/">Enable business owner replies to reviews</a></li>
        </ul>
      </td>
      <td>06/24/2026</td>
      <td>06/24/2026</td>
      <td>
        <ul>
          <li><a href="https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing">Prisma Aggregation</a></li>
          <li><a href="https://redis.io/docs/manual/data-types/sets/">Redis Sets</a></li>
          <li><a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html">Lambda Concurrency</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <ul>
          <li><a href="4-day4-trips-module/">Build Trips module for itinerary planning</a></li>
          <li><a href="4-day4-trips-module/">Implement save/unsave favorite places</a></li>
          <li><a href="4-day4-trips-module/">Create trip with places organized by day and order</a></li>
          <li><a href="4-day4-trips-module/">Add trip sharing with unique tokens (public/private)</a></li>
        </ul>
      </td>
      <td>06/25/2026</td>
      <td>06/25/2026</td>
      <td>
        <ul>
          <li><a href="https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries">Prisma Relations</a></li>
          <li><a href="https://nodejs.org/api/crypto.html">Node.js Crypto</a></li>
          <li><a href="https://www.prisma.io/docs/concepts/components/prisma-client/crud#update">Prisma Update</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <ul>
          <li><a href="5-day5-testing-integration/">Test all modules end-to-end</a></li>
          <li><a href="5-day5-testing-integration/">Create sample data for demo (places, reviews, trips)</a></li>
          <li><a href="5-day5-testing-integration/">Verify Redis caching and S3 uploads</a></li>
          <li><a href="5-day5-testing-integration/">Test public trip sharing without authentication</a></li>
        </ul>
      </td>
      <td>06/26/2026</td>
      <td>06/26/2026</td>
      <td>
        <ul>
          <li><a href="https://www.postman.com/api-testing-guide/">API Testing with Postman</a></li>
          <li><a href="https://docs.aws.amazon.com/lambda/latest/dg/testing-functions.html">Testing Lambda Functions</a></li>
          <li><a href="https://www.prisma.io/docs/guides/database/seed-database">Seed Database</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: Places Module with Search and Caching](1-day1-places-module/)
- [Day 2: S3 Presigned URLs for Image Uploads](2-day2-s3-image-upload/)
- [Day 3: Reviews Module with Rating Calculation](3-day3-reviews-module/)
- [Day 4: Trips Module for Itinerary Planning](4-day4-trips-module/)
- [Day 5: Testing and Integration](5-day5-testing-integration/)

## Module Overview

### Places Module (7 endpoints)
```text
POST   /api/places              - Create place (owner/admin)
GET    /api/places              - List places with pagination
GET    /api/places/search       - Search with filters
GET    /api/places/:id          - Get place details (cache)
PUT    /api/places/:id          - Update place (owner/admin)
DELETE /api/places/:id          - Delete place (admin)
POST   /api/places/:id/upload   - Get presigned upload URL
```

**Key Features:**
- Category: HOTEL, RESTAURANT, ATTRACTION, TOUR
- Search filters: category, city, priceRange, rating
- Redis caching: 5 min TTL for GET requests
- View tracking: Increment views on each GET
- Owner/admin authorization

### Reviews Module (7 endpoints)
```text
POST   /api/reviews             - Create review (1-5 stars)
GET    /api/reviews/:placeId    - Get reviews for place
PUT    /api/reviews/:id         - Update own review
DELETE /api/reviews/:id         - Delete own review
POST   /api/reviews/:id/helpful - Vote review as helpful
POST   /api/reviews/:id/report  - Report inappropriate review
POST   /api/reviews/:id/reply   - Business owner reply
```

**Key Features:**
- Star rating: 1-5 with comments
- Auto-calculate place average rating
- One review per user per place
- Vote tracking in Redis (24h TTL)
- Soft delete with isDeleted flag
- Business owner can reply

### Trips Module (12 endpoints)
```text
POST   /api/trips/save/:placeId       - Save favorite place
DELETE /api/trips/unsave/:placeId     - Unsave place
GET    /api/trips/saved               - Get saved places
POST   /api/trips                     - Create trip
GET    /api/trips                     - Get user's trips
GET    /api/trips/:id                 - Get trip details
PUT    /api/trips/:id                 - Update trip
DELETE /api/trips/:id                 - Delete trip
POST   /api/trips/:id/places          - Add place to trip
PUT    /api/trips/:id/places/:placeId - Update place position
DELETE /api/trips/:id/places/:placeId - Remove place from trip
GET    /api/trips/share/:token        - View public trip (no auth)
```

**Key Features:**
- Trip planner with itinerary
- Places organized by day and order
- Public/private trips
- Share token: 32-char hex (crypto.randomBytes)
- Optional notes for each place
- Drag-and-drop ordering

## Data Flow Architecture

```text
Client Request
    ↓
API Gateway (rate limit: 100 req/min)
    ↓
Lambda Function
    ↓
┌─────────────┬─────────────┬─────────────┐
│   Places    │   Reviews   │    Trips    │
│   Module    │   Module    │   Module    │
└─────────────┴─────────────┴─────────────┘
    ↓             ↓             ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Redis Cache │ │  Calculate  │ │Share Tokens │
│  (5 min)    │ │   Rating    │ │  (public)   │
└─────────────┘ └─────────────┘ └─────────────┘
    ↓             ↓             ↓
RDS PostgreSQL (Prisma)
    ↓
S3 Bucket (images via presigned URLs)
```

## API Statistics (Week 9 + Week 10)

| Module | Endpoints | Completion |
|--------|-----------|------------|
| Auth | 7 | ✅ Week 9 |
| Places | 7 | ✅ Week 10 |
| Reviews | 7 | ✅ Week 10 |
| Trips | 12 | ✅ Week 10 |
| **Total** | **33** | **76% Complete** |

**Remaining:** Business & Bookings Module (10 endpoints) - Week 11

## Sample Data Created

### Places (3 total)
1. **Hanoi Old Quarter** (ATTRACTION)
   - City: Hanoi, Vietnam
   - Rating: 4.5 ⭐
   - Views: 45

2. **InterContinental Hanoi Westlake** (HOTEL)
   - City: Hanoi, Vietnam
   - Price: $$$$
   - Rating: 5.0 ⭐

3. **Bun Cha Huong Lien** (RESTAURANT)
   - City: Hanoi, Vietnam
   - Price: $
   - Rating: 4.0 ⭐

### Reviews (2 total)
- User 1 → Hanoi Old Quarter: 5⭐ "Amazing experience!"
- User 2 → Hanoi Old Quarter: 4⭐ "Great but crowded"
- Average: 4.5 ⭐

### Trips (1 total)
- **Hanoi 3 Day Tour** (public)
  - Day 1: Hanoi Old Quarter
  - Day 2: InterContinental Hotel
  - Share Token: 87602afec97f25ad905cf58a04dfa99e

## Note For Mentors

Week 10 builds the core business modules on top of the authentication foundation from Week 9. Day 1-2 covers Places module with Redis caching and S3 presigned URLs for secure image uploads. Day 3 implements Reviews with automatic rating calculation and helpful vote tracking. Day 4 creates the Trip planner with public sharing via unique tokens. Day 5 focuses on end-to-end testing and sample data creation. By the end of this week, 33 out of 43 endpoints (76%) will be complete.

