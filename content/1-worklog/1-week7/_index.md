---
title: "Week 7"
date: 2026-06-01
weight: 7
summary: "Week 7 starts a real-world project implementation by setting up AWS foundation infrastructure including IAM security framework, VPC architecture with CDK, security groups, billing controls, and project tagging best practices."
chapter: false
---

## Weekly Objective

This week marks the beginning of a practical project implementation, shifting from isolated service practice to building a complete production-ready architecture. The focus is on establishing secure infrastructure foundations, implementing Infrastructure as Code with AWS CDK, and setting up proper cost controls before deploying application workloads.

The project context: Building infrastructure for a travel platform application with backend APIs, database, caching layer, and monitoring.

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
          <li><a href="1-day1-iam-security-setup/">Setup IAM security framework for project</a></li>
          <li><a href="1-day1-iam-security-setup/">Create admin IAM user to replace root account usage</a></li>
          <li><a href="1-day1-iam-security-setup/">Create service roles for Lambda, ECS, and RDS access</a></li>
          <li><a href="1-day1-iam-security-setup/">Enable AWS CloudTrail for audit logging</a></li>
        </ul>
      </td>
      <td>06/01/2026</td>
      <td>06/01/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html">IAM Best Practices</a></li>
          <li><a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html">CloudTrail User Guide</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-vpc-cdk-setup/">Create VPC infrastructure with AWS CDK</a></li>
          <li><a href="2-day2-vpc-cdk-setup/">Install and configure AWS CDK for Infrastructure as Code</a></li>
          <li><a href="2-day2-vpc-cdk-setup/">Deploy VPC with public/private subnets across 2 AZs</a></li>
          <li><a href="2-day2-vpc-cdk-setup/">Configure NAT Gateway and Internet Gateway</a></li>
        </ul>
      </td>
      <td>06/02/2026</td>
      <td>06/02/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/cdk/v2/guide/home.html">AWS CDK Developer Guide</a></li>
          <li><a href="https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html">CDK EC2 Module</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-security-groups/">Configure Security Groups for multi-tier architecture</a></li>
          <li><a href="3-day3-security-groups/">Create security groups for RDS, Redis, Lambda/ECS</a></li>
          <li><a href="3-day3-security-groups/">Implement least-privilege network access rules</a></li>
        </ul>
      </td>
      <td>06/03/2026</td>
      <td>06/03/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html">Security Groups</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html">VPC Security Best Practices</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <ul>
          <li><a href="4-day4-billing-alerts/">Setup billing alerts and budget controls</a></li>
          <li><a href="4-day4-billing-alerts/">Enable billing alerts and Free Tier usage notifications</a></li>
          <li><a href="4-day4-billing-alerts/">Create AWS Budgets with email notifications</a></li>
          <li><a href="4-day4-billing-alerts/">Configure CloudWatch billing alarms</a></li>
        </ul>
      </td>
      <td>06/04/2026</td>
      <td>06/04/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/budgets-managing-costs.html">AWS Budgets</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html">Billing Alarms</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <ul>
          <li><a href="5-day5-aws-cli-setup/">Setup and configure AWS CLI for local development</a></li>
          <li><a href="5-day5-aws-cli-setup/">Install AWS CLI v2 on local machine</a></li>
          <li><a href="5-day5-aws-cli-setup/">Configure AWS credentials and default region</a></li>
          <li><a href="5-day5-aws-cli-setup/">Test CLI access to AWS services</a></li>
        </ul>
      </td>
      <td>06/05/2026</td>
      <td>06/05/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html">Installing AWS CLI</a></li>
          <li><a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html">Configuring AWS CLI</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: IAM Security Framework Setup](1-day1-iam-security-setup/)
- [Day 2: VPC Infrastructure with AWS CDK](2-day2-vpc-cdk-setup/)
- [Day 3: Security Groups for Multi-Tier Architecture](3-day3-security-groups/)
- [Day 4: Billing Alerts and Budget Controls](4-day4-billing-alerts/)
- [Day 5: AWS CLI Setup for Local Development](5-day5-aws-cli-setup/)

## Note For Mentors

Week 7 transitions from learning individual AWS services to implementing a real production project. The focus is on infrastructure foundations: security (IAM, CloudTrail), networking (VPC via CDK), cost controls (budgets, alarms), and operational best practices (tagging, CLI setup). This establishes a secure, monitored, and well-organized environment before deploying application workloads in subsequent weeks.
