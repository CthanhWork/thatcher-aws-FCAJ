---
title: "Day 6 - AWS WAF and Shield for Application Security"
date: 2026-05-16
weight: 6
summary: "Practiced AWS WAF and Shield by configuring web application firewall rules to protect against common exploits like SQL injection and XSS, and enabling Shield Standard for DDoS protection on the H-Smart Application Load Balancer."
chapter: false
---

## Why I Did This

This task practiced AWS WAF (Web Application Firewall) and AWS Shield to protect H-Smart's web application from common security threats and DDoS attacks.

Security benefits:
- **Exploit prevention**: Block SQL injection, XSS, and other OWASP Top 10 attacks
- **Bot mitigation**: Filter out malicious bots while allowing legitimate traffic
- **DDoS protection**: Shield Standard provides automatic protection against common attacks
- **Compliance**: Meet security requirements for production applications

For H-Smart, WAF and Shield provide essential security layers before attacks reach the application.

## Implementation Steps

### Step 1: Create Web ACL in AWS WAF

In the WAF console:

```text
Name: H-Smart-WebACL
Resource type: Regional resources (CloudFront distributions)
Region: Asia Pacific (Sydney)
Associated resource: H-Smart-ECS-ALB
```

### Step 2: Add AWS Managed Rule Groups

I added pre-configured managed rule groups:

**Core rule set:**
```text
Rule group: AWS-AWSManagedRulesCommonRuleSet
Priority: 1
Action: Block
```

Protects against:
- SQL injection
- Cross-site scripting (XSS)
- Local file inclusion
- Remote code execution

**Known bad inputs:**
```text
Rule group: AWS-AWSManagedRulesKnownBadInputsRuleSet
Priority: 2
Action: Block
```

Blocks requests with patterns associated with exploitation attempts.

**SQL database protection:**
```text
Rule group: AWS-AWSManagedRulesSQLiRuleSet
Priority: 3
Action: Block
```

Additional SQL injection protection.

### Step 3: Add Rate-Based Rule

Created custom rate-limiting rule:

```text
Rule name: RateLimitRule
Type: Rate-based rule
Rate limit: 2000 requests per 5 minutes from single IP
Action: Block
```

This prevents a single IP from overwhelming the application with requests.

### Step 4: Configure IP Set for Allow/Block Lists

**Blocked IPs:**
```text
IP set name: BlockedIPs
IP addresses: 
  - 203.0.113.0/24 (example malicious range)
Action: Block
Priority: 0 (evaluated first)
```

**Allowed IPs (optional):**
```text
IP set name: AllowedIPs
IP addresses:
  - 10.0.0.0/8 (internal corporate network)
Action: Allow
Priority: 0
```

### Step 5: Enable AWS Shield Standard

Shield Standard is automatically enabled for all AWS customers at no additional cost.

Protection includes:
- Layer 3/4 DDoS protection (SYN floods, UDP floods)
- Automatic traffic scrubbing
- Always-on detection and inline mitigation

In the Shield console, I verified Shield Standard protection is active for:
- H-Smart-ECS-ALB
- CloudFront distributions (if any)

### Step 6: Configure CloudWatch Metrics and Alarms

WAF automatically publishes metrics to CloudWatch:

```text
Metrics:
- AllowedRequests: Count of requests allowed by Web ACL
- BlockedRequests: Count of requests blocked by Web ACL
- CountedRequests: Count of requests counted by count rules
```

I created an alarm:

```text
Alarm name: H-Smart-WAF-HighBlockedRequests
Metric: BlockedRequests
Threshold: > 100 requests in 5 minutes
Action: Send SNS notification to security team
```

### Step 7: Test WAF Rules

**Test SQL injection block:**
```bash
curl "http://H-Smart-ECS-ALB-xxx.ap-southeast-2.elb.amazonaws.com/?id=1' OR '1'='1"
```

Expected result: `403 Forbidden` (blocked by WAF)

**Test normal request:**
```bash
curl "http://H-Smart-ECS-ALB-xxx.ap-southeast-2.elb.amazonaws.com/"
```

Expected result: `200 OK` (allowed by WAF)

### Step 8: Review WAF Logs in CloudWatch

Enabled WAF logging to CloudWatch Logs:

```text
Log destination: aws-waf-logs-hsmart
```

Sample blocked request log:
```json
{
  "timestamp": 1715865000000,
  "action": "BLOCK",
  "terminatingRuleId": "AWS-AWSManagedRulesCommonRuleSet",
  "terminatingRuleType": "MANAGED_RULE_GROUP",
  "httpRequest": {
    "clientIp": "203.0.113.45",
    "uri": "/?id=1' OR '1'='1",
    "httpMethod": "GET"
  }
}
```

## What I Learned

- AWS WAF protects web applications from common exploits at Layer 7 (HTTP/HTTPS)
- Managed rule groups provide pre-configured protection against OWASP Top 10
- Rate-based rules prevent brute-force and DDoS attacks from single IPs
- IP sets enable allow/block lists for known good/bad IP ranges
- Shield Standard provides automatic DDoS protection at no cost
- WAF logs provide visibility into blocked attacks for security analysis
- CloudWatch alarms alert security team when attack patterns are detected

## Application to H-Smart

WAF and Shield provide critical security layers:

1. **Compliance**: Meet security requirements for handling customer data
2. **Brand protection**: Prevent defacement or data breach incidents
3. **Availability**: Maintain uptime during DDoS attacks
4. **Cost control**: Block malicious traffic before it reaches application servers

**Security best practices for H-Smart:**
- Enable WAF on all public-facing load balancers and CloudFront distributions
- Review WAF logs weekly to identify attack patterns
- Update IP block lists based on threat intelligence
- Consider Shield Advanced for enterprise-level DDoS protection (if needed)

## Reference Materials

- [What is AWS WAF?](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)
- [Web ACLs](https://docs.aws.amazon.com/waf/latest/developerguide/web-acl.html)
- [AWS Shield](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html)
- [AWS Managed Rules](https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups.html)
