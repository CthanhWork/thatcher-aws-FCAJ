---
title: "Week 5"
date: 2026-05-18
weight: 5
summary: "Week 5 covers serverless architectures with Lambda, API Gateway for RESTful APIs, CloudWatch for monitoring and logging, EventBridge for event-driven patterns, and S3 advanced features for static website hosting."
chapter: false
---

## Weekly Objective

This week focuses on serverless architectures and API development for H-Smart, covering AWS Lambda for compute, API Gateway for RESTful endpoints, CloudWatch for observability, EventBridge for event-driven patterns, and advanced S3 features. The emphasis is on building scalable, cost-effective architectures without managing servers.

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
          <li><a href="1-day1-lambda-basics/">Practice AWS Lambda for serverless compute</a></li>
          <li><a href="1-day1-lambda-basics/">Create Lambda functions with Node.js and Python runtimes</a></li>
          <li><a href="1-day1-lambda-basics/">Configure triggers, environment variables, and execution roles</a></li>
          <li>Learn lab08 from AWS Foundation video series: Serverless fundamentals</li>
        </ul>
      </td>
      <td>05/18/2026</td>
      <td>05/18/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/lambda/latest/dg/welcome.html">What is AWS Lambda?</a></li>
          <li><a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html">Lambda runtimes</a></li>
          <li><a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html">Execution roles</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-api-gateway/">Practice Amazon API Gateway for RESTful APIs</a></li>
          <li><a href="2-day2-api-gateway/">Create REST API with Lambda integration</a></li>
          <li><a href="2-day2-api-gateway/">Configure request/response mapping and CORS</a></li>
          <li><a href="2-day2-api-gateway/">Deploy API to stages (dev, staging, prod)</a></li>
        </ul>
      </td>
      <td>05/19/2026</td>
      <td>05/19/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html">What is API Gateway?</a></li>
          <li><a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html">Lambda proxy integration</a></li>
          <li><a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html">Enable CORS</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-cloudwatch/">Practice Amazon CloudWatch for monitoring and logging</a></li>
          <li><a href="3-day3-cloudwatch/">Create custom metrics and dashboards</a></li>
          <li><a href="3-day3-cloudwatch/">Configure CloudWatch Logs for Lambda functions</a></li>
          <li><a href="3-day3-cloudwatch/">Set up CloudWatch Alarms for automated alerts</a></li>
        </ul>
      </td>
      <td>05/20/2026</td>
      <td>05/20/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html">What is CloudWatch?</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html">Using metrics</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html">CloudWatch Logs</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <ul>
          <li><a href="4-day4-eventbridge/">Practice Amazon EventBridge for event-driven architecture</a></li>
          <li><a href="4-day4-eventbridge/">Create event rules and patterns</a></li>
          <li><a href="4-day4-eventbridge/">Integrate EventBridge with Lambda and SNS targets</a></li>
          <li><a href="4-day4-eventbridge/">Build scheduled tasks with EventBridge rules</a></li>
        </ul>
      </td>
      <td>05/21/2026</td>
      <td>05/21/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html">What is EventBridge?</a></li>
          <li><a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html">EventBridge rules</a></li>
          <li><a href="https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html">EventBridge targets</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <ul>
          <li><a href="5-day5-s3-advanced/">Practice advanced S3 features</a></li>
          <li><a href="5-day5-s3-advanced/">Configure S3 static website hosting</a></li>
          <li><a href="5-day5-s3-advanced/">Set up S3 versioning and lifecycle policies</a></li>
          <li><a href="5-day5-s3-advanced/">Implement S3 event notifications with Lambda</a></li>
        </ul>
      </td>
      <td>05/22/2026</td>
      <td>05/22/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html">Hosting a static website</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html">S3 versioning</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html">S3 event notifications</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: AWS Lambda for Serverless Compute](1-day1-lambda-basics/)
- [Day 2: Amazon API Gateway for RESTful APIs](2-day2-api-gateway/)
- [Day 3: Amazon CloudWatch for Monitoring and Logging](3-day3-cloudwatch/)
- [Day 4: Amazon EventBridge for Event-Driven Architecture](4-day4-eventbridge/)
- [Day 5: Advanced S3 Features and Static Website Hosting](5-day5-s3-advanced/)

## Note For Mentors

Week 5 focuses on serverless architectures and API development, bridging the gap between containerized applications (Week 4) and distributed systems patterns (Week 6). The week covers AWS Lambda as the compute foundation, API Gateway for building RESTful endpoints, CloudWatch for observability, EventBridge for event-driven patterns, and advanced S3 features. Day 1 includes learning from AWS Foundation video series (lab08) to supplement hands-on Lambda practice with serverless fundamentals.
