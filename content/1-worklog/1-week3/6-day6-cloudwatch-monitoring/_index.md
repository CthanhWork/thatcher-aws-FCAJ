---
title: "Day 6 - CloudWatch Monitoring and Alarms"
date: 2026-05-09
weight: 6
summary: "Practiced CloudWatch monitoring by creating custom dashboards for EC2, RDS, and ALB metrics, and configuring SNS topic with CloudWatch alarms for high CPU or unhealthy targets."
chapter: false
---

## Why I Did This

This task practiced Amazon CloudWatch as the centralized monitoring and observability solution for AWS resources and applications.

CloudWatch collects and tracks metrics, monitors log files, sets alarms, and automatically reacts to changes in AWS resources. It provides visibility into resource utilization, application performance, and operational health.

Key capabilities of CloudWatch:

- **Metrics collection**: Automatically collects metrics from EC2, RDS, Lambda, ALB, and other AWS services
- **Custom dashboards**: Visualize metrics across multiple services in a unified view
- **Alarms**: Trigger notifications or automated actions when metrics cross thresholds
- **Logs centralization**: Aggregate logs from EC2, Lambda, VPC Flow Logs, and applications
- **Anomaly detection**: Machine learning-based detection of abnormal metric patterns

For H-Smart, CloudWatch is essential for:

- Monitoring application and infrastructure health in real-time
- Detecting and alerting on performance degradation before users are impacted
- Troubleshooting incidents using historical metrics and logs
- Meeting SLA requirements by tracking uptime and response time metrics
- Optimizing costs by identifying underutilized resources

## Implementation Steps

### Step 1: Review Available CloudWatch Metrics

CloudWatch automatically collects basic metrics for many AWS services without additional configuration.

In the CloudWatch console, I opened Metrics → All metrics to explore available namespaces:

**EC2 Metrics (per instance):**
```text
CPUUtilization        - Percentage of CPU capacity used
NetworkIn/NetworkOut  - Network bytes in/out
DiskReadBytes/DiskWriteBytes - Disk I/O
StatusCheckFailed     - Instance or system status check failures
```

**RDS Metrics (per database instance):**
```text
CPUUtilization        - Database CPU percentage
DatabaseConnections   - Number of active connections
FreeableMemory        - Available RAM
FreeStorageSpace      - Available disk space
ReadLatency/WriteLatency - Disk operation latency
```

**Application Load Balancer Metrics:**
```text
RequestCount          - Number of requests processed
TargetResponseTime    - Time to receive response from targets
HTTPCode_Target_2XX_Count - Successful responses
HTTPCode_Target_5XX_Count - Server error responses
HealthyHostCount      - Number of healthy targets
UnHealthyHostCount    - Number of unhealthy targets
```

**Lambda Metrics:**
```text
Invocations           - Number of function invocations
Duration              - Execution time in milliseconds
Errors                - Number of failed invocations
Throttles             - Number of throttled invocations
ConcurrentExecutions  - Functions running simultaneously
```

### Step 2: Create SNS Topic for Alarm Notifications

Before creating alarms, I set up an SNS topic to receive alarm notifications via email.

In the SNS console, I created a new topic:

```text
Type:  Standard
Name:  H-Smart-CloudWatch-Alarms
```

Then I created a subscription:

```text
Protocol: Email
Endpoint: hsmart-ops@example.com
```

SNS sent a confirmation email to the endpoint. I clicked the confirmation link to activate the subscription.

Now alarms can publish messages to this topic, and subscribed email addresses will receive notifications.

### Step 3: Create CloudWatch Alarm for High EC2 CPU

I created an alarm to detect when EC2 instances are under high CPU load.

In the CloudWatch console, I opened Alarms → Create alarm:

**Select Metric:**
```text
Namespace: EC2
Metric:    CPUUtilization
Instance:  (select one of the web server instances)
```

**Define Conditions:**
```text
Threshold type:     Static
Condition:          Greater than threshold
Threshold value:    80 (percent)
```

**Additional Configuration:**
```text
Datapoints to alarm: 2 out of 3 (alarm if CPU exceeds 80% for 2 out of 3 consecutive periods)
Period:             5 minutes
Treat missing data: As notBreaching (don't alarm during instance stops)
```

**Configure Actions:**
```text
Alarm state trigger: In alarm
SNS topic:          H-Smart-CloudWatch-Alarms
```

**Set Alarm Name:**
```text
Alarm name:        H-Smart-EC2-High-CPU
Description:       Alert when EC2 instance CPU exceeds 80% for 10 minutes
```

This alarm triggers when CPU utilization exceeds 80% for at least 2 out of 3 consecutive 5-minute periods (10 minutes total), reducing false positives from temporary spikes.

### Step 4: Create CloudWatch Alarm for Unhealthy ALB Targets

I created an alarm to detect when the Application Load Balancer has unhealthy targets.

**Select Metric:**
```text
Namespace: ApplicationELB
Metric:    UnHealthyHostCount
Load Balancer: H-Smart-ALB
Target Group:  H-Smart-Web-TG
```

**Define Conditions:**
```text
Threshold type:     Static
Condition:          Greater than threshold
Threshold value:    0 (alert if any target is unhealthy)
```

**Additional Configuration:**
```text
Datapoints to alarm: 1 out of 1 (alarm immediately when unhealthy targets detected)
Period:             1 minute
```

**Configure Actions:**
```text
Alarm state trigger: In alarm
SNS topic:          H-Smart-CloudWatch-Alarms
```

**Set Alarm Name:**
```text
Alarm name:        H-Smart-ALB-Unhealthy-Targets
Description:       Alert when ALB has one or more unhealthy targets
```

This alarm provides immediate notification when the load balancer detects unhealthy instances, allowing rapid response to availability issues.

### Step 5: Create CloudWatch Alarm for RDS Free Storage Space

I created an alarm to detect when the RDS database is running out of disk space.

**Select Metric:**
```text
Namespace: RDS
Metric:    FreeStorageSpace
DB Instance: h-smart-mysql-db
```

**Define Conditions:**
```text
Threshold type:     Static
Condition:          Lower than threshold
Threshold value:    5000000000 (5 GB in bytes)
```

**Additional Configuration:**
```text
Datapoints to alarm: 1 out of 1
Period:             5 minutes
```

**Configure Actions:**
```text
Alarm state trigger: In alarm
SNS topic:          H-Smart-CloudWatch-Alarms
```

**Set Alarm Name:**
```text
Alarm name:        H-Smart-RDS-Low-Storage
Description:       Alert when RDS free storage space drops below 5 GB
```

This alarm provides advance warning before the database runs out of space, allowing time to increase storage capacity.

### Step 6: Create Custom CloudWatch Dashboard

I created a custom dashboard to visualize key metrics across all H-Smart infrastructure.

In the CloudWatch console, I opened Dashboards → Create dashboard:

```text
Dashboard name: H-Smart-Production-Dashboard
```

**I added the following widgets:**

**Widget 1: EC2 CPU Utilization (Line chart)**
```text
Metrics: EC2 → CPUUtilization for all web server instances
Period:  5 minutes
Statistic: Average
Title:   Web Server CPU Utilization
```

**Widget 2: ALB Request Count and Response Time (Line chart)**
```text
Metrics: 
- ApplicationELB → RequestCount (Sum)
- ApplicationELB → TargetResponseTime (Average)
Period:  1 minute
Title:   ALB Traffic and Response Time
```

**Widget 3: ALB Healthy vs Unhealthy Targets (Stacked area chart)**
```text
Metrics:
- ApplicationELB → HealthyHostCount (Average)
- ApplicationELB → UnHealthyHostCount (Average)
Period:  1 minute
Title:   ALB Target Health Status
```

**Widget 4: RDS Database Metrics (Line chart)**
```text
Metrics:
- RDS → CPUUtilization (Average)
- RDS → DatabaseConnections (Average)
- RDS → FreeStorageSpace (Average)
Period:  5 minutes
Title:   RDS Database Performance
```

**Widget 5: Lambda Function Metrics (Line chart)**
```text
Metrics:
- Lambda → Invocations (Sum)
- Lambda → Duration (Average)
- Lambda → Errors (Sum)
Period:  1 minute
Title:   Lambda Function Activity
```

**Widget 6: Alarm Status (Alarm status widget)**
```text
Alarms: Select all H-Smart alarms created in previous steps
Title:  Current Alarm Status
```

The dashboard provides a single-pane-of-glass view of all critical H-Smart infrastructure metrics.

### Step 7: Test Alarm Triggering

To verify alarm functionality, I simulated high CPU load on an EC2 instance:

```bash
# SSH into EC2 instance
ssh ec2-user@instance-ip

# Install stress tool
sudo yum install -y stress

# Generate CPU load exceeding 80% for 15 minutes
stress --cpu 4 --timeout 900
```

Within 10-15 minutes, the alarm state changed from `OK` to `In alarm`, and I received an SNS email notification:

```text
Subject: ALARM: "H-Smart-EC2-High-CPU" in Asia Pacific (Sydney)

You are receiving this email because your Amazon CloudWatch Alarm "H-Smart-EC2-High-CPU" in the Asia Pacific (Sydney) region has entered the ALARM state, because "Threshold Crossed: 2 out of the last 3 datapoints [85.0, 92.3] were greater than the threshold (80.0)."

Alarm Details:
- Name:      H-Smart-EC2-High-CPU
- State:     ALARM → OK
- Reason:    Threshold Crossed
```

This confirms that the alarm is correctly configured and SNS notifications are working.

### Step 8: Configure CloudWatch Logs for Application Monitoring

To monitor application logs in addition to metrics, I configured CloudWatch Logs agent on an EC2 instance.

**Install CloudWatch Logs Agent:**

```bash
# Install CloudWatch agent
sudo yum install -y amazon-cloudwatch-agent

# Create agent configuration
sudo vi /opt/aws/amazon-cloudwatch-agent/etc/config.json
```

**Agent Configuration:**

```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/httpd/access_log",
            "log_group_name": "/hsmart/webserver/access",
            "log_stream_name": "{instance_id}",
            "timezone": "UTC"
          },
          {
            "file_path": "/var/log/httpd/error_log",
            "log_group_name": "/hsmart/webserver/error",
            "log_stream_name": "{instance_id}",
            "timezone": "UTC"
          }
        ]
      }
    }
  }
}
```

**Start CloudWatch Agent:**

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

Now Apache access and error logs are automatically streamed to CloudWatch Logs, where they can be searched, filtered, and analyzed.

## What I Learned

- CloudWatch automatically collects basic metrics from AWS services without additional configuration.
- CloudWatch alarms trigger actions when metrics cross thresholds for a specified number of datapoints.
- SNS topics enable alarm notifications via email, SMS, or integration with incident management systems.
- Configuring "2 out of 3 datapoints" reduces false positives from temporary metric spikes.
- Custom dashboards provide unified visibility across multiple AWS services and resources.
- CloudWatch Logs centralizes application logs, VPC Flow Logs, and Lambda logs for troubleshooting.
- Alarms can trigger not only notifications but also automated actions like Auto Scaling or Lambda functions.
- Composite alarms combine multiple alarms using AND/OR logic for complex alerting scenarios.
- CloudWatch Logs Insights provides a query language for analyzing large log datasets.

## Evidence and Verification

### Verification Checklist

- Confirm that an SNS topic is created with email subscription confirmed.
- Confirm that a CloudWatch alarm is created for EC2 CPUUtilization > 80%.
- Confirm that a CloudWatch alarm is created for ALB UnHealthyHostCount > 0.
- Confirm that a CloudWatch alarm is created for RDS FreeStorageSpace < 5 GB.
- Confirm that all alarms are configured to send notifications to the SNS topic.
- Confirm that a custom dashboard is created with widgets for EC2, ALB, RDS, and Lambda metrics.
- Confirm that generating CPU load on an EC2 instance triggers the alarm within 10-15 minutes.
- Confirm that an SNS email notification is received when the alarm enters `In alarm` state.
- Confirm that CloudWatch Logs agent is installed and streaming web server logs to CloudWatch Logs.

## Challenges and Troubleshooting

- Challenge 1: Alarm did not trigger even though metric exceeded threshold.
  Resolution: The alarm was configured with "3 out of 3 datapoints," requiring sustained threshold breach. I changed it to "2 out of 3 datapoints" to trigger faster while still avoiding false positives.

- Challenge 2: SNS email notifications were not received.
  Resolution: I checked the SNS subscription status and found it was in "Pending confirmation" state. I clicked the confirmation link in the initial SNS email to activate the subscription.

- Challenge 3: CloudWatch Logs agent failed to start.
  Resolution: The EC2 instance IAM role was missing `CloudWatchAgentServerPolicy`. I attached the managed policy to the instance role and restarted the agent.

- Challenge 4: Dashboard widgets showed "No data available."
  Resolution: I verified the metric dimensions (instance ID, load balancer name) were correct. I also confirmed that the time range was set to show recent data (e.g., last 3 hours).

## Application to H-Smart

CloudWatch monitoring is critical for H-Smart's operational excellence:

1. **Proactive issue detection**: Alarms notify the team before users experience performance degradation or downtime, enabling proactive response.

2. **Incident response**: Unified dashboards and centralized logs reduce mean time to resolution (MTTR) during incidents by providing immediate visibility into system state.

3. **Capacity planning**: Historical metric data reveals usage trends, allowing informed decisions about scaling infrastructure or optimizing resources.

4. **SLA compliance**: CloudWatch metrics provide objective evidence of uptime and performance for customer SLA reporting.

5. **Cost optimization**: Monitoring resource utilization identifies over-provisioned or idle resources that can be downsized to reduce costs.

The recommended next step is to:
- Create composite alarms for complex scenarios (e.g., alarm if CPU is high AND disk space is low)
- Set up CloudWatch Logs Insights queries for common troubleshooting scenarios
- Integrate CloudWatch alarms with incident management tools (PagerDuty, Opsgenie)
- Implement custom application metrics using CloudWatch PutMetricData API
- Configure CloudWatch Anomaly Detection for machine learning-based alerting

## Reference Materials

- [What is Amazon CloudWatch?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)
- [Create alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
- [Using CloudWatch dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html)
