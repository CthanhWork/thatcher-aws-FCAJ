---
title: "Day 6 - Network ACLs for Subnet-Level Security"
date: 2026-05-02
weight: 6
summary: "Practiced Network ACLs by configuring stateless subnet-level firewall rules for inbound and outbound traffic, and compared NACL behavior vs Security Group behavior through testing."
chapter: false
---

## Why I Did This

This task practiced Network ACLs (NACLs) as a subnet-level security layer in AWS VPC architecture.

While Security Groups act as stateful firewalls at the instance level, Network ACLs operate as stateless firewalls at the subnet level. Understanding the difference between these two mechanisms is critical for designing defense-in-depth network security.

Key differences:

| Feature | Security Groups | Network ACLs |
|---------|----------------|--------------|
| Scope | Instance (ENI) level | Subnet level |
| State | Stateful (return traffic automatically allowed) | Stateless (must explicitly allow both directions) |
| Rules | Allow rules only | Allow and Deny rules |
| Evaluation | All rules evaluated | Rules evaluated in number order, first match wins |
| Default | Default SG denies all inbound, allows all outbound | Default NACL allows all inbound and outbound |

For H-Smart, Network ACLs provide an additional security layer that can:

- Block traffic at the subnet boundary before it reaches instance security groups
- Enforce deny rules for known malicious IP ranges
- Implement compliance requirements that mandate subnet-level access controls

## Implementation Steps

### Step 1: Review Default NACL Behavior

Every VPC has a default Network ACL that allows all inbound and outbound traffic.

In the VPC console, I opened Network ACLs and examined the default NACL for H-smart-VPC.

The default NACL has these rules:

**Inbound Rules:**
```text
Rule #    Type              Protocol    Port Range    Source          Allow/Deny
100       All Traffic       All         All           0.0.0.0/0       ALLOW
*         All Traffic       All         All           0.0.0.0/0       DENY
```

**Outbound Rules:**
```text
Rule #    Type              Protocol    Port Range    Destination     Allow/Deny
100       All Traffic       All         All           0.0.0.0/0       ALLOW
*         All Traffic       All         All           0.0.0.0/0       DENY
```

The asterisk `*` rule is the implicit deny rule that applies if no other rule matches.

Because rule 100 allows all traffic, the default NACL effectively permits everything, making the subnet boundary open by default.

### Step 2: Create Custom NACL for Testing

To practice NACL configuration without disrupting the default subnet behavior, I created a new custom Network ACL.

In the VPC console, I created a new NACL:

```text
Name:  H-Smart-Custom-NACL
VPC:   H-smart-VPC
```

By default, a new custom NACL starts with only the implicit deny rules (rule `*`), which blocks all traffic. This is the opposite of the default NACL behavior.

### Step 3: Configure Inbound NACL Rules

I added inbound rules to allow specific traffic types.

**Allow SSH from a specific management IP:**
```text
Rule #:     100
Type:       SSH (22)
Protocol:   TCP (6)
Port Range: 22
Source:     203.0.113.0/24 (example management network)
Allow/Deny: ALLOW
```

**Allow HTTP from anywhere:**
```text
Rule #:     110
Type:       HTTP (80)
Protocol:   TCP (6)
Port Range: 80
Source:     0.0.0.0/0
Allow/Deny: ALLOW
```

**Allow HTTPS from anywhere:**
```text
Rule #:     120
Type:       HTTPS (443)
Protocol:   TCP (6)
Port Range: 443
Source:     0.0.0.0/0
Allow/Deny: ALLOW
```

**Allow ephemeral ports for return traffic:**
```text
Rule #:     130
Type:       Custom TCP
Protocol:   TCP (6)
Port Range: 1024-65535
Source:     0.0.0.0/0
Allow/Deny: ALLOW
```

This ephemeral port rule is critical because NACLs are stateless. When an instance inside the subnet initiates an outbound connection (e.g., to download packages), the return traffic comes back on a high-numbered ephemeral port chosen by the remote server. Without this rule, return traffic would be blocked.

### Step 4: Configure Outbound NACL Rules

I added outbound rules to allow traffic leaving the subnet.

**Allow HTTP outbound:**
```text
Rule #:     100
Type:       HTTP (80)
Protocol:   TCP (6)
Port Range: 80
Destination: 0.0.0.0/0
Allow/Deny: ALLOW
```

**Allow HTTPS outbound:**
```text
Rule #:     110
Type:       HTTPS (443)
Protocol:   TCP (6)
Port Range: 443
Destination: 0.0.0.0/0
Allow/Deny: ALLOW
```

**Allow ephemeral ports outbound for return traffic:**
```text
Rule #:     120
Type:       Custom TCP
Protocol:   TCP (6)
Port Range: 1024-65535
Destination: 0.0.0.0/0
Allow/Deny: ALLOW
```

This outbound ephemeral rule is required so that return traffic for inbound connections (e.g., HTTP requests hitting a web server in the subnet) can flow back out to the client.

### Step 5: Associate Custom NACL with Test Subnet

To apply the custom NACL, I associated it with a test subnet.

In the NACL console, I selected the custom NACL and opened the Subnet associations tab, then associated it with a private subnet in H-smart-VPC.

After associating the NACL, all traffic entering or leaving the subnet is evaluated against the custom NACL rules instead of the default NACL.

### Step 6: Test NACL Behavior and Compare with Security Groups

I launched an EC2 instance in the test subnet with the custom NACL and tested connectivity.

**Test 1: Security Group allows SSH, NACL allows SSH from management network only**

- Security Group rule: Allow SSH (22) from `0.0.0.0/0`
- NACL rule: Allow SSH (22) from `203.0.113.0/24`

Expected result: SSH connections succeed only from the management network IP range. Connections from other IPs are blocked at the subnet boundary before reaching the instance security group.

**Test 2: Security Group allows HTTP, NACL blocks HTTP with explicit Deny rule**

I added a NACL deny rule:

```text
Rule #:     105
Type:       HTTP (80)
Protocol:   TCP (6)
Port Range: 80
Source:     0.0.0.0/0
Allow/Deny: DENY
```

Because rule 105 is evaluated before rule 110 (which allows HTTP), the deny rule takes precedence.

Expected result: HTTP connections are blocked even though the security group allows them. This demonstrates that NACL deny rules can override security group allow rules.

**Test 3: Observe stateless behavior**

I removed the ephemeral port inbound rule (rule 130) and attempted to initiate an outbound connection from the instance (e.g., `curl example.com`).

Expected result: The outbound request leaves the subnet successfully (allowed by outbound rule), but the return traffic is blocked at the subnet boundary (no inbound ephemeral port rule). The connection times out.

This demonstrates the stateless nature of NACLs: both directions of traffic must be explicitly allowed.

### Step 7: Clean Up and Restore Default NACL

After testing, I disassociated the custom NACL from the test subnet and reassociated the default NACL to restore normal subnet behavior.

Custom NACLs can be deleted after disassociation, but the default NACL cannot be deleted (it is permanent for the VPC).

## What I Learned

- Network ACLs are stateless firewalls that operate at the subnet level, evaluating all traffic entering or leaving the subnet.
- NACL rules are evaluated in number order, and the first matching rule determines whether traffic is allowed or denied.
- NACLs support both Allow and Deny rules, unlike Security Groups which only support Allow rules.
- Ephemeral port ranges (1024-65535) must be explicitly allowed in both directions for stateless NACL rules to permit bidirectional communication.
- NACL deny rules can block traffic even if security groups allow it, providing defense-in-depth.
- The default NACL allows all traffic, while custom NACLs start with implicit deny rules.
- Misconfigured NACLs can break connectivity more easily than Security Groups because they require explicit rules for both request and response traffic.

## Evidence and Verification

### Verification Checklist

- Confirm that the default NACL for H-smart-VPC allows all inbound and outbound traffic.
- Confirm that a custom NACL is created with explicit allow rules for SSH, HTTP, HTTPS, and ephemeral ports.
- Confirm that the custom NACL is associated with a test subnet.
- Confirm that SSH connections from outside the allowed management IP range are blocked at the NACL level.
- Confirm that adding a NACL deny rule for HTTP blocks traffic even if the security group allows it.
- Confirm that removing the ephemeral port inbound rule breaks return traffic for outbound connections initiated from the instance.
- Confirm that the test subnet is reassociated with the default NACL after testing.

## Challenges and Troubleshooting

- Challenge 1: Connection attempts timed out after applying the custom NACL.
  Resolution: I verified that ephemeral port rules (1024-65535) were configured for both inbound and outbound directions. Without these rules, return traffic cannot flow in a stateless NACL environment.

- Challenge 2: NACL rules were not evaluated in the expected order.
  Resolution: I reviewed the rule numbers and confirmed that lower-numbered rules are evaluated first. I adjusted rule numbers to ensure the desired precedence (e.g., deny rules with lower numbers than allow rules).

- Challenge 3: VPC Flow Logs showed `REJECT` actions but it was unclear whether Security Groups or NACLs were responsible.
  Resolution: I temporarily removed all NACL rules except the implicit deny and re-tested. If traffic was still rejected, the issue was security group related. If traffic was accepted, the issue was NACL related.

## Application to H-Smart

Network ACLs provide an additional security layer for H-Smart's VPC architecture:

1. **Defense-in-depth**: NACLs can block malicious traffic at the subnet boundary before it reaches instance-level security groups, reducing attack surface.
2. **Deny rules for known threats**: If H-Smart identifies malicious IP ranges or traffic patterns, NACL deny rules can block them explicitly across all instances in a subnet.
3. **Compliance requirements**: Some security frameworks require both instance-level and subnet-level access controls. NACLs fulfill the subnet-level requirement.
4. **Segmentation enforcement**: NACLs can enforce strict network segmentation between application tiers (e.g., web tier, app tier, database tier) by allowing only specific ports and protocols between subnets.

However, NACLs are more complex to manage than Security Groups due to their stateless nature and rule number ordering. For H-Smart, the recommended approach is to:

- Start with the default NACL (allow all) and rely on Security Groups for instance-level security.
- Introduce custom NACLs only when specific deny rules or subnet-level segmentation is required.
- Use VPC Flow Logs to validate NACL rule behavior before applying to production subnets.

## Reference Materials

- [Network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Security in Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/security.html)
- [Security groups vs Network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html)
