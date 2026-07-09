---
title: "Week 2"
date: 2026-04-27
weight: 2
summary: "Week 2 documents operational networking and access setup for H-Smart, including AWS Systems Manager Session Manager, VPC Peering, and Transit Gateway practice."
chapter: false
---

## Weekly Objective

This week focuses on applying the Week 1 AWS foundation to actual server administration and operational networking patterns for H-Smart. The first technical outputs are an AWS Systems Manager Session Manager setup for secure EC2 access, a VPC Peering practice lab for connecting two separate VPC networks, and a Transit Gateway setup for hub-based VPC connectivity.

## Tasks To Be Carried Out This Week

<table>
  <thead>
    <tr>
      <th>Day</th>
      <th>Task</th>
      <th>Start Date</th>
      <th>Completion Date</th>
      <th>Reference Material</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>
        <ul>
          <li><a href="1-day1-systems-manager-session-manager/">Practice AWS Systems Manager Session Manager setup for secure EC2 access</a></li>
          <li><a href="1-day1-systems-manager-session-manager/">Create EC2 IAM role with AmazonSSMManagedInstanceCore</a></li>
          <li><a href="1-day1-systems-manager-session-manager/">Connect to H-Smart-Server from AWS Console and local PowerShell</a></li>
        </ul>
      </td>
      <td>04/27/2026</td>
      <td>04/27/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html">AWS Systems Manager Session Manager</a></li>
          <li><a href="https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html">Install the Session Manager plugin for the AWS CLI</a></li>
          <li><a href="https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html">AmazonSSMManagedInstanceCore managed policy</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>
        <ul>
          <li><a href="2-day2-vpc-peering/">Practice VPC Peering between two non-overlapping VPC networks</a></li>
          <li><a href="2-day2-vpc-peering/">Configure route tables and Network ACL rules for cross-VPC communication</a></li>
          <li><a href="2-day2-vpc-peering/">Troubleshoot Cross-Peer DNS settings by enabling DNS hostnames and DNS resolution</a></li>
        </ul>
      </td>
      <td>04/28/2026</td>
      <td>04/28/2026</td>
      <td>
        <ul>
          <li><a href="https://000019.awsstudygroup.com/">VPC Peering Workshop</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html">What is VPC peering?</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/peering/working-with-vpc-peering.html">Work with VPC peering connections</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>
        <ul>
          <li><a href="3-day3-transit-gateway/">Practice Transit Gateway setup as a central network hub</a></li>
          <li><a href="3-day3-transit-gateway/">Attach H-smart-VPC and H-Smart-VPC-B to the Transit Gateway</a></li>
          <li><a href="3-day3-transit-gateway/">Configure VPC route tables for cross-VPC communication through TGW</a></li>
          <li><a href="3-day3-transit-gateway/">Review cleanup order to avoid ongoing Transit Gateway charges</a></li>
        </ul>
      </td>
      <td>04/29/2026</td>
      <td>04/29/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html">What is a transit gateway?</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/tgw/tgw-transit-gateways.html">Transit gateways</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html">Transit gateway attachments to a VPC</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>
        <ul>
          <li><a href="4-day4-vpc-endpoints/">Practice VPC Endpoints for private AWS service access</a></li>
          <li><a href="4-day4-vpc-endpoints/">Create Gateway Endpoint for S3 to avoid internet gateway charges</a></li>
          <li><a href="4-day4-vpc-endpoints/">Create Interface Endpoint for Systems Manager with private DNS</a></li>
        </ul>
      </td>
      <td>04/30/2026</td>
      <td>04/30/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html">VPC endpoints</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-gateway.html">Gateway endpoints</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-interface.html">Interface endpoints</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>5</td>
      <td>
        <ul>
          <li><a href="5-day5-network-monitoring/">Practice VPC Flow Logs for network traffic analysis</a></li>
          <li><a href="5-day5-network-monitoring/">Enable Flow Logs for H-smart-VPC and export to CloudWatch Logs</a></li>
          <li><a href="5-day5-network-monitoring/">Query Flow Logs to identify rejected traffic and security group issues</a></li>
        </ul>
      </td>
      <td>05/01/2026</td>
      <td>05/01/2026</td>
      <td>
        <ul>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html">VPC Flow Logs</a></li>
          <li><a href="https://docs.aws.amazon.com/vpc/latest/userguide/working-with-flow-logs.html">Working with flow logs</a></li>
          <li><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html">CloudWatch Logs</a></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>6</td>
      <td>
        <ul>
          <li><a href="6-day6-team-meeting/">Attend FCAJ internal team meeting with four speaker sessions</a></li>
          <li><a href="6-day6-team-meeting/">Absorb and document insights on learning psychology, AWS AI, career mindset, and AI vibe-coding tooling</a></li>
        </ul>
      </td>
      <td>05/03/2026</td>
      <td>05/03/2026</td>
      <td>
        <ul>
          <li><a href="https://aws.amazon.com/bedrock/">Amazon Bedrock</a></li>
          <li><a href="https://aws.amazon.com/ai/">AI on AWS</a></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: AWS Systems Manager Session Manager Setup](1-day1-systems-manager-session-manager/)
- [Day 2: VPC Peering Setup and DNS Troubleshooting](2-day2-vpc-peering/)
- [Day 3: Transit Gateway Hub Setup](3-day3-transit-gateway/)
- [Day 4: VPC Endpoints for Private AWS Service Access](4-day4-vpc-endpoints/)
- [Day 5: VPC Flow Logs for Network Monitoring](5-day5-network-monitoring/)
- [Day 6: FCAJ Team Meeting — Learning, AI, Career, and Vibe-Coding](6-day6-team-meeting/)

## Note For Mentors

Mentors can review raw evidence directly in the detailed task pages linked from the table above. The current detailed evidence includes IAM role creation, EC2 launch configuration, Session Manager console access, local AWS CLI troubleshooting, VPC Peering route planning, Cross-Peer DNS troubleshooting, and Transit Gateway hub routing practice.

