---
title: "Day 1 - Application Load Balancer for High Availability"
date: 2026-05-04
weight: 1
summary: "Practiced Application Load Balancer by creating target groups with health checks and distributing HTTP/HTTPS traffic across multiple EC2 instances in different availability zones."
chapter: false
---

## Why I Did This

This task practiced Application Load Balancer (ALB) as a critical component for high availability and horizontal scalability in AWS architectures.

An Application Load Balancer operates at Layer 7 (HTTP/HTTPS) and distributes incoming application traffic across multiple targets (EC2 instances, containers, IP addresses) in multiple Availability Zones. This improves application fault tolerance and availability.

Key benefits of ALB:

- **High availability**: If one target becomes unhealthy, ALB automatically routes traffic to healthy targets only.
- **Horizontal scaling**: New instances can be added to the target group without changing client endpoints.
- **SSL/TLS termination**: ALB can handle HTTPS encryption/decryption, reducing compute load on backend instances.
- **Advanced routing**: ALB supports path-based and host-based routing for microservices architectures.

For H-Smart, Application Load Balancer is essential for:

- Distributing user traffic across multiple web servers for performance and reliability
- Automatically removing unhealthy instances from the load balancing pool
- Enabling zero-downtime deployments by gradually shifting traffic between old and new application versions
- Supporting future microservices architecture with path-based routing (e.g., `/api/*`, `/admin/*`)

## Implementation Steps

### Step 1: Prepare EC2 Instances in Multiple Availability Zones

To demonstrate ALB's high availability capability, I launched two EC2 instances in different Availability Zones within the same VPC.

**Instance 1:**
```text
AMI:          Amazon Linux 2023
Instance type: t2.micro
Subnet:       H-smart-public-subnet-a (ap-southeast-2a)
Security group: Allow HTTP (80) and SSH (22)
```

**Instance 2:**
```text
AMI:          Amazon Linux 2023
Instance type: t2.micro
Subnet:       H-smart-public-subnet-b (ap-southeast-2b)
Security group: Allow HTTP (80) and SSH (22)
```

Both instances were launched with a simple user data script to install and start a web server:

```bash
#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
EC2_AVAIL_ZONE=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
echo "<h1>Hello from $(hostname -f) in $EC2_AVAIL_ZONE</h1>" > /var/www/html/index.html
```

This script displays the instance hostname and availability zone, making it easy to verify that ALB is distributing traffic across both instances.

### Step 2: Create Target Group with Health Check Configuration

In the EC2 console, I opened Load Balancers → Target Groups and created a new target group:

```text
Target type:     Instances
Target group name: H-Smart-Web-TG
Protocol:        HTTP
Port:            80
VPC:             H-smart-VPC
```

**Health Check Settings:**
```text
Protocol:        HTTP
Path:            /
Interval:        30 seconds
Timeout:         5 seconds
Healthy threshold:   2
Unhealthy threshold: 2
```

These health check settings mean:

- ALB sends an HTTP GET request to `/` every 30 seconds
- If the response is not received within 5 seconds, the check fails
- An instance must pass 2 consecutive checks to be considered healthy
- An instance must fail 2 consecutive checks to be marked unhealthy

After creating the target group, I registered both EC2 instances as targets.

### Step 3: Create Application Load Balancer

In the EC2 console, I opened Load Balancers and created a new Application Load Balancer:

```text
Name:            H-Smart-ALB
Scheme:          Internet-facing
IP address type: IPv4
VPC:             H-smart-VPC
Availability Zones: Select both ap-southeast-2a and ap-southeast-2b with their public subnets
```

**Security Group Configuration:**

I created a security group for the ALB:

```text
Inbound rules:
- HTTP (80) from 0.0.0.0/0
- HTTPS (443) from 0.0.0.0/0
```

This allows public internet traffic to reach the ALB on standard web ports.

**Listener Configuration:**

I configured a listener to forward HTTP traffic to the target group:

```text
Protocol: HTTP
Port:     80
Default action: Forward to H-Smart-Web-TG
```

This listener tells the ALB to route all incoming HTTP traffic on port 80 to the target group containing the two EC2 instances.

### Step 4: Verify Health Checks and Target Status

After creating the ALB, I waited for the ALB state to change from `provisioning` to `active`.

Then I opened the target group and checked the Targets tab to verify that both instances were passing health checks:

```text
Target 1 (i-xxxxxxxx): healthy
Target 2 (i-yyyyyyyy): healthy
```

The initial health check can take 30-60 seconds depending on the health check interval and threshold settings.

### Step 5: Test Load Balancing Behavior

Once both targets were healthy, I tested the ALB by accessing its DNS name in a web browser.

The ALB DNS name follows this format:

```text
H-Smart-ALB-1234567890.ap-southeast-2.elb.amazonaws.com
```

When I refreshed the page multiple times, I observed that the response alternated between the two instances, showing different hostnames and availability zones:

```text
Request 1: Hello from ip-10-0-1-25.ap-southeast-2.compute.internal in ap-southeast-2a
Request 2: Hello from ip-10-0-2-30.ap-southeast-2.compute.internal in ap-southeast-2b
Request 3: Hello from ip-10-0-1-25.ap-southeast-2.compute.internal in ap-southeast-2a
```

This confirms that the ALB is distributing traffic across both targets in a round-robin fashion.

### Step 6: Test Automatic Failover

To verify the ALB's automatic failover capability, I simulated an instance failure by stopping the web server on one instance:

```bash
sudo systemctl stop httpd
```

Within 60 seconds (2 failed health checks × 30-second interval), the target status changed to `unhealthy` in the target group.

I then accessed the ALB DNS name again and confirmed that all requests were now being routed only to the remaining healthy instance.

After restarting the web server (`sudo systemctl start httpd`), the instance passed health checks again and resumed receiving traffic from the ALB.

## What I Learned

- Application Load Balancer operates at Layer 7 and supports HTTP/HTTPS traffic distribution.
- ALB requires at least two subnets in different Availability Zones for high availability.
- Target groups define the backend instances that receive traffic from the ALB.
- Health checks are critical for automatic failover: unhealthy targets are removed from the load balancing pool automatically.
- ALB DNS names are used as the single entry point for client connections, abstracting away individual instance IP addresses.
- The default load balancing algorithm is round-robin, but sticky sessions can be enabled for session persistence.
- Security groups must be configured correctly: ALB security group allows inbound internet traffic, and target instance security groups must allow inbound traffic from the ALB security group.

## Evidence and Verification

### Verification Checklist

- Confirm that two EC2 instances are running in different Availability Zones (ap-southeast-2a and ap-southeast-2b).
- Confirm that both instances have a web server installed and running, displaying unique content (hostname and AZ).
- Confirm that a target group is created with HTTP health checks on path `/`.
- Confirm that both instances are registered as targets and show `healthy` status.
- Confirm that an Application Load Balancer is created in `internet-facing` scheme with subnets in both AZs.
- Confirm that the ALB has a listener on port 80 forwarding to the target group.
- Confirm that accessing the ALB DNS name returns responses from both instances in round-robin fashion.
- Confirm that stopping the web server on one instance causes it to become `unhealthy` within 60 seconds.
- Confirm that traffic is automatically routed only to healthy instances after failover.

## Challenges and Troubleshooting

- Challenge 1: Targets remained in `unhealthy` status even though the web server was running.
  Resolution: I verified the security group rules on the EC2 instances. The instances must allow inbound HTTP traffic from the ALB security group, not just from `0.0.0.0/0`. I updated the security group to allow HTTP from the ALB security group ID.

- Challenge 2: ALB DNS name was not resolving or returning 503 Service Unavailable errors.
  Resolution: I checked the target group status and found that all targets were unhealthy. I reviewed the health check path and confirmed it was set to `/` (the root path). I also verified that the web server was actually serving content on that path by SSH-ing into the instance and running `curl localhost`.

- Challenge 3: Load balancing appeared to be "sticky" to one instance instead of round-robin.
  Resolution: I disabled sticky sessions (stickiness) on the target group attributes. By default, ALB uses round-robin, but if stickiness is enabled, the same client will be routed to the same target based on a cookie.

## Application to H-Smart

Application Load Balancer is a foundational component for H-Smart's production architecture:

1. **User-facing web tier**: The ALB serves as the single entry point for all user HTTP/HTTPS traffic, distributing load across multiple web server instances.

2. **High availability**: By deploying web servers in multiple Availability Zones behind an ALB, H-Smart can tolerate an entire AZ failure without service disruption.

3. **Auto Scaling integration**: In Week 3 Day 2, the ALB will be integrated with an Auto Scaling Group so that new instances are automatically registered with the target group as they launch.

4. **SSL/TLS termination**: In production, the ALB can be configured with an HTTPS listener and ACM certificate, offloading SSL/TLS processing from backend instances.

5. **Future microservices routing**: As H-Smart evolves to microservices, ALB path-based routing can direct `/api/*` to API servers, `/admin/*` to admin backend, and `/` to the main web frontend.

The next practical step is to integrate this ALB with an Auto Scaling Group so that capacity adjusts automatically based on traffic demand.

## Reference Materials

- [What is an Application Load Balancer?](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html)
- [Target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [Health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)
