---
title: "Day 4 - VPC Endpoints for Private AWS Service Access"
date: 2026-04-30
weight: 4
summary: "Practiced VPC Endpoints by creating Gateway Endpoint for S3 and Interface Endpoint for Systems Manager to enable private AWS service access without internet gateway."
chapter: false
---

## Why I Did This

This task practiced VPC Endpoints as a method for accessing AWS services privately without routing traffic through an internet gateway or NAT gateway.

By default, when an EC2 instance in a private subnet needs to access AWS services like S3 or Systems Manager, it requires a NAT gateway or internet gateway for public internet routing. This adds cost, latency, and exposes traffic to the public internet route.

VPC Endpoints solve this by creating private network interfaces or routes that connect directly to AWS services within the AWS network backbone.

For H-Smart, this pattern is important for security-sensitive workloads and cost optimization, especially when backend services need to interact with S3 for storage or Systems Manager for operational access without leaving the AWS private network.

## Implementation Steps

### Step 1: Create Gateway Endpoint for S3

Gateway Endpoints are used for S3 and DynamoDB. They are free and work by adding routes to VPC route tables.

In the VPC console, I opened Endpoints and created a new endpoint with these settings:

```text
Service category:  AWS services
Service name:      com.amazonaws.ap-southeast-2.s3 (Gateway type)
VPC:               H-smart-VPC
Route tables:      Select the private subnet route table
```

After creating the Gateway Endpoint, I verified that a new route appeared automatically in the selected route table:

```text
Destination: pl-6ca54005 (S3 prefix list)
Target:      vpce-xxxxxxxx (Gateway Endpoint ID)
```

This route tells resources in the private subnet to send S3 traffic through the Gateway Endpoint instead of routing through an internet gateway.

### Step 2: Verify S3 Access from Private Subnet

To test the Gateway Endpoint, the expected verification is to launch an EC2 instance in the private subnet and confirm that it can access S3 without a NAT gateway or internet gateway.

From the EC2 instance, I could run:

```bash
aws s3 ls
```

If the Gateway Endpoint is configured correctly, this command should succeed even though the instance is in a private subnet with no NAT or internet gateway attached.

The traffic flows privately through the VPC Gateway Endpoint instead of the public internet.

### Step 3: Create Interface Endpoint for Systems Manager

Interface Endpoints are used for most AWS services. They create Elastic Network Interfaces (ENIs) in selected subnets and use private DNS resolution to redirect service API calls.

For Systems Manager Session Manager to work in a fully private subnet, three Interface Endpoints are required:

- `com.amazonaws.ap-southeast-2.ssm` (Systems Manager)
- `com.amazonaws.ap-southeast-2.ssmmessages` (Session Manager messages)
- `com.amazonaws.ap-southeast-2.ec2messages` (EC2 messages)

For each endpoint, I used these settings:

```text
Service category:  AWS services
Service name:      com.amazonaws.ap-southeast-2.ssm (Interface type)
VPC:               H-smart-VPC
Subnets:           Select the private subnet
Security groups:   Create or select a security group that allows HTTPS (port 443) inbound from the VPC CIDR
Enable DNS name:   Enabled (critical for private DNS resolution)
```

I repeated this process for the other two endpoints: `ssmmessages` and `ec2messages`.

### Step 4: Configure Security Group for Interface Endpoints

Interface Endpoints require security group rules to allow HTTPS traffic from resources in the VPC.

The security group attached to the Interface Endpoints needs this inbound rule:

```text
Type:     HTTPS
Protocol: TCP
Port:     443
Source:   10.0.0.0/16 (H-smart-VPC CIDR range)
```

This rule allows EC2 instances in the VPC to connect to the Interface Endpoint ENIs over port 443.

### Step 5: Test Session Manager Access from Private Subnet

After creating all three Interface Endpoints and configuring the security group, I verified that Session Manager could connect to an EC2 instance in the private subnet.

The test EC2 instance must:

- Be launched in the private subnet
- Have the IAM role with `AmazonSSMManagedInstanceCore` policy attached
- Have no internet gateway or NAT gateway route in its subnet route table

From the AWS Console, I opened Systems Manager → Session Manager and selected the private instance. If the Interface Endpoints are configured correctly, the session should connect successfully even though the instance has no public route.

This confirms that Systems Manager API traffic is flowing through the private Interface Endpoints instead of the public internet.

## What I Learned

- VPC Endpoints enable private access to AWS services without internet gateways or NAT gateways.
- There are two types: Gateway Endpoints (for S3 and DynamoDB, free) and Interface Endpoints (for most AWS services, charged per hour per AZ).
- Gateway Endpoints work by adding routes to VPC route tables automatically.
- Interface Endpoints work by creating ENIs in subnets and using private DNS resolution to redirect API calls.
- Private DNS must be enabled on Interface Endpoints so that standard AWS service hostnames resolve to the private endpoint IPs.
- Security groups on Interface Endpoints must allow HTTPS (port 443) inbound from resources that need to use them.
- For Session Manager to work in a fully private subnet, three Interface Endpoints are required: `ssm`, `ssmmessages`, and `ec2messages`.

## Evidence and Verification

### Verification Checklist

- Confirm that the S3 Gateway Endpoint is created and associated with the private subnet route table.
- Confirm that a route for the S3 prefix list appears in the route table pointing to the Gateway Endpoint.
- Confirm that an EC2 instance in the private subnet can run `aws s3 ls` without NAT or internet gateway.
- Confirm that three Interface Endpoints are created: `ssm`, `ssmmessages`, and `ec2messages`.
- Confirm that private DNS is enabled on all Interface Endpoints.
- Confirm that the security group attached to the Interface Endpoints allows HTTPS (port 443) from the VPC CIDR.
- Confirm that Session Manager can connect to an EC2 instance in the private subnet without NAT or internet gateway.

## Challenges and Troubleshooting

- Challenge 1: Interface Endpoints did not appear to be working.
  Resolution: I verified that private DNS was enabled on the Interface Endpoints. Without private DNS, AWS service API calls still route to the public endpoint instead of the private Interface Endpoint.

- Challenge 2: Session Manager connection failed even with Interface Endpoints created.
  Resolution: I confirmed that all three required endpoints (`ssm`, `ssmmessages`, `ec2messages`) were created. Missing any one of these endpoints breaks Session Manager functionality.

- Challenge 3: Interface Endpoint security group was blocking connections.
  Resolution: I updated the security group to allow HTTPS (port 443) inbound from the full VPC CIDR range `10.0.0.0/16`.

## Application to H-Smart

VPC Endpoints are highly relevant to H-Smart for several operational and security reasons:

1. Backend services in private subnets can access S3 for data storage and retrieval without routing through NAT gateways, reducing cost and latency.
2. Operational access to private EC2 instances via Session Manager can work without exposing any public routes or bastion hosts.
3. Future integration with other AWS services (Secrets Manager, CloudWatch Logs, ECR) can use Interface Endpoints for secure, private connectivity.

The cost-benefit tradeoff is important: Gateway Endpoints for S3 are free, but Interface Endpoints are charged hourly per Availability Zone. For H-Smart, the use case should justify the cost, such as high-security workloads or heavy S3 traffic that would otherwise require expensive NAT gateway data transfer.

## Reference Materials

- [VPC endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html)
- [Gateway endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-gateway.html)
- [Interface endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-interface.html)
