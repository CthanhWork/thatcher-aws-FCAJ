---
title: "Day 4 - AWS CloudFormation for Infrastructure as Code"
date: 2026-05-14
weight: 4
summary: "Practiced AWS CloudFormation by creating infrastructure templates in YAML, deploying VPC and networking resources as code, and managing infrastructure changes with change sets."
chapter: false
---

## Why I Did This

This task practiced AWS CloudFormation as Infrastructure as Code (IaC) to automate and version control AWS resource provisioning.

CloudFormation benefits:
- **Repeatable deployments**: Same template creates identical infrastructure across environments
- **Version control**: Infrastructure changes tracked in Git like application code
- **Rollback capability**: Failed deployments automatically rollback to previous state
- **Cost transparency**: Preview costs before creating resources

For H-Smart, CloudFormation enables consistent dev/staging/prod environments and disaster recovery.

## Implementation Steps

### Step 1: Create CloudFormation Template for VPC

**vpc-template.yaml:**
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: H-Smart VPC infrastructure with public and private subnets

Parameters:
  EnvironmentName:
    Type: String
    Default: H-Smart-Dev
    Description: Environment name prefix

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.1.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-VPC

  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-IGW

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.1.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-Public-Subnet-1

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName}-Public-RT

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: AttachGateway
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  SubnetRouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet1
      RouteTableId: !Ref PublicRouteTable

Outputs:
  VPCID:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub ${EnvironmentName}-VPCID

  PublicSubnet1ID:
    Description: Public Subnet 1 ID
    Value: !Ref PublicSubnet1
    Export:
      Name: !Sub ${EnvironmentName}-PublicSubnet1
```

### Step 2: Validate Template

```bash
aws cloudformation validate-template --template-body file://vpc-template.yaml
```

Output confirms template syntax is valid.

### Step 3: Create Stack

```bash
aws cloudformation create-stack \
  --stack-name H-Smart-VPC-Stack \
  --template-body file://vpc-template.yaml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=H-Smart-Dev
```

Stack creation progress:
```text
CREATE_IN_PROGRESS → CREATE_COMPLETE (takes 2-3 minutes)
```

### Step 4: Review Stack Resources

In CloudFormation console:
- Stack status: CREATE_COMPLETE
- Resources: 7 resources created (VPC, IGW, Subnet, RouteTable, etc.)
- Outputs: VPCID and PublicSubnet1ID exported for cross-stack references

### Step 5: Update Stack with Change Set

To add a second subnet, I created a change set:

```bash
aws cloudformation create-change-set \
  --stack-name H-Smart-VPC-Stack \
  --template-body file://vpc-template-v2.yaml \
  --change-set-name add-second-subnet
```

Review changes before applying:
```text
Changes:
  + AWS::EC2::Subnet PublicSubnet2
  + AWS::EC2::SubnetRouteTableAssociation SubnetAssoc2
```

Execute change set:
```bash
aws cloudformation execute-change-set \
  --change-set-name add-second-subnet \
  --stack-name H-Smart-VPC-Stack
```

### Step 6: Delete Stack

```bash
aws cloudformation delete-stack --stack-name H-Smart-VPC-Stack
```

All resources created by the stack are automatically deleted.

## What I Learned

- CloudFormation templates define infrastructure as code in JSON or YAML
- Intrinsic functions like `!Ref`, `!Sub`, `!GetAZs` enable dynamic resource references
- Parameters make templates reusable across environments
- Outputs export values for cross-stack references
- Change sets preview infrastructure updates before applying
- Stack deletion automatically cleans up all resources

## Application to H-Smart

CloudFormation enables:
1. **Environment parity**: Dev, staging, and prod environments created from same template
2. **Disaster recovery**: Recreate entire infrastructure from templates in minutes
3. **Cost control**: Delete entire environments (dev/staging) overnight to save costs
4. **Collaboration**: Infrastructure changes reviewed in Pull Requests like code

## Reference Materials

- [What is CloudFormation?](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
- [Template reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html)
- [Updating stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html)
