---
title: "Day 6 - Resource Tagging Strategy"
date: 2026-06-06
weight: 6
summary: "Implemented resource tagging strategy with standardized tags for project management, cost allocation, and environment tracking across all AWS resources."
chapter: false
---

## Implementation Steps

### Define Tagging Standards

**Required tags for all resources:**
```text
Project: TravelPlatform
Environment: Dev | Staging | Production
ManagedBy: CDK | Terraform | Manual
Owner: TeamName
CostCenter: Engineering
```

### Apply Tags via CDK

```typescript
cdk.Tags.of(vpc).add('Project', 'TravelPlatform');
cdk.Tags.of(vpc).add('Environment', 'Dev');
cdk.Tags.of(vpc).add('ManagedBy', 'CDK');
```

### Apply Tags via Console

1. Select resource → Tags tab → Manage tags
2. Add key-value pairs
3. Save

### Enable Cost Allocation Tags

1. Billing Console → Cost Allocation Tags
2. Activate tags: Project, Environment, CostCenter
3. Wait 24 hours for data

## What I Learned
- Tags enable cost tracking by project/team
- Tagging policies enforce standards
- Tags filter resources in console
- Cost Explorer uses tags for reports

## Reference Materials
- [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)
- [Cost Allocation Tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)
