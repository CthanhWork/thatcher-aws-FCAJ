---
title: "Week 10"
date: 2026-06-22
weight: 10
summary: "Week 10 covers the core business modules for the Travel Platform, including Places management, Reviews, and Trip planning."
chapter: false
---

## Weekly Objective

This week focuses on building the core business modules for the Travel Platform. The detailed implementation notes for each module are documented on the Day 1 to Day 5 pages below.

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
          <li><a href="1-day1-places-module/">Implement search with filters</a></li>
          <li><a href="1-day1-places-module/">Add Redis caching for place listings</a></li>
          <li><a href="1-day1-places-module/">Implement place view tracking</a></li>
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
          <li><a href="3-day3-reviews-module/">Add helpful vote tracking with Redis</a></li>
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
          <li><a href="4-day4-trips-module/">Add trip sharing with unique tokens</a></li>
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
          <li><a href="5-day5-testing-integration/">Create sample data for demo</a></li>
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

## Note For Mentors

Week 10 completes the core business layer of the Travel Platform. The full implementation details, module breakdowns, sample data, and technical results are documented on each Day page so this overview stays consistent with the other weeks.
