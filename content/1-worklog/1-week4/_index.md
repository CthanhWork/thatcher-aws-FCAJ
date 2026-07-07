---
title: "Week 4"
date: 2026-05-11
weight: 4
summary: "Week 4 covers advanced AWS services including container orchestration with ECS, NoSQL databases with DynamoDB, infrastructure as code with CloudFormation, CI/CD pipelines, and security best practices."
chapter: false
---

## Weekly Objective

This week advances into production-ready AWS architectures for H-Smart, covering containerization, infrastructure automation, continuous deployment, and security hardening. The focus shifts from manual console operations to code-driven infrastructure and automated deployment pipelines.

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
          <li><a href="1-day1-docker-ecr/">Practice Docker containerization and Amazon ECR</a></li>
          <li><a href="1-day1-docker-ecr/">Build Docker image for H-Smart application</a></li>
          <li><a href="1-day1-docker-ecr/">Push container image to ECR private registry</a></li>
        </ul>
      </td>
      <td>05/11/2026</td>
      <td>05/11/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html">What is Amazon ECR?</a></li>
          <li><a href="https://docs.docker.com/get-started/">Docker Get Started</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html">Pushing a Docker image</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-ecs-fargate/">Practice Amazon ECS with Fargate for serverless containers</a></li>
          <li><a href="2-day2-ecs-fargate/">Create ECS cluster and task definition</a></li>
          <li><a href="2-day2-ecs-fargate/">Deploy containerized application with Fargate launch type</a></li>
          <li>Learn lab05 from AWS Foundation video series: Introduction to container orchestration</li>
        </ul>
      </td>
      <td>05/12/2026</td>
      <td>05/12/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html">What is Amazon ECS?</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html">AWS Fargate</a></li>
          <li><a href="https://www.youtube.com/watch?v=AQlsd0nWdZk&list=PLahN4TLWtox2a3vElknwzU_urND8hLn1i">AWS Foundation Video Series</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-dynamodb/">Practice Amazon DynamoDB for NoSQL data storage</a></li>
          <li><a href="3-day3-dynamodb/">Create DynamoDB table with partition and sort keys</a></li>
          <li><a href="3-day3-dynamodb/">Perform CRUD operations and query with secondary indexes</a></li>
          <li>Learn lab06 from AWS Foundation video series: NoSQL database fundamentals</li>
        </ul>
      </td>
      <td>05/13/2026</td>
      <td>05/13/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html">What is DynamoDB?</a></li>
          <li><a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.html">Working with tables</a></li>
          <li><a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html">Secondary indexes</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <ul>
          <li><a href="4-day4-cloudformation/">Practice AWS CloudFormation for Infrastructure as Code</a></li>
          <li><a href="4-day4-cloudformation/">Create CloudFormation template for VPC and networking</a></li>
          <li><a href="4-day4-cloudformation/">Deploy stack and manage infrastructure changes with change sets</a></li>
        </ul>
      </td>
      <td>05/14/2026</td>
      <td>05/14/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html">What is CloudFormation?</a></li>
          <li><a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html">Template reference</a></li>
          <li><a href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html">Updating stacks</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <ul>
          <li><a href="5-day5-cicd-pipeline/">Practice CI/CD pipeline with CodePipeline and CodeBuild</a></li>
          <li><a href="5-day5-cicd-pipeline/">Configure automated build and deployment pipeline</a></li>
          <li><a href="5-day5-cicd-pipeline/">Deploy application automatically from GitHub commits</a></li>
          <li>Learn lab07 from AWS Foundation video series: CI/CD best practices</li>
        </ul>
      </td>
      <td>05/15/2026</td>
      <td>05/15/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html">What is CodePipeline?</a></li>
          <li><a href="https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html">What is CodeBuild?</a></li>
          <li><a href="https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html">What is CodeDeploy?</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>6</td>
      <td>
        <ul>
          <li><a href="6-day6-waf-shield/">Practice AWS WAF and Shield for application security</a></li>
          <li><a href="6-day6-waf-shield/">Configure WAF rules to protect against common web exploits</a></li>
          <li><a href="6-day6-waf-shield/">Enable Shield Standard and review DDoS protection</a></li>
        </ul>
      </td>
      <td>05/16/2026</td>
      <td>05/16/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html">What is AWS WAF?</a></li>
          <li><a href="https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html">Web ACLs</a></li>
          <li><a href="https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html">AWS Shield</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: Docker Containerization and Amazon ECR](1-day1-docker-ecr/)
- [Day 2: Amazon ECS with Fargate for Serverless Containers](2-day2-ecs-fargate/)
- [Day 3: Amazon DynamoDB for NoSQL Data Storage](3-day3-dynamodb/)
- [Day 4: AWS CloudFormation for Infrastructure as Code](4-day4-cloudformation/)
- [Day 5: CI/CD Pipeline with CodePipeline and CodeBuild](5-day5-cicd-pipeline/)
- [Day 6: AWS WAF and Shield for Application Security](6-day6-waf-shield/)

## Note For Mentors

Week 4 focuses on production-ready practices including containerization, infrastructure automation, CI/CD pipelines, and security hardening. Several days include learning from AWS Foundation video series (lab05-lab07) to supplement hands-on practice with theoretical foundations.
