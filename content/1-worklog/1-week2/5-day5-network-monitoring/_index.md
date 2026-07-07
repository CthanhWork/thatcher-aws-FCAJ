---
title: "Day 5 - VPC Flow Logs for Network Monitoring"
date: 2026-05-01
weight: 5
summary: "Practiced VPC Flow Logs by enabling traffic capture for H-smart-VPC, exporting to CloudWatch Logs, and querying logs to troubleshoot rejected traffic and security group issues."
chapter: false
---

## Why I Did This

This task practiced VPC Flow Logs as a network monitoring and troubleshooting tool. Flow Logs capture metadata about IP traffic flowing through network interfaces in a VPC, including accepted and rejected traffic.

Unlike application logs or CloudWatch metrics, Flow Logs show the actual network-level behavior: which source IPs are connecting, which destination ports are being hit, and whether traffic is being accepted or rejected by security groups or Network ACLs.

For H-Smart, this capability is critical for:

- Diagnosing connectivity issues between services
- Identifying unauthorized access attempts
- Understanding traffic patterns for capacity planning
- Meeting security and compliance requirements that mandate network traffic audit trails

## Implementation Steps

### Step 1: Enable VPC Flow Logs for H-smart-VPC

In the VPC console, I selected H-smart-VPC and opened the Flow Logs tab.

I created a new Flow Log with these settings:

```text
Filter:                  All (capture both accepted and rejected traffic)
Maximum aggregation interval: 1 minute (faster visibility for troubleshooting)
Destination:             Send to CloudWatch Logs
Destination log group:   Create new log group: /aws/vpc/flowlogs/h-smart-vpc
IAM role:                Create new IAM role (auto-generated with CloudWatch Logs write permissions)
Log record format:       AWS default format
```

The AWS default format captures these fields for each network flow:

```text
version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status
```

The most important field for troubleshooting is `action`, which shows whether traffic was `ACCEPT` or `REJECT`.

After creating the Flow Log, I waited a few minutes for data to start appearing in CloudWatch Logs.

### Step 2: Verify Flow Logs in CloudWatch Logs

In the CloudWatch console, I opened Logs → Log groups and found the newly created log group:

```text
/aws/vpc/flowlogs/h-smart-vpc
```

Inside the log group, individual log streams are created automatically for each network interface in the VPC.

Each log stream name follows this pattern:

```text
eni-xxxxxxxxx-all
```

I opened one of the log streams and confirmed that Flow Log records were being captured.

Example Flow Log record:

```text
2 123456789012 eni-0a1b2c3d4e5f6g7h8 10.0.1.25 10.0.2.50 443 54321 6 15 7500 1714550400 1714550460 ACCEPT OK
```

This record shows:

- Source IP `10.0.1.25` connecting to destination IP `10.0.2.50`
- Destination port `443` (HTTPS)
- Protocol `6` (TCP)
- Traffic was `ACCEPT`ed by security groups and NACLs

### Step 3: Generate Test Traffic

To practice querying Flow Logs, I generated test traffic with known characteristics.

I launched two EC2 instances in H-smart-VPC:

- Instance A in private subnet `10.0.1.0/24`
- Instance B in private subnet `10.0.2.0/24`

From Instance A, I attempted to connect to Instance B on port 80 using:

```bash
curl http://10.0.2.50
```

I then modified the security group on Instance B to block HTTP traffic and repeated the connection attempt. This should generate `REJECT` entries in the Flow Logs.

### Step 4: Query Flow Logs for Rejected Traffic

In CloudWatch Logs Insights, I used this query to find all rejected traffic:

```sql
fields @timestamp, srcaddr, dstaddr, srcport, dstport, action
| filter action = "REJECT"
| sort @timestamp desc
| limit 50
```

This query returned all recent network flows that were rejected by security groups or Network ACLs.

By examining the rejected flows, I could identify:

- Which source IPs are being blocked
- Which destination ports are being rejected
- Whether the rejection is due to security group rules or NACL rules

### Step 5: Query Flow Logs for Specific IP or Port

To troubleshoot a specific connectivity issue, I used targeted queries.

To find all traffic to a specific destination IP:

```sql
fields @timestamp, srcaddr, dstaddr, srcport, dstport, action
| filter dstaddr = "10.0.2.50"
| sort @timestamp desc
| limit 50
```

To find all traffic to a specific port:

```sql
fields @timestamp, srcaddr, dstaddr, srcport, dstport, action
| filter dstport = 443
| sort @timestamp desc
| limit 50
```

These queries help narrow down the root cause when troubleshooting "why can't service A reach service B on port X?"

### Step 6: Understand Flow Log Limitations

Flow Logs do not capture all traffic types. These are excluded:

- Traffic to Amazon DNS servers (but third-party DNS is captured)
- Traffic to Amazon Windows license activation servers
- Traffic to and from instance metadata service `169.254.169.254`
- DHCP traffic
- Traffic to the VPC router reserved IP

Flow Logs also capture metadata only, not packet contents. For deep packet inspection, additional tools like VPC Traffic Mirroring would be required.

## What I Learned

- VPC Flow Logs capture network metadata (source, destination, port, protocol, action) for all traffic in a VPC, subnet, or network interface.
- Flow Logs can send data to CloudWatch Logs, S3, or Kinesis Data Firehose depending on the analysis workflow.
- The `action` field shows whether traffic was accepted or rejected, which is critical for troubleshooting security group and NACL issues.
- CloudWatch Logs Insights provides a query language for filtering and analyzing Flow Log data.
- Flow Logs have a small delay (usually 1-5 minutes) before captured traffic appears in the destination.
- Flow Logs do not capture all traffic types, and they do not include packet payload data.

## Evidence and Verification

### Verification Checklist

- Confirm that VPC Flow Logs are enabled for H-smart-VPC with filter set to "All".
- Confirm that the CloudWatch Logs destination log group `/aws/vpc/flowlogs/h-smart-vpc` exists.
- Confirm that log streams are being created automatically for each ENI in the VPC.
- Confirm that Flow Log records are appearing in CloudWatch Logs within 5 minutes of enabling.
- Confirm that test traffic between two EC2 instances generates visible Flow Log entries.
- Confirm that rejected traffic (blocked by security groups) generates `REJECT` action entries.
- Confirm that CloudWatch Logs Insights queries can filter Flow Logs by `action = "REJECT"`.
- Confirm that queries can filter by specific IP addresses or ports for targeted troubleshooting.

## Challenges and Troubleshooting

- Challenge 1: Flow Logs did not appear immediately after enabling.
  Resolution: Flow Logs have a delay of 1-5 minutes before data starts appearing. I waited a few minutes and refreshed the CloudWatch Logs console.

- Challenge 2: It was unclear whether rejected traffic was due to security groups or NACLs.
  Resolution: Flow Logs show the final `REJECT` action but do not distinguish between security group and NACL rejection. To isolate the cause, I temporarily removed NACL rules and re-tested. If traffic was still rejected, the issue was security group related.

- Challenge 3: Flow Log data volume can grow quickly and increase CloudWatch Logs costs.
  Resolution: For production use, I would consider filtering Flow Logs to capture only rejected traffic (`Reject` filter) or exporting to S3 for long-term storage at lower cost.

## Application to H-Smart

VPC Flow Logs are essential for H-Smart's operational and security posture:

1. **Troubleshooting connectivity issues**: When backend services cannot reach databases or APIs, Flow Logs reveal whether traffic is being rejected and at which network layer.
2. **Security monitoring**: Flow Logs provide audit trails for unauthorized access attempts, which is important for compliance and incident response.
3. **Capacity planning**: By analyzing traffic patterns, H-Smart can identify high-traffic network paths and optimize subnet or security group design.
4. **Cost optimization**: Flow Logs can reveal unexpected data transfer patterns that drive up NAT gateway or data transfer costs.

For H-Smart, the recommended approach is to enable Flow Logs for the production VPC with the "All" filter during initial deployment, then switch to "Reject" filter once baseline traffic patterns are understood. Long-term Flow Log data should be exported to S3 with lifecycle policies to manage storage costs.

## Reference Materials

- [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
- [Working with flow logs](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-flow-logs.html)
- [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html)
