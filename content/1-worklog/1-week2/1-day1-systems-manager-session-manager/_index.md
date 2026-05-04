---
title: "Day 1 - AWS Systems Manager Session Manager Setup"
date: 2026-05-04
weight: 1
summary: "Created an EC2 instance for H-Smart and connected to it securely through AWS Systems Manager Session Manager without opening SSH."
chapter: false
---

## Why I Did This

This task set up a safer administration path for the H-Smart EC2 environment. Instead of opening port 22 and connecting with a traditional SSH key, I used AWS Systems Manager Session Manager so the server can be accessed from the AWS Console and from the local AWS CLI.

This approach is useful for H-Smart because it reduces direct network exposure. The instance does not need an inbound SSH rule, and access can be controlled through IAM permissions, AWS Systems Manager, and audit logs.

## Implementation Steps

### Step 1: Create an IAM Role for EC2 Systems Manager Access

I started by creating an IAM role for EC2. In IAM, I opened Roles, selected Create role, chose AWS service, and selected EC2 as the trusted service.

![Create role for EC2](../../../images/1-worklog/week2/system-manager/choose-ec2-role.png)

Then I attached the AWS managed policy AmazonSSMManagedInstanceCore. This policy allows the EC2 instance to register with Systems Manager and become available as a managed instance.

![Attach AmazonSSMManagedInstanceCore policy](../../../images/1-worklog/week2/system-manager/attach-amazon-ssm-managed-instance-core.png)

I named the role H-Smart-EC2-SSM-Role and completed the role creation.

![Create H-Smart EC2 SSM role](../../../images/1-worklog/week2/system-manager/create-hsmart-ec2-ssm-role.png)

![IAM role created successfully](../../../images/1-worklog/week2/system-manager/ec2-ssm-role-created.png)

### Step 2: Launch the H-Smart EC2 Instance

Next, I opened EC2 and launched a new instance for the H-Smart server. The instance name was H-Smart-Server.

For the AMI, I used Amazon Linux 2023 because it is suitable for Free Tier practice and already includes the SSM Agent by default. For the instance type, I used a small Free Tier-compatible instance type such as t2.micro or t3.micro depending on regional availability.

Because this lab uses Session Manager, I did not need to rely on SSH access as the primary connection method.

![Launch instance configuration](../../../images/1-worklog/week2/system-manager/launch-instance-review.png)

### Step 3: Configure Network Settings

In the network settings section, I placed the instance inside the existing H-Smart VPC foundation:

- VPC: H-smart-VPC
- Subnet: H-smart-public-sn
- Auto-assign public IP: Enabled
- Security Group: H-smart-SG

I removed unnecessary inbound rules, including SSH port 22, because Session Manager does not require inbound SSH access from the internet.

![Network settings for H-Smart EC2](../../../images/1-worklog/week2/system-manager/network-settings.png)

### Step 4: Attach the IAM Instance Profile

In Advanced details, I selected the IAM instance profile H-Smart-EC2-SSM-Role. This step is required because the EC2 instance needs permission to communicate with AWS Systems Manager.

![Attach IAM instance profile](../../../images/1-worklog/week2/system-manager/iam-instance-profile.png)

After reviewing the configuration, I launched the instance successfully.

![Instance launched successfully](../../../images/1-worklog/week2/system-manager/launch-success.png)

### Step 5: Connect from the AWS Console with Session Manager

After the instance reached the Running state, I selected the H-Smart-Server instance, clicked Connect, and opened the Session Manager tab.

Once the instance was registered with Systems Manager, the Connect button became available.

![Open EC2 connect options](../../../images/1-worklog/week2/system-manager/connect-ec2.png)

I started the Session Manager connection from the browser and verified that the terminal session opened successfully.

![Connected successfully through Session Manager](../../../images/1-worklog/week2/system-manager/session-manager-console-connected.png)

### Step 6: Prepare Local AWS CLI Access

To test local access, I created an access key for CLI usage and configured the AWS CLI profile on Windows PowerShell.

The local configuration flow used:

```text
AWS Access Key ID:     <access-key-id>
AWS Secret Access Key: <secret-access-key>
Default region name:   ap-southeast-2
Default output format: json
```

![Create access key for CLI](../../../images/1-worklog/week2/system-manager/create-cli-access-key.png)

![CLI access key created](../../../images/1-worklog/week2/system-manager/cli-access-key-created.png)

### Step 7: Troubleshoot the Session Manager Plugin Error

When I tried to start a session from PowerShell, the AWS CLI returned this error:

```powershell
aws ssm start-session --target i-041c2de4cd11340ac --region ap-southeast-2
```

```text
aws: [ERROR]: SessionManagerPlugin is not found.
```

The cause was that AWS CLI does not include the Session Manager plugin by default on Windows. I installed the plugin from AWS and reopened PowerShell so the environment path could refresh.

The installation command used:

```powershell
Invoke-WebRequest "https://s3.amazonaws.com/session-manager-downloads/windows/latest/latest/AWSCLISessionManagerPlugin.msi" -OutFile "AWSCLISessionManagerPlugin.msi"
Start-Process msiexec.exe -ArgumentList "/i AWSCLISessionManagerPlugin.msi /qn" -Wait
```

Then I verified the plugin installation with:

```powershell
session-manager-plugin
```

Expected result:

```text
The Session Manager plugin was installed successfully.
```

### Step 8: Connect Successfully from Local PowerShell

After installing the Session Manager plugin and confirming the AWS CLI configuration, I started the session again from local PowerShell.

![Successful local Session Manager connection](../../../images/1-worklog/week2/system-manager/local-powershell-session-connected.png)

I also captured the local troubleshooting and verification state during the process.

![Local CLI troubleshooting screenshot](../../../images/1-worklog/week2/system-manager/local-cli-troubleshooting.png)

## What I Learned

- Session Manager allows EC2 administration without opening inbound SSH access.
- The EC2 instance must have an IAM role with AmazonSSMManagedInstanceCore attached.
- Network routing still matters. The instance needs a working outbound path to Systems Manager endpoints, either through internet access or VPC endpoints.
- Amazon Linux 2023 already includes the SSM Agent, but the local Windows machine still needs the Session Manager plugin for AWS CLI sessions.
- AWS CLI region configuration must match the region where the EC2 instance is running.

## Evidence and Verification

### Verification Checklist

- Confirm that IAM role H-Smart-EC2-SSM-Role exists.
- Confirm that AmazonSSMManagedInstanceCore is attached to the role.
- Confirm that H-Smart-Server is launched in H-smart-VPC and H-smart-public-sn.
- Confirm that the EC2 instance has the H-Smart-EC2-SSM-Role instance profile attached.
- Confirm that the security group does not require inbound SSH for Session Manager access.
- Confirm that the instance appears as available for Session Manager connection.
- Confirm that browser-based Session Manager connection works.
- Confirm that local PowerShell connection works after installing the Session Manager plugin.

## Challenges and Troubleshooting

- Challenge 1: The first local CLI connection failed with SessionManagerPlugin is not found.
  Resolution: I installed the Session Manager plugin for Windows and reopened PowerShell before retrying the command.

- Challenge 2: Session Manager depends on both IAM and network readiness, so a running EC2 instance is not enough by itself.
  Resolution: I verified the IAM role, public subnet placement, public IP assignment, and route table internet path before testing the connection again.

- Challenge 3: Region mismatch can cause the AWS CLI to search for the instance in the wrong place.
  Resolution: I used the explicit `--region ap-southeast-2` option when starting the session for the instance.

## Application to H-Smart

This setup gives H-Smart a safer EC2 administration model. Future backend servers can be managed through Systems Manager instead of exposing SSH to the internet. This is especially useful when the project grows because access can be controlled through IAM policies and monitored through AWS service logs.

The next improvement would be to place application servers in a private subnet and use Systems Manager VPC endpoints. That would allow private administration without public IP addresses while still keeping operational access available.

## Reference Materials

- [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
- [Install the Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)
- [AmazonSSMManagedInstanceCore managed policy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonSSMManagedInstanceCore.html)
