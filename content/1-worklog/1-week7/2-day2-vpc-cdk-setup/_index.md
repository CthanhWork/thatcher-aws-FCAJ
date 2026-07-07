---
title: "Day 2 - VPC Infrastructure with AWS CDK"
date: 2026-06-02
weight: 2
summary: "Created VPC infrastructure using AWS CDK for Infrastructure as Code, deploying VPC with public/private subnets, NAT Gateway, and Internet Gateway across 2 Availability Zones."
chapter: false
---

## Why I Did This

AWS CDK enables Infrastructure as Code, making VPC setup repeatable, version-controlled, and easy to replicate across environments (dev/staging/prod).

## Implementation Steps

### Step 1: Install AWS CDK

```bash
npm install -g aws-cdk
cdk --version
```

### Step 2: Initialize CDK Project

```bash
mkdir infrastructure
cd infrastructure
cdk init app --language=typescript
```

### Step 3: Create VPC Stack

**lib/infrastructure-stack.ts:**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'TravelPlatformVPC', {
      vpcName: 'travel-platform-vpc',
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    });

    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
      exportName: 'TravelPlatformVpcId',
    });
  }
}
```

### Step 4: Deploy Stack

```bash
cdk bootstrap aws://ACCOUNT_ID/ap-southeast-1
cdk deploy
```

![VPC Creation via CDK](/images/week7/day2/vpc-creation.png)

**Created resources:**
- VPC: 10.0.0.0/16
- Public subnets: 10.0.1.0/24, 10.0.2.0/24
- Private subnets: 10.0.11.0/24, 10.0.12.0/24
- Internet Gateway
- NAT Gateway (1 for cost optimization)
- Route Tables

## What I Learned

- CDK generates CloudFormation templates from code
- Infrastructure changes tracked in Git
- Single NAT Gateway saves costs (~$32/month per NAT)
- CDK outputs enable cross-stack references

## Reference Materials

- [AWS CDK Developer Guide](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
- [CDK EC2 Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html)
