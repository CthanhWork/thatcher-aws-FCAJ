---
title: "VPC Foundation Setup"
date: 2026-04-24
weight: 4
summary: "Built a basic H-Smart VPC with public and private subnets, an Internet Gateway, and a dedicated public route table."
chapter: false
---

## Why I Did This

This task established the first networking foundation for H-Smart. After finishing the Module 2 theory videos, I needed to move from concepts into actual console work so I could understand how VPC, subnets, routing, and internet access are connected in practice.

I treated this lab as the starting point for a future H-Smart deployment model. A separate VPC with public and private subnets is a cleaner base than placing every workload in a flat network.

## Implementation Steps

### Step 1: Access the Employee Account and Confirm the Working Region

I started from the AWS Console under the employee user and confirmed that the working Region was Asia Pacific Sydney before opening the networking services.

![AWS Console home under the employee user in Asia Pacific Sydney](../../../images/1-worklog/week1/vpc/prepare-employee-account.png)

### Step 2: Search for the VPC Service

From the global search bar, I searched for VPC and opened the first result, VPC - Isolated Cloud Resources.

![AWS Console search result showing the VPC service](../../../images/1-worklog/week1/vpc/search-vpc-service.png)

### Step 3: Create the Main VPC

I created the main network with the name H-smart-VPC. The resulting VPC used the IPv4 range 10.0.0.0/16 and no IPv6 block, which gives enough address space for later subnet design.

![VPC creation form for H-smart-VPC](../../../images/1-worklog/week1/vpc/create-vpc-form.png)

![Success page showing that H-smart-VPC was created](../../../images/1-worklog/week1/vpc/vpc-created-successfully.png)

### Step 4: Create the Public and Private Subnets

Inside H-smart-VPC, I created two subnets to separate internet-facing and internal traffic:

- H-smart-public-sn with IPv4 CIDR 10.0.1.0/24
- H-smart-private-sn with IPv4 CIDR 10.0.2.0/24

The screenshot below captures the public subnet configuration, while the later route table association view confirms that both the public and private subnets were created inside the same VPC.

![Public subnet creation form for H-smart-public-sn](../../../images/1-worklog/week1/vpc/create-public-subnet.png)

### Step 5: Enable Automatic Public IPv4 Assignment for the Public Subnet

To make the public subnet usable for internet-facing instances later, I enabled automatic public IPv4 assignment on H-smart-public-sn.

![Public subnet setting with auto-assign public IPv4 enabled](../../../images/1-worklog/week1/vpc/enable-auto-assign-public-ipv4.png)

### Step 6: Create and Attach the Internet Gateway

I created an Internet Gateway named H-smart-IGW and attached it to H-smart-VPC. This step is required before a public route table can send outbound traffic to the internet.

![Internet Gateway creation form for H-smart-IGW](../../../images/1-worklog/week1/vpc/create-internet-gateway.png)

![Attach Internet Gateway to H-smart-VPC](../../../images/1-worklog/week1/vpc/attach-igw-to-vpc.png)

### Step 7: Review the Existing Route Table State and Create a Dedicated Public Route Table

Before adding internet routes, I reviewed the current route table situation in the VPC dashboard. I saw that the current main route table was still unnamed, so instead of editing that ambiguous default table directly, I created a new dedicated route table named H-smart-public-rt.

![Route tables list before finishing the public routing design](../../../images/1-worklog/week1/vpc/review-route-tables-list.png)

![Route table creation form for H-smart-public-rt](../../../images/1-worklog/week1/vpc/create-public-route-table.png)

### Step 8: Add the Default Route to the Internet Gateway

Inside H-smart-public-rt, I added the default route 0.0.0.0/0 and pointed it to H-smart-IGW. This is the route that allows workloads in the public subnet to reach the internet.

![Route table editor with Internet Gateway selected as the target](../../../images/1-worklog/week1/vpc/add-route-to-igw.png)

![Route table showing the configured default route to H-smart-IGW](../../../images/1-worklog/week1/vpc/route-to-igw-configured.png)

### Step 9: Associate the Public Subnet with the Public Route Table

Finally, I associated H-smart-public-sn with H-smart-public-rt so that only the public subnet follows the internet route. The association view also confirms that H-smart-private-sn exists separately and was not selected for the public routing path.

![Subnet association screen showing the public subnet selected for the route table](../../../images/1-worklog/week1/vpc/associate-public-subnet-to-route-table.png)

## What I Learned

- A VPC becomes useful only after the surrounding components are connected correctly. Subnets, Internet Gateway, and route tables must work together.
- The difference between public and private subnets is not only naming. It depends on routing behavior and whether the subnet can reach the internet.
- Creating a dedicated public route table is cleaner than overloading the unnamed default route table when the goal is to learn the architecture clearly.
- Public subnet usability also depends on enabling automatic public IPv4 assignment, otherwise later EC2 instances may not behave as expected.

## Evidence and Verification

### Verification Checklist

- Confirm that H-smart-VPC exists with IPv4 CIDR range 10.0.0.0/16.
- Confirm that both H-smart-public-sn and H-smart-private-sn exist inside the VPC.
- Confirm that H-smart-IGW is attached to H-smart-VPC.
- Confirm that H-smart-public-rt has a default route 0.0.0.0/0 pointing to the Internet Gateway.
- Confirm that H-smart-public-sn is associated with H-smart-public-rt.
- Confirm that automatic public IPv4 assignment is enabled for the public subnet.

## Challenges and Troubleshooting

- Challenge 1: The route table area was initially confusing because the VPC already had a default main route table with no meaningful name.
  Resolution: I created a new dedicated route table named H-smart-public-rt so the public routing design stayed explicit and easier to explain.

- Challenge 2: While configuring the default route, I initially selected the wrong target type and AWS showed a validation problem because the target was set to Network Interface instead of Internet Gateway.
  Resolution: I corrected the target type to Internet Gateway and then selected H-smart-IGW as the proper destination for outbound internet traffic.

![Wrong route target type selected during route editing](../../../images/1-worklog/week1/vpc/wrong-route-target-selection.png)

![Validation error shown before correcting the route target](../../../images/1-worklog/week1/vpc/route-target-validation-error.png)

## Application to H-Smart

This VPC layout is directly relevant to H-Smart because the project should not place every component in a single exposed network. A practical next step would be to keep internet-facing resources in the public subnet while placing backend services and databases in the private subnet. That model would make the H-Smart architecture easier to secure and scale later.

## Reference Materials

- [Amazon VPC and AWS Site-to-Site VPN Workshop](https://000003.awsstudygroup.com/)
- [VPC Components Deep Dive](https://000092.awsstudygroup.com/3-vpcs/)
