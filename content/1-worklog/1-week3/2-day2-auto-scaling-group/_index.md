---
title: "Day 2 - Auto Scaling Group for Automatic Capacity Management"
date: 2026-05-05
weight: 2
summary: "Practiced Auto Scaling Group by creating launch templates with user data, integrating with Application Load Balancer, and configuring dynamic scaling policies based on CPU utilization."
chapter: false
---

## Why I Did This

This task practiced Auto Scaling Groups (ASG) as an automated capacity management solution that works alongside Application Load Balancers to maintain application availability and optimize costs.

An Auto Scaling Group automatically adjusts the number of EC2 instances based on demand or health status. It ensures that the application always has enough capacity to handle current load while minimizing costs by terminating instances when demand decreases.

Key benefits of Auto Scaling:

- **Automatic capacity adjustment**: Scale out (add instances) during traffic spikes, scale in (remove instances) during low traffic periods.
- **Fault tolerance**: Automatically replace unhealthy instances to maintain desired capacity.
- **Cost optimization**: Run only the instances you need, paying only for actual usage.
- **Integration with load balancers**: New instances are automatically registered with target groups when launched.

For H-Smart, Auto Scaling Groups enable:

- Handling traffic spikes during peak business hours or viral campaigns without manual intervention
- Maintaining application availability even when instances fail or become unhealthy
- Reducing infrastructure costs by scaling down during off-peak hours
- Supporting blue-green deployments and rolling updates with zero downtime

## Implementation Steps

### Step 1: Create Launch Template

A Launch Template defines the configuration for EC2 instances that the Auto Scaling Group will launch.

In the EC2 console, I opened Launch Templates and created a new template:

```text
Template name: H-Smart-Web-Template
Description:   Launch template for H-Smart web servers with Apache
AMI:           Amazon Linux 2023 (latest)
Instance type: t2.micro
Key pair:      (optional, for SSH access)
```

**Network Settings:**
```text
Security groups: H-Smart-Web-SG (allows HTTP from ALB security group, SSH from management IP)
```

**Advanced Details - User Data:**

I added a user data script that runs on instance launch to install and configure the web server:

```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd

# Display instance metadata for verification
EC2_INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
EC2_AVAIL_ZONE=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
echo "<h1>Hello from $EC2_INSTANCE_ID in $EC2_AVAIL_ZONE</h1>" > /var/www/html/index.html
echo "<p>This instance was launched by Auto Scaling Group</p>" >> /var/www/html/index.html
```

This user data script ensures that every instance launched by the Auto Scaling Group automatically becomes a functional web server without manual configuration.

### Step 2: Create Auto Scaling Group

In the EC2 console, I opened Auto Scaling Groups and created a new ASG:

```text
Auto Scaling group name: H-Smart-Web-ASG
Launch template:         H-Smart-Web-Template (latest version)
```

**Network Configuration:**
```text
VPC:     H-smart-VPC
Subnets: Select both H-smart-public-subnet-a and H-smart-public-subnet-b
```

By selecting subnets in multiple Availability Zones, the Auto Scaling Group distributes instances across AZs for high availability.

**Load Balancer Integration:**
```text
Attach to an existing load balancer: Yes
Choose from your load balancer target groups: H-Smart-Web-TG (the target group created in Day 1)
```

This integration ensures that new instances launched by the ASG are automatically registered with the ALB target group and begin receiving traffic once they pass health checks.

**Health Check Settings:**
```text
Health check type: ELB (Elastic Load Balancer)
Health check grace period: 300 seconds
```

ELB health check type means the ASG uses the ALB's target health checks to determine instance health. If the ALB marks an instance as unhealthy, the ASG will terminate and replace it.

The grace period gives new instances time to initialize and pass health checks before the ASG evaluates their health status.

### Step 3: Configure Group Size and Capacity

I configured the initial capacity and scaling limits:

```text
Desired capacity: 2
Minimum capacity: 1
Maximum capacity: 4
```

These settings mean:

- The ASG will maintain 2 running instances under normal conditions
- The ASG will never scale below 1 instance (ensures at least one instance is always running)
- The ASG will never scale above 4 instances (protects against runaway scaling costs)

After creating the ASG, I verified that 2 instances launched automatically and registered with the ALB target group.

### Step 4: Create Target Tracking Scaling Policy

Target Tracking Scaling is the simplest way to configure automatic scaling based on a target metric value.

In the Auto Scaling Group settings, I opened the Automatic scaling tab and created a Target Tracking Scaling Policy:

```text
Policy name:        H-Smart-CPU-Target-Tracking
Metric type:        Average CPU utilization
Target value:       50%
Instance warmup:    300 seconds
```

This policy tells the ASG to:

- Add instances when average CPU utilization across the fleet exceeds 50% for a sustained period
- Remove instances when average CPU utilization drops below 50% for a sustained period
- Wait 300 seconds after launching a new instance before including its metrics (warmup period)

The ASG automatically creates two CloudWatch alarms (scale-out and scale-in) to trigger this policy.

### Step 5: Test Scaling Behavior with Load

To verify the scaling policy, I generated CPU load on the existing instances to trigger scale-out.

I SSH-ed into one of the running instances and ran a CPU stress test:

```bash
# Install stress tool
sudo yum install -y stress

# Generate CPU load for 5 minutes
stress --cpu 2 --timeout 300
```

Within 3-5 minutes, I observed the following:

1. CloudWatch metrics showed average CPU utilization rising above 50%
2. The scale-out alarm triggered
3. The Auto Scaling Group launched a new instance to bring CPU utilization back to the target
4. The new instance was automatically registered with the ALB target group
5. Once health checks passed, the new instance began receiving traffic

After the stress test ended and CPU utilization dropped below 50%, the ASG waited for the scale-in cooldown period, then terminated the extra instance to return to the desired capacity.

### Step 6: Test Automatic Instance Replacement

To verify the ASG's fault tolerance capability, I manually terminated one running instance:

```text
Instance ID: i-xxxxxxxxx
Action: Terminate
```

Within 1-2 minutes, the Auto Scaling Group detected that the instance count was below the desired capacity and automatically launched a replacement instance.

The new instance:
- Used the same launch template configuration
- Ran the user data script to become a web server
- Registered with the ALB target group
- Passed health checks and began receiving traffic

This demonstrates the ASG's ability to self-heal when instances fail.

## What I Learned

- Auto Scaling Groups maintain a desired number of instances and automatically replace unhealthy instances.
- Launch Templates define the configuration blueprint for instances launched by the ASG.
- User data scripts enable automated instance initialization without manual configuration.
- Integration with ALB target groups is automatic: new instances are registered, terminated instances are deregistered.
- Target Tracking Scaling Policies simplify automatic scaling by specifying a target metric value (e.g., 50% CPU).
- Health check grace period prevents premature termination of new instances that are still initializing.
- ELB health check type delegates health determination to the Application Load Balancer.
- Auto Scaling provides both capacity optimization (scaling based on demand) and fault tolerance (replacing failed instances).

## Evidence and Verification

### Verification Checklist

- Confirm that a launch template is created with Amazon Linux 2023, t2.micro instance type, and user data script.
- Confirm that the user data script installs Apache web server and displays instance ID and availability zone.
- Confirm that an Auto Scaling Group is created with desired capacity 2, min 1, max 4.
- Confirm that the ASG is configured to use subnets in both ap-southeast-2a and ap-southeast-2b.
- Confirm that the ASG is attached to the ALB target group from Day 1.
- Confirm that 2 instances launch automatically and register with the target group.
- Confirm that both instances pass health checks and are marked as `healthy`.
- Confirm that a Target Tracking Scaling Policy is created with 50% CPU utilization target.
- Confirm that generating CPU load triggers scale-out and a new instance is launched automatically.
- Confirm that terminating an instance manually triggers automatic replacement by the ASG.

## Challenges and Troubleshooting

- Challenge 1: New instances launched by the ASG were not receiving traffic from the ALB.
  Resolution: I checked the target group and found the instances in `initial` status. I waited for the health check grace period (300 seconds) to elapse, and the instances transitioned to `healthy` status once they passed health checks.

- Challenge 2: The ASG terminated new instances immediately after launch.
  Resolution: The health check grace period was set too low. I increased it to 300 seconds to give instances time to initialize, run the user data script, and start the web server before the ASG evaluates health.

- Challenge 3: Scaling policy did not trigger even when CPU exceeded 50%.
  Resolution: CloudWatch alarms have a minimum evaluation period. The CPU must exceed the target for multiple consecutive data points (typically 2-3 periods) before the alarm triggers. I waited 5 minutes and scaling occurred as expected.

- Challenge 4: User data script did not execute correctly on new instances.
  Resolution: I reviewed the instance system log (Actions → Monitor and troubleshoot → Get system log) and found a syntax error in the user data script. I corrected the error and created a new version of the launch template.

## Application to H-Smart

Auto Scaling Groups are essential for H-Smart's production architecture:

1. **Cost efficiency**: H-Smart can scale down to 1 instance during low-traffic hours (e.g., midnight to 6 AM) and scale up to 4+ instances during peak business hours, paying only for actual usage.

2. **Reliability**: If an instance fails due to hardware issues, software crashes, or deployment errors, the ASG automatically replaces it without human intervention.

3. **Performance**: During viral campaigns or product launches, the ASG scales out automatically to handle traffic spikes, preventing slowdowns or outages.

4. **Deployment automation**: Blue-green or rolling deployments can be implemented by creating a new launch template version with updated application code, then gradually replacing instances in the ASG.

5. **Multi-AZ resilience**: By distributing instances across multiple availability zones, H-Smart can tolerate an entire AZ failure without service disruption.

The recommended next step is to implement scheduled scaling to pre-emptively scale out before known traffic peaks (e.g., 8 AM business day start) and integrate with CloudWatch alarms for more sophisticated scaling triggers beyond CPU utilization.

## Reference Materials

- [What is Amazon EC2 Auto Scaling?](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)
- [Launch templates](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html)
- [Dynamic scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html)
