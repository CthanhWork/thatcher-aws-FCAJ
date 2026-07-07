---
title: "Day 2 - VPC Peering Setup and DNS Troubleshooting"
date: 2026-04-28
weight: 2
summary: "Practiced VPC Peering between two non-overlapping VPC networks, configured route tables and NACL access, and troubleshot Cross-Peer DNS settings."
chapter: false
---

## Why I Did This

This task practiced Lab 000019 about VPC Peering. VPC Peering is important when two separate VPC networks need to communicate privately without sending traffic through the public internet.

For H-Smart, this pattern can become useful when the system grows across Regions or across separated environments. For example, one VPC could host AI or bot services in Sydney while another VPC hosts backend services in Singapore. A peering connection gives those networks a private communication path while still keeping the VPC boundaries clear.

## Implementation Steps

### Step 1: Prepare Two Non-Overlapping VPCs

Before creating the peering connection, I prepared two VPCs with different CIDR ranges. The CIDR blocks must not overlap, otherwise AWS cannot route traffic between them correctly.

The target design was:

- VPC A: H-smart-VPC with CIDR range `10.0.0.0/16`
- VPC B: A second VPC in Sydney with CIDR range `172.16.0.0/16`

This setup simulates two separated H-Smart environments that need private network connectivity.

### Step 2: Update Network ACL Rules

Next, I reviewed the Network ACLs for both VPCs. Network ACLs work at the subnet boundary, so both inbound and outbound rules must allow traffic from the peer VPC CIDR range.

The expected rule direction was:

- In VPC A, allow traffic from `172.16.0.0/16`
- In VPC B, allow traffic from `10.0.0.0/16`

This step is important because VPC Peering creates the private connection, but subnet-level filtering can still block the traffic if the Network ACL rules are too restrictive.

### Step 3: Create the VPC Peering Connection

From the VPC console, I opened Peering Connections and created a new peering request.

The requester side used H-smart-VPC. For the accepter side, I selected another Region and provided the VPC ID of the second VPC in Sydney.

After creating the request, I switched to the Sydney Region and accepted the peering request. The peering connection must be accepted before it can be used for routing.

### Step 4: Configure Route Tables

After the peering connection existed, I updated the route tables on both sides. Without routes, the VPCs still do not know where to send traffic for the peer CIDR range.

In the H-smart-VPC route table, I added:

```text
Destination: 172.16.0.0/16
Target:      VPC Peering Connection
```

In the Sydney VPC route table, I added the reverse route:

```text
Destination: 10.0.0.0/16
Target:      VPC Peering Connection
```

This two-way routing is required because request and response traffic both need a valid path.

### Step 5: Enable Cross-Peer DNS

I then tried to enable Cross-Peer DNS from the peering connection settings. This feature allows resources in one VPC to resolve private DNS names from the peer VPC instead of relying only on private IP addresses.

This is useful for H-Smart because backend services, databases, and internal APIs are easier to operate when services can call each other by private DNS name.

## Challenges and Troubleshooting

- Challenge 1: Cross-Peer DNS could not be enabled because DNS Hostnames was disabled on the VPC.
  Resolution: I opened Your VPCs, selected each VPC, chose Actions, then Edit VPC settings. In DNS settings, I enabled both DNS resolution and DNS hostnames.

- Challenge 2: The DNS setting had to be enabled on both sides of the peering relationship.
  Resolution: I repeated the VPC DNS settings update in both the Singapore and Sydney Regions before retrying the peering DNS configuration.

- Challenge 3: A peering connection alone does not update routing automatically.
  Resolution: I added route table entries on both VPCs so each VPC had a route to the peer CIDR through the peering connection.

## What I Learned

- VPC Peering connects two VPCs privately, but the CIDR ranges must not overlap.
- Network ACLs and route tables still control whether traffic can actually pass through the connection.
- Peering requests across Regions require action from both sides: create the request in one Region and accept it in the other.
- Cross-Peer DNS depends on VPC DNS settings. DNS resolution and DNS hostnames must be enabled before private DNS resolution across the peering connection can work.
- For real H-Smart architecture, VPC Peering can separate services by environment or Region while still allowing private service-to-service communication.

## Evidence and Verification

### Verification Checklist

- Confirm that both VPCs exist and use non-overlapping CIDR ranges.
- Confirm that the VPC peering request is accepted.
- Confirm that both route tables contain a route to the peer VPC CIDR range.
- Confirm that Network ACLs allow inbound and outbound traffic for the peer CIDR range.
- Confirm that DNS resolution and DNS hostnames are enabled on both VPCs.
- Confirm that Cross-Peer DNS settings can be saved after DNS hostnames are enabled.

## Application to H-Smart

This lab is directly relevant to H-Smart because the project may eventually separate workloads by Region, function, or environment. VPC Peering would allow backend services, AI services, internal tools, and databases to communicate privately without exposing everything to the public internet.

The next practical step would be to test connectivity between EC2 instances in both VPCs using private IP addresses first, then private DNS names after Cross-Peer DNS is enabled.

## Reference Materials

- [VPC Peering Workshop](https://000019.awsstudygroup.com/)
- [What is VPC peering?](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html)
- [Work with VPC peering connections](https://docs.aws.amazon.com/vpc/latest/peering/working-with-vpc-peering.html)
