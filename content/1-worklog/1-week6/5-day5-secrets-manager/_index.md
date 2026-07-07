---
title: "Day 5 - AWS Secrets Manager for Secure Credential Storage"
date: 2026-05-29
weight: 5
summary: "Practiced AWS Secrets Manager by storing database credentials and API keys securely, implementing automatic secret rotation with Lambda functions for enhanced security."
chapter: false
---

## Why I Did This

AWS Secrets Manager securely stores, retrieves, and rotates database credentials, API keys, and other secrets.

**Benefits:**
- **Encryption**: Secrets encrypted at rest with KMS
- **Rotation**: Automatic rotation without code changes
- **Auditing**: CloudTrail logs all secret access
- **Integration**: Native integration with RDS, Redshift, DocumentDB

For H-Smart: Secure database passwords, third-party API keys, encryption keys.

## Implementation Steps

### Step 1: Store Database Credentials

**Create secret:**
```bash
aws secretsmanager create-secret \
  --name hsmart/prod/db \
  --description "H-Smart production database credentials" \
  --secret-string '{
    "username": "admin",
    "password": "SuperSecurePassword123!",
    "engine": "mysql",
    "host": "h-smart-mysql-db.xxxxx.ap-southeast-2.rds.amazonaws.com",
    "port": 3306,
    "dbname": "hsmart_db"
  }'
```

Secret ARN: `arn:aws:secretsmanager:ap-southeast-2:123456789012:secret:hsmart/prod/db-AbCdEf`

### Step 2: Retrieve Secret in Application

**Python example:**
```python
import boto3
import json

def get_db_credentials():
    client = boto3.client('secretsmanager', region_name='ap-southeast-2')
    
    response = client.get_secret_value(SecretId='hsmart/prod/db')
    secret = json.loads(response['SecretString'])
    
    return secret

# Use credentials
creds = get_db_credentials()
connection = mysql.connect(
    host=creds['host'],
    user=creds['username'],
    password=creds['password'],
    database=creds['dbname']
)
```

### Step 3: Configure Automatic Rotation

**Enable rotation for RDS credentials:**
```bash
aws secretsmanager rotate-secret \
  --secret-id hsmart/prod/db \
  --rotation-lambda-arn arn:aws:lambda:ap-southeast-2:123456789012:function:SecretsManagerRDSMySQLRotation \
  --rotation-rules AutomaticallyAfterDays=30
```

**Rotation process:**
1. Create new password in Secrets Manager
2. Update RDS master user password
3. Test new credentials
4. Mark rotation complete

Application automatically uses new password on next retrieval.

### Step 4: Store API Keys

**Create secret for third-party API:**
```bash
aws secretsmanager create-secret \
  --name hsmart/prod/stripe-api-key \
  --secret-string '{"api_key": "sk_live_xxxxxxxxxxxxx"}'
```

**Retrieve in Lambda function:**
```python
def lambda_handler(event, context):
    client = boto3.client('secretsmanager')
    
    response = client.get_secret_value(SecretId='hsmart/prod/stripe-api-key')
    api_key = json.loads(response['SecretString'])['api_key']
    
    # Use API key
    stripe.api_key = api_key
    charge = stripe.Charge.create(...)
```

### Step 5: Grant IAM Permissions

**IAM policy for ECS task role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:ap-southeast-2:123456789012:secret:hsmart/prod/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": "arn:aws:kms:ap-southeast-2:123456789012:key/xxxxx"
    }
  ]
}
```

### Step 6: Monitor Secret Access

**CloudTrail logs track:**
- Who retrieved secrets (IAM user/role)
- When secrets were accessed
- Which secrets were retrieved

**CloudWatch alarm for unauthorized access:**
```text
Metric filter: { $.eventName = "GetSecretValue" && $.errorCode = "AccessDenied" }
Alarm: Trigger if unauthorized access attempts > 5 in 5 minutes
```

## What I Learned

- Secrets Manager encrypts secrets at rest with KMS
- Automatic rotation eliminates manual password updates
- Applications retrieve secrets dynamically (no hardcoded credentials)
- CloudTrail provides audit trail for compliance
- Cost: $0.40 per secret per month + $0.05 per 10,000 API calls

## Application to H-Smart

**Secrets to store:**
1. **Database credentials**: RDS, DynamoDB access
2. **API keys**: Stripe, SendGrid, AWS services
3. **OAuth tokens**: GitHub, Google, Facebook
4. **Encryption keys**: Data encryption, JWT signing
5. **Service passwords**: Redis, SMTP

**Best practices:**
- Use separate secrets for dev/staging/prod
- Enable automatic rotation for database credentials
- Grant least privilege IAM permissions
- Monitor secret access in CloudTrail
- Never commit secrets to Git repositories

## Reference Materials

- [What is Secrets Manager?](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
- [Rotating secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- [Best practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
