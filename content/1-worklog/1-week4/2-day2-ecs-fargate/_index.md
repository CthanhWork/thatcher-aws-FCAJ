---
title: "Day 2 - Amazon ECS with Fargate for Serverless Containers"
date: 2026-05-12
weight: 2
summary: "Practiced Amazon ECS with Fargate by creating ECS cluster, defining task definitions, and deploying containerized H-Smart application without managing servers. Supplemented with lab05 from AWS Foundation video series on container orchestration fundamentals."
chapter: false
---

## Why I Did This

This task practiced Amazon Elastic Container Service (ECS) with Fargate launch type as a serverless container orchestration platform.

ECS is AWS's container orchestration service that manages the lifecycle of Docker containers at scale. Fargate is a serverless compute engine that runs containers without requiring you to provision or manage EC2 instances.

Key benefits of ECS with Fargate:

- **Serverless**: No EC2 instances to provision, patch, or scale
- **Pay-per-use**: Charged only for vCPU and memory used by running containers
- **Auto-scaling**: Containers scale automatically based on demand
- **Integration**: Native integration with ALB, CloudWatch, IAM, VPC, and other AWS services
- **Security**: Each task runs in its own isolated environment with its own ENI

For H-Smart, ECS Fargate enables:

- Deploying containerized applications without server management overhead
- Scaling individual services independently based on traffic patterns
- Running microservices architecture with different container images for each service
- Zero-downtime deployments by gradually replacing tasks with new versions

## Implementation Steps

### Step 1: Review Lab05 from AWS Foundation Video Series

Before hands-on practice, I watched lab05 from the AWS Foundation video series covering container orchestration fundamentals:

**Key concepts learned from lab05:**
- Container orchestration manages container lifecycle: scheduling, placement, scaling, health monitoring
- ECS task definitions are blueprints specifying container configuration (image, CPU, memory, ports)
- ECS services maintain desired count of tasks and integrate with load balancers
- Fargate removes EC2 instance management, abstracting infrastructure layer
- ECS cluster is a logical grouping of tasks and services

The video emphasized that Fargate is ideal for teams focusing on application logic rather than infrastructure management.

### Step 2: Create ECS Cluster

In the ECS console, I created a new cluster:

```text
Cluster name: H-Smart-Cluster
Infrastructure: AWS Fargate (serverless)
```

For Fargate clusters, no EC2 instances are provisioned. The cluster is simply a logical namespace for tasks and services.

After creation, the cluster status shows `Active` with 0 running tasks initially.

### Step 3: Create IAM Role for ECS Task Execution

ECS tasks require an execution role that grants permissions to pull images from ECR and write logs to CloudWatch.

In the IAM console, I created a role:

```text
Trusted entity: Elastic Container Service Task
Role name:      H-Smart-ECS-Task-Execution-Role
Attach policy:  AmazonECSTaskExecutionRolePolicy (AWS managed policy)
```

The `AmazonECSTaskExecutionRolePolicy` includes these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### Step 4: Create Task Definition

A task definition is a JSON blueprint that describes one or more containers that form an application.

In the ECS console, I created a new task definition:

**Infrastructure:**
```text
Launch type:      AWS Fargate
Operating system: Linux
Task CPU:         0.25 vCPU (256 CPU units)
Task memory:      0.5 GB (512 MB)
Task role:        None (not needed for this simple app)
Task execution role: H-Smart-ECS-Task-Execution-Role
```

**Container definition:**
```text
Container name:  hsmart-app
Image URI:       123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/hsmart-app:1.0.0
Port mappings:   Container port 3000, Protocol TCP, App protocol HTTP
```

**Logging:**
```text
Log driver:      awslogs
Log group:       /ecs/hsmart-app (created automatically)
Region:          ap-southeast-2
Stream prefix:   ecs
```

**Health check:**
```text
Command:    CMD-SHELL, node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
Interval:   30 seconds
Timeout:    5 seconds
Start period: 60 seconds
Retries:    3
```

After creation, the task definition is assigned a revision number: `hsmart-app:1`.

### Step 5: Create Application Load Balancer for ECS Service

I created an ALB to distribute traffic across ECS tasks:

```text
Name:            H-Smart-ECS-ALB
Scheme:          Internet-facing
IP address type: IPv4
VPC:             H-smart-VPC
Subnets:         Select public subnets in ap-southeast-2a and ap-southeast-2b
Security group:  Allow HTTP (80) from 0.0.0.0/0
```

**Target group:**
```text
Target type:     IP (required for Fargate)
Name:            H-Smart-ECS-TG
Protocol:        HTTP
Port:            3000
VPC:             H-smart-VPC
Health check path: /health
```

**Important:** For Fargate, target type must be `IP` (not `instance`) because Fargate tasks use ENIs with dynamic IP addresses.

### Step 6: Create ECS Service

An ECS service maintains a desired number of tasks and integrates with load balancers for traffic distribution.

In the ECS console, I created a new service:

**Service configuration:**
```text
Launch type:     Fargate
Service name:    hsmart-service
Task definition: hsmart-app:1
Desired tasks:   2 (run 2 replicas for high availability)
```

**Networking:**
```text
VPC:             H-smart-VPC
Subnets:         Select private subnets in ap-southeast-2a and ap-southeast-2b
Security group:  Allow TCP 3000 from ALB security group
Public IP:       Disabled (tasks in private subnets don't need public IPs)
```

**Load balancing:**
```text
Load balancer type: Application Load Balancer
Load balancer:      H-Smart-ECS-ALB
Target group:       H-Smart-ECS-TG
Health check grace period: 60 seconds
```

**Auto Scaling (optional):**
```text
Minimum tasks:     1
Desired tasks:     2
Maximum tasks:     4
Target tracking scaling policy:
  - Metric: ECSServiceAverageCPUUtilization
  - Target value: 70%
```

After creation, ECS begins launching tasks. The service status shows:

```text
Status:      Active
Running count: 0 → 1 → 2 (progresses over 2-3 minutes)
Desired count: 2
```

### Step 7: Verify Task Deployment

In the ECS console, I opened the service and viewed the Tasks tab.

Each task shows:

```text
Task ID:       abc123def456
Status:        Running
Task definition: hsmart-app:1
Platform version: LATEST
Launch type:   Fargate
Availability Zone: ap-southeast-2a
Private IP:    10.0.1.25
Health status: Healthy
```

I clicked on one task to view detailed metrics and logs.

### Step 8: Test Application Through ALB

I retrieved the ALB DNS name from the EC2 Load Balancers console:

```text
H-Smart-ECS-ALB-1234567890.ap-southeast-2.elb.amazonaws.com
```

Test the application:

```bash
curl http://H-Smart-ECS-ALB-1234567890.ap-southeast-2.elb.amazonaws.com
```

Expected response:

```json
{
  "message": "Hello from H-Smart containerized application!",
  "version": "1.0.0",
  "timestamp": "2026-05-12T14:30:00.000Z",
  "environment": "production"
}
```

Multiple requests show different task IPs, confirming load balancing across both tasks.

### Step 9: Review CloudWatch Logs

ECS automatically streams container logs to CloudWatch Logs.

In CloudWatch Logs, I opened the log group `/ecs/hsmart-app`.

Each task has its own log stream:

```text
ecs/hsmart-app/abc123def456
ecs/hsmart-app/def456ghi789
```

Log entries show application startup and request logs:

```text
H-Smart app listening on port 3000
```

### Step 10: Test Auto-Scaling

To verify auto-scaling works, I generated CPU load by making many concurrent requests:

```bash
# Install Apache Bench for load testing
apt-get install apache2-utils

# Generate load: 1000 requests, 100 concurrent
ab -n 1000 -c 100 http://H-Smart-ECS-ALB-1234567890.ap-southeast-2.elb.amazonaws.com/
```

Within 5 minutes:
- CloudWatch metrics show ECS service CPU exceeding 70%
- Auto Scaling alarm triggers
- ECS launches a 3rd task
- Once load decreases, the service scales back to 2 tasks

## What I Learned

- ECS is AWS's container orchestration service for managing Docker containers at scale.
- Fargate is a serverless compute engine that removes the need to provision EC2 instances.
- Task definitions define container configuration: image, CPU, memory, ports, environment variables.
- ECS services maintain desired task count and integrate with load balancers.
- Fargate tasks use dynamic IP addresses, requiring ALB target type `IP` instead of `instance`.
- ECS task execution role grants permissions to pull ECR images and write CloudWatch logs.
- Health checks ensure only healthy tasks receive traffic from the load balancer.
- Auto Scaling can scale ECS services based on metrics like CPU utilization or request count.
- CloudWatch Logs automatically capture container stdout/stderr for troubleshooting.

## Evidence and Verification

### Verification Checklist

- Confirm that lab05 from AWS Foundation video series is reviewed with notes on key concepts.
- Confirm that an ECS cluster `H-Smart-Cluster` is created with Fargate infrastructure.
- Confirm that an IAM task execution role is created with `AmazonECSTaskExecutionRolePolicy`.
- Confirm that a task definition `hsmart-app:1` is created with 0.25 vCPU and 0.5 GB memory.
- Confirm that the task definition references the ECR image URI from Day 1.
- Confirm that an ALB is created with target type `IP`.
- Confirm that an ECS service `hsmart-service` is created with desired count 2.
- Confirm that 2 tasks reach `Running` status and pass health checks.
- Confirm that the ALB DNS name returns the application response.
- Confirm that CloudWatch Logs show container output from both tasks.
- Confirm that auto-scaling policy scales tasks based on CPU utilization.

## Challenges and Troubleshooting

- Challenge 1: Tasks failed to start with "CannotPullContainerError".
  Resolution: I verified that the task execution role had `ecr:GetAuthorizationToken` and `ecr:BatchGetImage` permissions. I also confirmed the ECR image URI in the task definition was correct and the image existed in ECR.

- Challenge 2: Tasks started but failed health checks immediately.
  Resolution: I checked the health check grace period (60 seconds) was sufficient for the container to initialize. I also verified the health check path `/health` was correct and the security group allowed traffic from the ALB.

- Challenge 3: ALB returned 503 Service Unavailable errors.
  Resolution: I checked the target group health status and found all targets were unhealthy. I reviewed the container logs in CloudWatch and found the application was listening on `127.0.0.1` instead of `0.0.0.0`, preventing external connections. I updated `app.js` to bind to `0.0.0.0`.

- Challenge 4: Tasks could not pull the ECR image due to "no basic auth credentials".
  Resolution: The task execution role was missing or incorrectly configured. I ensured the role had the `AmazonECSTaskExecutionRolePolicy` attached and was selected in the task definition.

## Application to H-Smart

ECS Fargate is H-Smart's recommended container deployment platform for production:

1. **Serverless simplicity**: H-Smart can deploy containerized services without managing EC2 instances, security patches, or cluster scaling.

2. **Cost efficiency**: Pay only for the vCPU and memory used by running tasks, with no charges for idle infrastructure.

3. **High availability**: Running multiple tasks across availability zones ensures H-Smart remains available during AZ failures or deployments.

4. **Independent scaling**: Different microservices (API backend, frontend server, worker jobs) can scale independently based on their specific load patterns.

5. **Blue-green deployments**: ECS supports rolling deployments and blue-green patterns, enabling zero-downtime updates by gradually replacing old tasks with new versions.

The recommended next step is to implement a CI/CD pipeline (Week 4 Day 5) that automatically builds, pushes to ECR, and deploys to ECS Fargate whenever code is committed to GitHub.

## Reference Materials

- [What is Amazon ECS?](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
- [AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [AWS Foundation Video Series - Lab05](https://www.youtube.com/watch?v=AQlsd0nWdZk&list=PLahN4TLWtox2a3vElknwzU_urND8hLn1i)
