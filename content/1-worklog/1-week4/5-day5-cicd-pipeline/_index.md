---
title: "Day 5 - CI/CD Pipeline with CodePipeline and CodeBuild"
date: 2026-05-15
weight: 5
summary: "Practiced CI/CD automation by configuring AWS CodePipeline and CodeBuild to automatically build Docker images, push to ECR, and deploy to ECS Fargate on every GitHub commit. Supplemented with lab07 from AWS Foundation video series on CI/CD best practices."
chapter: false
---

## Why I Did This

This task practiced AWS CI/CD services to automate the build and deployment pipeline from code commit to production.

CI/CD benefits:
- **Faster releases**: Deploy changes in minutes instead of hours
- **Fewer errors**: Automated testing catches bugs before production
- **Consistency**: Same deployment process every time
- **Rapid rollback**: Quickly revert to previous version if issues arise

For H-Smart, CI/CD enables shipping features faster while maintaining quality.

## Lab07 - CI/CD Best Practices

Before implementation, I reviewed lab07 from the AWS Foundation video series covering:

- **Continuous Integration**: Automatically build and test code on every commit
- **Continuous Deployment**: Automatically deploy passing builds to production
- **Pipeline stages**: Source → Build → Test → Deploy
- **AWS CodePipeline**: Orchestrates the entire workflow
- **AWS CodeBuild**: Compiles code, runs tests, produces artifacts
- **AWS CodeDeploy**: Deploys applications to EC2, ECS, Lambda

## Implementation Steps

### Step 1: Create CodeBuild Project

**Build configuration:**
```text
Project name: H-Smart-Build
Source: GitHub (connect to repository)
Environment: Managed image - Amazon Linux 2
Runtime: Standard 5.0
Privileged mode: Enabled (required for Docker builds)
Service role: Create new role
```

**buildspec.yml** (in repository root):
```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
      - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/hsmart-app
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"hsmart-app","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json

artifacts:
  files: imagedefinitions.json
```

### Step 2: Create CodePipeline

**Pipeline configuration:**
```text
Pipeline name: H-Smart-Pipeline
Service role: Create new role
```

**Stage 1 - Source:**
```text
Source provider: GitHub (Version 2)
Connection: Create new connection to GitHub
Repository: cthanhwork/hsmart-app
Branch: main
Output artifact: SourceArtifact
```

**Stage 2 - Build:**
```text
Build provider: AWS CodeBuild
Project: H-Smart-Build
Input artifact: SourceArtifact
Output artifact: BuildArtifact
```

**Stage 3 - Deploy:**
```text
Deploy provider: Amazon ECS
Cluster: H-Smart-Cluster
Service: hsmart-service
Input artifact: BuildArtifact
Image definitions file: imagedefinitions.json
```

### Step 3: Test Pipeline Execution

I pushed a code change to GitHub:

```bash
git add .
git commit -m "Update welcome message"
git push origin main
```

Pipeline automatically triggered:
```text
Stage 1 (Source): SUCCESS - Pulled latest code from GitHub
Stage 2 (Build): SUCCESS - Built Docker image, pushed to ECR
Stage 3 (Deploy): SUCCESS - Deployed new image to ECS
Total time: 8 minutes
```

### Step 4: Verify Deployment

```bash
curl http://H-Smart-ECS-ALB-xxx.ap-southeast-2.elb.amazonaws.com
```

Response shows updated message from the latest commit.

### Step 5: Configure Pipeline Notifications

Created SNS topic for pipeline events:

```text
Topic: H-Smart-Pipeline-Notifications
Subscription: Email to team
Events: Pipeline execution failed, Pipeline execution succeeded
```

Now team receives emails when deployments succeed or fail.

## What I Learned

- CodePipeline orchestrates multi-stage workflows from source to deployment
- CodeBuild compiles code, runs tests, and produces deployable artifacts
- buildspec.yml defines build commands and artifact outputs
- ECS blue-green deployment gradually shifts traffic to new tasks
- Pipeline artifacts pass outputs between stages
- Automated deployments eliminate manual errors and enable rapid iteration

## Application to H-Smart

CI/CD enables:
1. **Feature velocity**: Deploy multiple times per day instead of monthly releases
2. **Quality gates**: Automated tests block buggy code from reaching production
3. **Developer productivity**: Developers focus on features, not deployment scripts
4. **Rollback safety**: Previous Docker images remain in ECR for instant rollback

Next steps:
- Add unit tests to buildspec.yml
- Implement manual approval stage before production deployment
- Configure automated rollback on CloudWatch alarm

## Reference Materials

- [What is CodePipeline?](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
- [What is CodeBuild?](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [What is CodeDeploy?](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html)
- [AWS Foundation Video Series - Lab07](https://www.youtube.com/watch?v=AQlsd0nWdZk&list=PLahN4TLWtox2a3vElknwzU_urND8hLn1i)
