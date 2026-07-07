---
title: "Week 6"
date: 2026-05-25
weight: 6
summary: "Week 6 covers advanced AWS services including message queuing with SQS, pub/sub messaging with SNS, in-memory caching with ElastiCache, content delivery with CloudFront, and secrets management with Secrets Manager."
chapter: false
---

## Weekly Objective

This week advances into distributed systems patterns and performance optimization for H-Smart, covering asynchronous messaging, caching strategies, global content delivery, and secure secrets management. The focus is on building scalable, decoupled architectures that can handle high traffic and maintain performance.

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
          <li><a href="1-day1-sqs-messaging/">Practice Amazon SQS for asynchronous message queuing</a></li>
          <li><a href="1-day1-sqs-messaging/">Create standard and FIFO queues</a></li>
          <li><a href="1-day1-sqs-messaging/">Implement producer-consumer pattern for decoupled services</a></li>
        </ul>
      </td>
      <td>05/25/2026</td>
      <td>05/25/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html">What is Amazon SQS?</a></li>
          <li><a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html">Standard queues</a></li>
          <li><a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html">FIFO queues</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-sns-notifications/">Practice Amazon SNS for pub/sub messaging</a></li>
          <li><a href="2-day2-sns-notifications/">Create SNS topics and subscriptions</a></li>
          <li><a href="2-day2-sns-notifications/">Integrate SNS with Lambda, SQS, and email endpoints</a></li>
        </ul>
      </td>
      <td>05/26/2026</td>
      <td>05/26/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/sns/latest/dg/welcome.html">What is Amazon SNS?</a></li>
          <li><a href="https://docs.aws.amazon.com/sns/latest/dg/sns-create-subscribe-endpoint-to-topic.html">Subscribing to a topic</a></li>
          <li><a href="https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html">Message filtering</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-elasticache-redis/">Practice Amazon ElastiCache for Redis caching</a></li>
          <li><a href="3-day3-elasticache-redis/">Create Redis cluster for session storage and caching</a></li>
          <li><a href="3-day3-elasticache-redis/">Test cache hit/miss performance improvements</a></li>
        </ul>
      </td>
      <td>05/27/2026</td>
      <td>05/27/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html">What is ElastiCache for Redis?</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Clusters.Create.html">Creating a Redis cluster</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/BestPractices.html">Caching best practices</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <ul>
          <li><a href="4-day4-cloudfront-cdn/">Practice CloudFront CDN for global content delivery</a></li>
          <li><a href="4-day4-cloudfront-cdn/">Configure CloudFront distribution with custom origins</a></li>
          <li><a href="4-day4-cloudfront-cdn/">Implement cache behaviors and TTL strategies</a></li>
        </ul>
      </td>
      <td>05/28/2026</td>
      <td>05/28/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html">What is CloudFront?</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html">Working with distributions</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html">Managing cache expiration</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <ul>
          <li><a href="5-day5-secrets-manager/">Practice AWS Secrets Manager for secure credential storage</a></li>
          <li><a href="5-day5-secrets-manager/">Store database credentials and API keys securely</a></li>
          <li><a href="5-day5-secrets-manager/">Rotate secrets automatically with Lambda functions</a></li>
        </ul>
      </td>
      <td>05/29/2026</td>
      <td>05/29/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html">What is Secrets Manager?</a></li>
          <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html">Rotating secrets</a></li>
          <li><a href="https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html">Best practices</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>6</td>
      <td>
        <ul>
          <li><a href="6-day6-step-functions/">Practice AWS Step Functions for workflow orchestration</a></li>
          <li><a href="6-day6-step-functions/">Create state machine for multi-step business processes</a></li>
          <li><a href="6-day6-step-functions/">Coordinate Lambda functions with error handling and retries</a></li>
        </ul>
      </td>
      <td>05/30/2026</td>
      <td>05/30/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html">What is Step Functions?</a></li>
          <li><a href="https://docs.aws.amazon.com/step-functions/latest/dg/concepts-states.html">States and state machines</a></li>
          <li><a href="https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html">Error handling</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: Amazon SQS for Asynchronous Message Queuing](1-day1-sqs-messaging/)
- [Day 2: Amazon SNS for Pub/Sub Messaging](2-day2-sns-notifications/)
- [Day 3: Amazon ElastiCache for Redis Caching](3-day3-elasticache-redis/)
- [Day 4: CloudFront CDN for Global Content Delivery](4-day4-cloudfront-cdn/)
- [Day 5: AWS Secrets Manager for Secure Credential Storage](5-day5-secrets-manager/)
- [Day 6: AWS Step Functions for Workflow Orchestration](6-day6-step-functions/)

## Note For Mentors

Week 6 focuses on distributed systems patterns and performance optimization including asynchronous messaging, caching strategies, global content delivery, secrets management, and serverless workflow orchestration. These services enable H-Smart to scale horizontally, improve performance, and maintain security best practices.
