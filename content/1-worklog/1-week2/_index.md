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
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>5</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>6</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>7</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

## Detailed Technical Worklogs

- [Day 1: AWS Systems Manager Session Manager Setup](1-day1-systems-manager-session-manager/)
- [Day 2: VPC Peering Setup and DNS Troubleshooting](2-day2-vpc-peering/)
- [Day 3: Transit Gateway Hub Setup](3-day3-transit-gateway/)

## Note For Mentors

Mentors can review raw evidence directly in the detailed task pages linked from the table above. The current detailed evidence includes IAM role creation, EC2 launch configuration, Session Manager console access, local AWS CLI troubleshooting, VPC Peering route planning, Cross-Peer DNS troubleshooting, and Transit Gateway hub routing practice.
