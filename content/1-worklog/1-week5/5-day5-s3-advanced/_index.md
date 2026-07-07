---
title: "Day 5 - Advanced S3 Features and Static Website Hosting"
date: 2026-05-22
weight: 5
summary: "Explored advanced S3 features including static website hosting, versioning, lifecycle policies, event notifications with Lambda, and cross-region replication for disaster recovery."
chapter: false
---

## Why I Did This

S3 provides powerful features beyond basic object storage. For the travel platform, S3 can host the frontend website, trigger Lambda functions on file uploads, implement versioning for data protection, and automatically archive old data to reduce costs.

## Implementation Steps

### Step 1: Enable S3 Static Website Hosting

**Create bucket for website:**

1. **S3 Console** → **Create bucket**
2. **Bucket name**: `travel-platform-frontend` (must be globally unique)
3. **Region**: ap-southeast-1
4. **Block all public access**: Uncheck (for public website)
5. **Acknowledge** public access warning
6. **Create bucket**

**Enable static website hosting:**

1. Select bucket → **Properties** tab
2. **Static website hosting** → **Edit**
3. **Static website hosting**: Enable
4. **Hosting type**: Host a static website
5. **Index document**: `index.html`
6. **Error document**: `error.html`
7. **Save changes**

**Add bucket policy for public read:**

1. **Permissions** tab → **Bucket policy** → **Edit**
2. **Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::travel-platform-frontend/*"
    }
  ]
}
```

3. **Save changes**

**Upload website files:**

`index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Travel Platform</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    h1 { text-align: center; }
    .search-box {
      background: white;
      padding: 30px;
      border-radius: 10px;
      color: #333;
      margin: 20px 0;
    }
    input, button {
      padding: 10px;
      margin: 5px;
      font-size: 16px;
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>🌍 Travel Platform</h1>
  <div class="search-box">
    <h2>Find Your Next Adventure</h2>
    <input type="text" id="destination" placeholder="Destination">
    <input type="date" id="date">
    <button onclick="search()">Search</button>
  </div>
  <script>
    function search() {
      const dest = document.getElementById('destination').value;
      const date = document.getElementById('date').value;
      alert(`Searching for ${dest} on ${date}`);
    }
  </script>
</body>
</html>
```

**Upload file:**

```bash
aws s3 cp index.html s3://travel-platform-frontend/ --acl public-read
```

**Access website:**
```
http://travel-platform-frontend.s3-website-ap-southeast-1.amazonaws.com
```

### Step 2: Enable S3 Versioning

**Why versioning:**
- Protect against accidental deletions
- Recover from unintended overwrites
- Maintain history of changes

**Enable versioning:**

1. **S3 Console** → Select bucket
2. **Properties** → **Bucket Versioning** → **Edit**
3. **Bucket Versioning**: Enable
4. **Save changes**

**Test versioning:**

```bash
# Upload v1
echo "Version 1" > test.txt
aws s3 cp test.txt s3://travel-platform-frontend/

# Upload v2
echo "Version 2" > test.txt
aws s3 cp test.txt s3://travel-platform-frontend/

# List versions
aws s3api list-object-versions --bucket travel-platform-frontend --prefix test.txt
```

**Restore previous version:**

1. **S3 Console** → Select object → **Versions**
2. Select older version → **Download** or **Restore**

### Step 3: Create Lifecycle Policy

**Automatically transition objects to cheaper storage:**

1. **Management** tab → **Lifecycle rules** → **Create lifecycle rule**
2. **Rule name**: `ArchiveOldFiles`
3. **Rule scope**: Apply to all objects
4. **Lifecycle rule actions**:
   - ✓ Transition current versions
   - ✓ Transition noncurrent versions
   - ✓ Expire noncurrent versions
5. **Next**

**Transitions:**

```text
Day 0-29:     S3 Standard (frequent access)
Day 30-89:    S3 Standard-IA (infrequent access)
Day 90-179:   S3 Glacier Instant Retrieval
Day 180+:     S3 Glacier Deep Archive

Noncurrent versions:
- Delete after 30 days
```

**Configuration:**

- Transition current versions to S3 Standard-IA: 30 days
- Transition current versions to Glacier: 90 days
- Permanently delete noncurrent versions: 30 days

6. **Create rule**

### Step 4: Configure S3 Event Notifications with Lambda

**Create Lambda function for image processing:**

```javascript
import { S3 } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3();

export const handler = async (event) => {
  console.log('S3 Event:', JSON.stringify(event, null, 2));
  
  // Parse S3 event
  const record = event.Records[0];
  const bucketName = record.s3.bucket.name;
  const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
  const eventName = record.eventName;
  
  console.log(`Event: ${eventName}`);
  console.log(`Bucket: ${bucketName}`);
  console.log(`Key: ${objectKey}`);
  console.log(`Size: ${record.s3.object.size} bytes`);
  
  // Check if image file
  if (objectKey.match(/\.(jpg|jpeg|png|gif)$/i)) {
    console.log('Image detected, processing...');
    
    // Mock image processing (replace with Sharp library)
    console.log('- Generating thumbnail');
    console.log('- Optimizing image quality');
    console.log('- Extracting metadata');
    
    // In real implementation:
    // 1. Get object from S3
    // 2. Process with Sharp (resize, optimize)
    // 3. Upload processed image to S3
  } else {
    console.log('Not an image file, skipping');
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Processed successfully' })
  };
};
```

**Configure S3 event notification:**

1. **S3 bucket** → **Properties** → **Event notifications** → **Create event notification**
2. **Event name**: `ImageUploadTrigger`
3. **Event types**:
   - ✓ All object create events (s3:ObjectCreated:*)
4. **Destination**: Lambda function
5. **Lambda function**: `ProcessImageUploadFunction`
6. **Save changes**

**Grant S3 permission to invoke Lambda:**

Lambda resource-based policy is automatically added.

**Test upload:**

```bash
aws s3 cp photo.jpg s3://travel-platform-frontend/uploads/photo.jpg
```

Check Lambda CloudWatch Logs for event processing.

### Step 5: Enable S3 Transfer Acceleration

**For faster uploads from distant locations:**

1. **Properties** → **Transfer acceleration** → **Edit**
2. **Transfer acceleration**: Enabled
3. **Save changes**

**Use accelerated endpoint:**

```bash
aws s3 cp large-file.zip s3://travel-platform-frontend/ \
  --endpoint-url https://travel-platform-frontend.s3-accelerate.amazonaws.com
```

### Step 6: Configure S3 Cross-Region Replication

**For disaster recovery:**

**Create destination bucket:**

```bash
aws s3 mb s3://travel-platform-frontend-backup --region us-east-1
```

**Enable versioning on destination:**

```bash
aws s3api put-bucket-versioning \
  --bucket travel-platform-frontend-backup \
  --versioning-configuration Status=Enabled
```

**Create replication rule:**

1. **Management** → **Replication rules** → **Create replication rule**
2. **Rule name**: `ReplicateToUSEast`
3. **Status**: Enabled
4. **Source bucket**: All objects
5. **Destination**:
   - Bucket in this account
   - Bucket name: `travel-platform-frontend-backup`
   - Region: us-east-1
6. **IAM role**: Create new role
7. **Create rule**

### Step 7: Enable S3 Object Lock (Compliance)

**For immutable storage (regulatory compliance):**

1. Create new bucket with **Object Lock** enabled
2. **Properties** → **Object Lock** → **Edit**
3. **Default retention**: 
   - Mode: Compliance (cannot be deleted by anyone)
   - Period: 1 year
4. **Save**

## What I Learned

- S3 can host static websites without servers
- Versioning protects against accidental deletions
- Lifecycle policies reduce storage costs automatically
- S3 events trigger Lambda for real-time processing
- Transfer acceleration speeds up uploads globally
- Cross-region replication provides disaster recovery
- Object Lock ensures immutable storage for compliance

## Application to Travel Platform

**S3 bucket structure:**

```text
travel-platform-frontend/        (Static website)
├── index.html
├── css/
├── js/
└── assets/

travel-platform-uploads/         (User uploads)
├── images/                      (S3 event → Lambda)
├── documents/
└── avatars/

travel-platform-backups/         (Archived data)
├── database-exports/            (Lifecycle → Glacier)
└── logs/                        (Lifecycle → Delete)

travel-platform-dr/              (Cross-region replica)
└── (mirrors main bucket)
```

## Cost Optimization

**Storage class comparison:**

| Storage Class | Use Case | Cost/GB/month |
|--------------|----------|---------------|
| S3 Standard | Frequent access | $0.023 |
| S3 Standard-IA | Infrequent access (30+ days) | $0.0125 |
| S3 Glacier Instant | Archive with instant access | $0.004 |
| S3 Glacier Deep Archive | Long-term archive (180+ days) | $0.00099 |

**Lifecycle strategy:**
- 0-30 days: Standard (active bookings)
- 30-90 days: Standard-IA (recent history)
- 90+ days: Glacier (compliance archive)

## Reference Materials

- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [S3 Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [S3 Lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html)
