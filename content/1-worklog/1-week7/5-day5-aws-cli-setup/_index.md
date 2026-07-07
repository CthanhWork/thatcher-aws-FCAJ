---
title: "Day 5 - AWS CLI Setup for Local Development"
date: 2026-06-05
weight: 5
summary: "Installed AWS CLI v2, configured credentials and default region, tested CLI access to AWS services from local development environment."
chapter: false
---

## Implementation Steps

### Install AWS CLI v2

**Windows:**
```powershell
# Download from https://awscli.amazonaws.com/AWSCLIV2.msi
# Run installer
aws --version
```

**Mac/Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Configure AWS CLI

```bash
aws configure
# AWS Access Key ID: [from IAM credentials]
# Secret Access Key: [from CSV file]
# Default region: ap-southeast-1
# Output format: json
```

### Test CLI

```bash
aws ec2 describe-vpcs
aws s3 ls
aws sts get-caller-identity
```

## What I Learned
- AWS CLI enables automation scripts
- Credentials stored in ~/.aws/credentials
- Named profiles support multiple accounts

## Reference Materials
- [Installing AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
