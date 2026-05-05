---
title: "Day 3 - Transit Gateway Hub Setup"
date: 2026-04-29
weight: 3
summary: "Practiced AWS Transit Gateway by connecting two Sydney VPCs through a central hub, configuring route tables, and reviewing cleanup to avoid ongoing charges."
chapter: false
---

## Why I Did This

This task practiced Transit Gateway as a hub-based networking model. Unlike direct VPC Peering, where each pair of VPCs needs its own connection, Transit Gateway acts as a central router that multiple VPCs can attach to.

For H-Smart, this pattern is useful when the architecture grows beyond two networks. A central Transit Gateway can connect application VPCs, shared service VPCs, analytics environments, and future branch or VPN connectivity without creating a complicated mesh of point-to-point peering connections.

## Implementation Steps

### Step 1: Prepare Two VPCs in Sydney

I prepared two VPCs in the Sydney Region so they could be connected through a Transit Gateway.

The target VPC layout was:

- VPC 1: H-smart-VPC with CIDR range `10.0.0.0/16`
- VPC 2: H-Smart-VPC-B with CIDR range `172.16.0.0/16`

For VPC 2, I used a non-overlapping CIDR range and created at least one subnet, such as `172.16.1.0/24`, in Availability Zone `ap-southeast-2a`.

This non-overlapping CIDR design is required because Transit Gateway routing depends on clear, unique destination ranges.

### Step 2: Create the Transit Gateway

In the VPC console, I opened Transit Gateways and created a new Transit Gateway.

The Transit Gateway name was:

```text
H-Smart-TGW-Hub
```

I kept the default settings, including ASN and DNS support, because the goal of this lab was to understand the baseline hub setup before introducing advanced routing or segmentation.

After creating the Transit Gateway, I waited until its state became Available.

### Step 3: Create Transit Gateway Attachments

Next, I created Transit Gateway attachments to connect both VPCs to the hub.

I repeated the attachment process twice:

- Attachment 1: H-smart-VPC attached to H-Smart-TGW-Hub
- Attachment 2: H-Smart-VPC-B attached to H-Smart-TGW-Hub

For each attachment, I selected attachment type VPC, chose the target VPC ID, and selected the available subnet for the attachment.

This step is similar to plugging each VPC into the Transit Gateway hub. Without attachments, the Transit Gateway exists but has no connected networks to route between.

### Step 4: Configure VPC Route Tables

After creating the attachments, I updated the VPC route tables. This is the key step that tells resources in one VPC how to reach the other VPC through the Transit Gateway.

In the route table for H-smart-VPC, I added:

```text
Destination: 172.16.0.0/16
Target:      H-Smart-TGW-Hub
```

In the route table for H-Smart-VPC-B, I added the reverse route:

```text
Destination: 10.0.0.0/16
Target:      H-Smart-TGW-Hub
```

With these routes in place, each VPC can send traffic for the other CIDR range to the Transit Gateway.

### Step 5: Test Connectivity and Clean Up

The expected verification method is to launch one small EC2 instance in each VPC and test private connectivity between them, for example by pinging the private IP address across the VPC boundary.

After testing, cleanup is important because Transit Gateway can create ongoing hourly charges. The safe cleanup order is:

1. Delete the Transit Gateway attachments first.
2. Delete the Transit Gateway after the attachments are removed.
3. Remove any temporary route table entries and test EC2 instances.

## What I Learned

- Transit Gateway is a hub-and-spoke networking pattern for connecting multiple VPCs through one central routing service.
- VPC CIDR ranges still must not overlap, otherwise routing becomes ambiguous.
- Creating the Transit Gateway is only the first step. VPC attachments and route table updates are required before traffic can move.
- Route tables must be updated on both sides so request and response traffic have valid paths.
- Cleanup matters because Transit Gateway attachments and the Transit Gateway itself can create ongoing costs.

## Evidence and Verification

### Verification Checklist

- Confirm that H-smart-VPC exists with CIDR range `10.0.0.0/16`.
- Confirm that H-Smart-VPC-B exists with CIDR range `172.16.0.0/16`.
- Confirm that H-Smart-TGW-Hub reaches the Available state.
- Confirm that both VPCs have Transit Gateway attachments.
- Confirm that the route table for H-smart-VPC routes `172.16.0.0/16` to the Transit Gateway.
- Confirm that the route table for H-Smart-VPC-B routes `10.0.0.0/16` to the Transit Gateway.
- Confirm that temporary EC2 connectivity testing is completed or planned.
- Confirm that Transit Gateway resources are deleted after the lab if they are no longer needed.

## Challenges and Troubleshooting

- Challenge 1: Transit Gateway has more moving parts than direct VPC Peering.
  Resolution: I separated the work into hub creation, VPC attachments, VPC route table updates, connectivity testing, and cleanup.

- Challenge 2: Route tables can be confusing because there are VPC route tables and Transit Gateway route tables.
  Resolution: For this baseline lab, I focused on updating the VPC route tables so each VPC could send traffic to the other CIDR through the Transit Gateway.

- Challenge 3: Transit Gateway can continue charging after the lab if resources are left running.
  Resolution: I documented the cleanup order clearly: delete attachments first, then delete the Transit Gateway.

## Application to H-Smart

Transit Gateway is relevant to H-Smart when the architecture expands beyond one or two VPCs. Instead of building many peering links, H-Smart could use a Transit Gateway as a central network hub for backend, AI, analytics, shared services, and future private connectivity.

The next practical improvement would be to test this setup with EC2 instances in both VPCs, then compare the operational tradeoffs between VPC Peering and Transit Gateway for the H-Smart architecture.

## Reference Materials

- [What is a transit gateway?](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html)
- [Transit gateways](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html)
- [Transit gateway attachments to a VPC](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html)
