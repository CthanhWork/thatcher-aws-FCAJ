---
title: "Day 4 - S3 Static Website Hosting with CloudFront CDN"
date: 2026-05-07
weight: 4
summary: "Practiced S3 static website hosting by configuring bucket policy for public read access, uploading HTML/CSS/JS files, and setting up CloudFront distribution for global content delivery with HTTPS."
chapter: false
---

## Why I Did This

This task practiced using Amazon S3 for static website hosting combined with CloudFront CDN to deliver content globally with low latency and HTTPS support.

Static websites (HTML, CSS, JavaScript, images) can be hosted directly on S3 without needing web servers, load balancers, or compute instances. This architecture offers:

- **Serverless simplicity**: No EC2 instances to manage or patch
- **Unlimited scalability**: S3 automatically scales to handle any traffic volume
- **Low cost**: Pay only for storage and data transfer, no compute charges
- **High availability**: S3 provides 99.99% availability SLA
- **Global performance**: CloudFront caches content at edge locations worldwide

For H-Smart, S3 + CloudFront is ideal for:

- Marketing website and landing pages
- Documentation and help center
- Static assets for the main application (CSS, JS, images)
- Single-page applications (SPAs) built with React, Vue, or Angular

## Implementation Steps

### Step 1: Create S3 Bucket for Website Hosting

In the S3 console, I created a new bucket:

```text
Bucket name: h-smart-website-2026 (must be globally unique)
AWS Region:  ap-southeast-2 (Sydney)
```

**Block Public Access Settings:**

By default, S3 blocks all public access. For static website hosting, I disabled the block:

```text
Block all public access: Disabled (uncheck)
Acknowledge warning:     Yes
```

**Other settings:**
```text
Bucket Versioning:       Disabled (can be enabled for version history)
Default encryption:      SSE-S3
```

### Step 2: Enable Static Website Hosting

In the bucket settings, I opened the Properties tab and enabled Static Website Hosting:

```text
Static website hosting: Enable
Hosting type:          Host a static website
Index document:        index.html
Error document:        error.html
```

After enabling, S3 provides a website endpoint URL:

```text
http://h-smart-website-2026.s3-website-ap-southeast-2.amazonaws.com
```

This endpoint serves content over HTTP (not HTTPS). CloudFront will provide HTTPS support in the next step.

### Step 3: Create Bucket Policy for Public Read Access

To allow public read access to website files, I added a bucket policy.

In the bucket Permissions tab, I edited the Bucket Policy and added:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::h-smart-website-2026/*"
    }
  ]
}
```

This policy allows anyone (`"Principal": "*"`) to read (`s3:GetObject`) any object in the bucket.

**Important security note**: This policy makes all bucket content publicly accessible. For H-Smart, ensure that no sensitive data or credentials are uploaded to this bucket.

### Step 4: Upload Website Files

I created a simple HTML website for testing:

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>H-Smart - AI-Powered Business Solutions</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to H-Smart</h1>
        <p>AI-Powered Business Solutions</p>
    </header>
    <main>
        <section>
            <h2>Our Services</h2>
            <ul>
                <li>Intelligent Data Analytics</li>
                <li>Business Process Automation</li>
                <li>Predictive Modeling</li>
            </ul>
        </section>
    </main>
    <footer>
        <p>&copy; 2026 H-Smart. Hosted on AWS S3 + CloudFront.</p>
    </footer>
    <script src="app.js"></script>
</body>
</html>
```

**style.css:**
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}
header {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 2rem;
}
main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
}
footer {
    text-align: center;
    padding: 1rem;
    background-color: #333;
    color: white;
    margin-top: 2rem;
}
```

**app.js:**
```javascript
console.log('H-Smart website loaded successfully from S3 + CloudFront');
```

**error.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Page Not Found - H-Smart</title>
</head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/">Return to home</a>
</body>
</html>
```

I uploaded these files to the S3 bucket root using the S3 console or AWS CLI:

```bash
aws s3 cp index.html s3://h-smart-website-2026/
aws s3 cp style.css s3://h-smart-website-2026/
aws s3 cp app.js s3://h-smart-website-2026/
aws s3 cp error.html s3://h-smart-website-2026/
```

### Step 5: Verify S3 Website Endpoint

I tested the S3 website endpoint in a browser:

```text
http://h-smart-website-2026.s3-website-ap-southeast-2.amazonaws.com
```

Expected result: The H-Smart homepage loads with styling and JavaScript functioning correctly.

This confirms that S3 static website hosting is working, but the site is only accessible via HTTP (not HTTPS) and has no global CDN caching.

### Step 6: Create CloudFront Distribution

To add HTTPS support and global content delivery, I created a CloudFront distribution.

In the CloudFront console, I created a new distribution:

**Origin Settings:**
```text
Origin domain: h-smart-website-2026.s3-website-ap-southeast-2.amazonaws.com
Name:          h-smart-s3-origin
Protocol:      HTTP only (S3 website endpoints only support HTTP)
```

**Important**: Use the S3 **website endpoint** (not the REST API endpoint) as the origin. The website endpoint format is:

```text
bucket-name.s3-website-region.amazonaws.com
```

Not:

```text
bucket-name.s3.region.amazonaws.com
```

**Default Cache Behavior:**
```text
Viewer protocol policy:  Redirect HTTP to HTTPS
Allowed HTTP methods:    GET, HEAD
Cache policy:            CachingOptimized (recommended default)
```

**Settings:**
```text
Price class:             Use all edge locations (best performance)
Default root object:     index.html
```

**Optional: Custom Domain and SSL Certificate**

For production, I would configure:
- Alternate domain names (CNAMEs): `www.h-smart.com`, `h-smart.com`
- Custom SSL certificate: Request free certificate from AWS Certificate Manager (ACM)

For this lab, I used the default CloudFront domain.

After creating the distribution, CloudFront provides a domain name:

```text
d1234abcdef.cloudfront.net
```

The distribution status shows `Deploying` and takes 5-15 minutes to propagate to all edge locations worldwide.

### Step 7: Test CloudFront Distribution

Once the distribution status changed to `Deployed`, I tested the CloudFront URL:

```text
https://d1234abcdef.cloudfront.net
```

Expected result:
- The H-Smart homepage loads successfully
- The connection uses HTTPS (secure)
- Content is served from the nearest CloudFront edge location

To verify caching behavior, I checked the HTTP response headers:

```text
X-Cache: Hit from cloudfront (cached content)
Age: 120 (content has been cached for 120 seconds)
```

This confirms that CloudFront is caching content at edge locations, reducing latency for global users.

### Step 8: Test Cache Invalidation

When website files are updated in S3, CloudFront continues serving cached versions until the TTL expires. To force immediate updates, I created a cache invalidation.

In the CloudFront console, I opened the distribution and created an invalidation:

```text
Object paths: /*
```

This invalidates all cached content across all edge locations. Within 1-2 minutes, CloudFront fetches fresh content from the S3 origin.

**Cost note**: The first 1,000 invalidation paths per month are free. Additional paths are charged, so minimize invalidations in production.

## What I Learned

- S3 static website hosting is a serverless solution for hosting HTML, CSS, and JavaScript sites without EC2 instances.
- S3 website endpoints use the format `bucket-name.s3-website-region.amazonaws.com` and only support HTTP.
- Bucket policies control public access: `s3:GetObject` for `Principal: "*"` allows public read.
- CloudFront adds HTTPS support and caches content at edge locations worldwide for low-latency delivery.
- CloudFront distributions use S3 website endpoints as origins (not REST API endpoints) to support index document and error document behavior.
- Redirect HTTP to HTTPS viewer protocol policy ensures all visitors use secure connections.
- Cache invalidations force CloudFront to fetch fresh content from S3 before TTL expiry.
- Custom domains require ACM certificates and Route 53 DNS configuration.

## Evidence and Verification

### Verification Checklist

- Confirm that an S3 bucket is created with Block Public Access disabled.
- Confirm that Static Website Hosting is enabled with `index.html` as the index document.
- Confirm that a bucket policy allows `s3:GetObject` for `Principal: "*"`.
- Confirm that `index.html`, `style.css`, `app.js`, and `error.html` are uploaded to the bucket.
- Confirm that the S3 website endpoint loads the homepage correctly over HTTP.
- Confirm that a CloudFront distribution is created with the S3 website endpoint as the origin.
- Confirm that the CloudFront distribution uses "Redirect HTTP to HTTPS" viewer protocol policy.
- Confirm that the CloudFront domain loads the homepage correctly over HTTPS.
- Confirm that HTTP response headers show `X-Cache: Hit from cloudfront` after the first request.
- Confirm that cache invalidation successfully updates content across edge locations.

## Challenges and Troubleshooting

- Challenge 1: S3 website endpoint returned 403 Forbidden error.
  Resolution: I verified the bucket policy was correctly applied with `s3:GetObject` permission for `Principal: "*"`. I also confirmed that Block Public Access was disabled at the bucket level.

- Challenge 2: CloudFront returned 404 errors for the homepage.
  Resolution: I set the Default Root Object to `index.html` in the CloudFront distribution settings. Without this setting, accessing the CloudFront domain root does not automatically serve `index.html`.

- Challenge 3: CloudFront served stale content after uploading new files to S3.
  Resolution: I created a cache invalidation for `/*` to force CloudFront to fetch fresh content. In production, I would use versioned filenames (e.g., `style.v2.css`) to avoid invalidation costs.

- Challenge 4: CloudFront distribution showed AccessDenied error.
  Resolution: I verified that I was using the S3 **website endpoint** (`s3-website-region.amazonaws.com`) as the origin, not the REST API endpoint (`s3.region.amazonaws.com`). Website endpoints correctly handle index and error documents.

## Application to H-Smart

S3 + CloudFront static website hosting is ideal for several H-Smart use cases:

1. **Marketing website**: H-Smart's public-facing marketing site can be hosted on S3 with CloudFront for global performance and HTTPS support, eliminating server management overhead.

2. **Single-page applications (SPAs)**: React or Vue frontend applications can be built and deployed to S3, with CloudFront serving the bundled assets globally.

3. **Static assets for dynamic applications**: Even if H-Smart uses server-side rendering or APIs, static assets (CSS, JS, images) can be offloaded to S3 + CloudFront to reduce load on application servers.

4. **Documentation and help center**: Product documentation can be generated as static HTML (e.g., using Hugo or MkDocs) and deployed to S3 for fast, reliable access.

5. **Cost optimization**: Serving static content from S3 + CloudFront is significantly cheaper than running EC2 instances 24/7 for a static website.

The recommended next step is to configure a custom domain (e.g., `www.h-smart.com`) using Route 53 and ACM certificate, and implement a CI/CD pipeline to automatically deploy website updates from a Git repository to S3.

## Reference Materials

- [Hosting a static website on S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [What is Amazon CloudFront?](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [Website access permissions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html)
