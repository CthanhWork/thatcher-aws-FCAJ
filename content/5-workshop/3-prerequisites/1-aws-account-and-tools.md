---
title: "AWS Account and Local Tools"
weight: 1
---

## AWS Access

Use an IAM identity with permission to deploy and inspect the workshop resources. For an individual sandbox, administrator access may be used temporarily. For team or production work, split responsibilities and use least-privilege roles.

Configure a named AWS CLI profile rather than placing long-lived keys in source files:

```powershell
aws configure --profile travel-workshop
aws sts get-caller-identity --profile travel-workshop
```

## Local Requirements

- Node.js 20 or later
- npm
- AWS CLI v2
- Git
- PostgreSQL client tools for connection checks
- A supported deployment region, such as `ap-southeast-2`

Confirm the toolchain before continuing:

```powershell
node --version
npm --version
aws --version
```
