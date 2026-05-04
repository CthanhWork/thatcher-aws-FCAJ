---
title: "Week 2"
date: 2026-05-04
weight: 2
summary: "Week 2 documents operational access setup for H-Smart, starting with AWS Systems Manager Session Manager for secure EC2 administration without inbound SSH."
chapter: false
---

## Weekly Objective

This week focuses on applying the Week 1 AWS foundation to actual server administration and operational access patterns for H-Smart. The first technical output is an AWS Systems Manager Session Manager setup that allows browser-based and local PowerShell access to an EC2 instance without opening inbound SSH.

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
      <td>05/04/2026</td>
      <td>05/04/2026</td>
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
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>3</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
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

## Note For Mentors

Mentors can review raw evidence directly in the detailed Day 1 page linked from the table above. The current detailed evidence includes IAM role creation, EC2 launch configuration, Session Manager console access, local AWS CLI troubleshooting, and successful PowerShell connection verification.
