---
title: "Week 3"
date: 2026-05-04
weight: 3
summary: "Week 3 documents an FCAJ internal team meeting with four speakers covering learning psychology, AWS AI applications, career mindset, and AI-assisted development tooling."
chapter: false
---

## Weekly Objective

This week focuses on building application-layer AWS infrastructure for H-Smart, moving beyond networking fundamentals into compute, storage, database, and serverless services. The hands-on tasks include load balancing with ALB, auto-scaling for capacity management, managed databases with RDS, static website hosting with S3 and CloudFront, serverless APIs with Lambda and API Gateway, and operational monitoring with CloudWatch. Week 3 concludes with a structured team meeting on Day 7 where four speakers share insights on learning psychology, AWS AI applications, career mindset, and AI-assisted development tooling.

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
          <li><a href="1-day1-elastic-load-balancer/">Practice Application Load Balancer for HTTP/HTTPS traffic distribution</a></li>
          <li><a href="1-day1-elastic-load-balancer/">Create target group with health checks</a></li>
          <li><a href="1-day1-elastic-load-balancer/">Configure ALB with multiple availability zones for high availability</a></li>
        </ul>
      </td>
      <td>05/04/2026</td>
      <td>05/04/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html">What is an Application Load Balancer?</a></li>
          <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html">Target groups</a></li>
          <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html">Health checks</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-auto-scaling-group/">Practice Auto Scaling Group for automatic capacity management</a></li>
          <li><a href="2-day2-auto-scaling-group/">Create launch template with user data script</a></li>
          <li><a href="2-day2-auto-scaling-group/">Configure scaling policies based on CPU utilization</a></li>
        </ul>
      </td>
      <td>05/05/2026</td>
      <td>05/05/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html">What is Amazon EC2 Auto Scaling?</a></li>
          <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html">Launch templates</a></li>
          <li><a href="https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html">Dynamic scaling</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-rds-mysql/">Practice Amazon RDS for managed MySQL database</a></li>
          <li><a href="3-day3-rds-mysql/">Create Multi-AZ RDS instance for high availability</a></li>
          <li><a href="3-day3-rds-mysql/">Configure security groups for database access from application tier</a></li>
        </ul>
      </td>
      <td>05/06/2026</td>
      <td>05/06/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html">What is Amazon RDS?</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html">Multi-AZ deployments</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html">MySQL on Amazon RDS</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <ul>
          <li><a href="4-day4-s3-static-website/">Practice S3 static website hosting with CloudFront CDN</a></li>
          <li><a href="4-day4-s3-static-website/">Configure S3 bucket policy for public read access</a></li>
          <li><a href="4-day4-s3-static-website/">Set up CloudFront distribution with custom domain and HTTPS</a></li>
        </ul>
      </td>
      <td>05/07/2026</td>
      <td>05/07/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html">Hosting a static website on S3</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html">What is Amazon CloudFront?</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html">Website access permissions</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <ul>
          <li><a href="5-day5-lambda-api-gateway/">Practice AWS Lambda serverless functions with API Gateway</a></li>
          <li><a href="5-day5-lambda-api-gateway/">Create Lambda function with Python runtime</a></li>
          <li><a href="5-day5-lambda-api-gateway/">Configure API Gateway REST API to trigger Lambda function</a></li>
        </ul>
      </td>
      <td>05/08/2026</td>
      <td>05/08/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/lambda/latest/dg/welcome.html">What is AWS Lambda?</a></li>
          <li><a href="https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html">What is Amazon API Gateway?</a></li>
          <li><a href="https://docs.aws.amazon.com/lambda/latest/dg/with-on-demand-https.html">Using Lambda with API Gateway</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>6</td>
      <td>
        <ul>
          <li><a href="6-day6-cloudwatch-monitoring/">Practice CloudWatch monitoring and alarms for AWS resources</a></li>
          <li><a href="6-day6-cloudwatch-monitoring/">Create custom CloudWatch dashboard for EC2, RDS, and ALB metrics</a></li>
          <li><a href="6-day6-cloudwatch-monitoring/">Configure SNS topic and CloudWatch alarms for high CPU or unhealthy targets</a></li>
        </ul>
      </td>
      <td>05/09/2026</td>
      <td>05/09/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html">What is Amazon CloudWatch?</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html">Create alarms</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html">Using CloudWatch dashboards</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>7</td>
      <td>
        <ul>
          <li><a href="1-day7-team-meeting/">Attend FCAJ internal team meeting with four speaker sessions</a></li>
          <li><a href="1-day7-team-meeting/">Absorb and document insights on learning psychology, AWS AI, career mindset, and AI vibe-coding tooling</a></li>
        </ul>
      </td>
      <td>05/10/2026</td>
      <td>05/10/2026</td>
      <td>
        <ul>
          <li><a href="https://aws.amazon.com/bedrock/">Amazon Bedrock</a></li>
          <li><a href="https://aws.amazon.com/ai/">AI on AWS</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: Application Load Balancer for High Availability](1-day1-elastic-load-balancer/)
- [Day 2: Auto Scaling Group for Automatic Capacity Management](2-day2-auto-scaling-group/)
- [Day 3: Amazon RDS for Managed MySQL Database](3-day3-rds-mysql/)
- [Day 4: S3 Static Website Hosting with CloudFront CDN](4-day4-s3-static-website/)
- [Day 5: AWS Lambda and API Gateway for Serverless APIs](5-day5-lambda-api-gateway/)
- [Day 6: CloudWatch Monitoring and Alarms](6-day6-cloudwatch-monitoring/)
- [Day 7: FCAJ Team Meeting — Learning, AI, Career, and Vibe-Coding](1-day7-team-meeting/)

## Note For Mentors

Mentors can review raw evidence directly in the detailed task pages linked from the table above. Week 3 covers application-layer infrastructure including load balancing, auto-scaling, managed databases, static website hosting, serverless APIs, and operational monitoring. Day 7 documents the FCAJ team meeting with takeaways from all four speaker sessions on learning, AI, career, and development workflows.
