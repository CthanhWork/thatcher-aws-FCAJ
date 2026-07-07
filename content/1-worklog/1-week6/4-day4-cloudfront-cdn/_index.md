---
title: "Day 4 - CloudFront CDN for Global Content Delivery"
date: 2026-05-28
weight: 4
summary: "Practiced CloudFront CDN by configuring distributions with custom origins, implementing cache behaviors and TTL strategies for optimal global content delivery performance."
chapter: false
---

## Why I Did This

Amazon CloudFront is a content delivery network (CDN) that caches content at edge locations worldwide, reducing latency for global users.

**Benefits:**
- **Low latency**: Content served from nearest edge location (225+ locations)
- **Reduced origin load**: 80-90% of requests served from cache
- **HTTPS support**: Free SSL/TLS certificates via ACM
- **DDoS protection**: Integrated with AWS Shield

For H-Smart: Faster page loads, reduced server costs, improved user experience globally.

## Implementation Steps

### Step 1: Create CloudFront Distribution

**Origin configuration:**
```text
Origin: H-Smart-ECS-ALB-xxx.ap-southeast-2.elb.amazonaws.com
Protocol: HTTP only (or HTTPS if ACM certificate on ALB)
Origin path: / (optional path prefix)
```

**Cache behavior:**
```text
Path pattern: Default (*)
Viewer protocol: Redirect HTTP to HTTPS
Allowed HTTP methods: GET, HEAD, OPTIONS
Cache policy: CachingOptimized
```

**Distribution settings:**
```text
Price class: Use all edge locations (best performance)
Alternate domain names: www.hsmart.com (requires ACM certificate)
SSL certificate: Custom SSL certificate from ACM
Default root object: index.html
```

### Step 2: Configure Cache TTL Strategies

**Static assets (images, CSS, JS):**
```text
Path pattern: *.js, *.css, *.jpg, *.png
Min TTL: 86400 (1 day)
Max TTL: 31536000 (1 year)
Default TTL: 86400
```

**Dynamic API responses:**
```text
Path pattern: /api/*
Min TTL: 0
Max TTL: 60
Default TTL: 0
Cache based on query strings and headers
```

**HTML pages:**
```text
Path pattern: *.html
Min TTL: 0
Max TTL: 3600
Default TTL: 300 (5 minutes)
```

### Step 3: Implement Cache Invalidation

**Invalidate all objects:**
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234ABCDEF \
  --paths "/*"
```

**Invalidate specific paths:**
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234ABCDEF \
  --paths "/images/*" "/css/style.css"
```

**Cost note:** First 1000 invalidation paths per month are free.

### Step 4: Configure Custom Error Pages

**Error response configuration:**
```text
HTTP 403: Redirect to /403.html (TTL: 300s)
HTTP 404: Redirect to /404.html (TTL: 300s)
HTTP 500: Redirect to /500.html (TTL: 10s)
```

Improves user experience when errors occur.

### Step 5: Enable Access Logs

**Log configuration:**
```text
S3 bucket: h-smart-cloudfront-logs
Log prefix: cloudfront/
Include cookies: No
```

Logs track:
- Request timestamp, edge location, client IP
- Cache hit/miss status
- Response status codes
- Bytes transferred

### Step 6: Test Cache Performance

**Check cache status in response headers:**
```bash
curl -I https://d1234abcdef.cloudfront.net/

HTTP/2 200
x-cache: Hit from cloudfront
age: 1234
```

**Cache status values:**
- `Hit from cloudfront`: Request served from cache
- `Miss from cloudfront`: Request forwarded to origin
- `RefreshHit from cloudfront`: Cached object validated with origin

## What I Learned

- CloudFront caches content at 225+ edge locations worldwide
- TTL strategies balance freshness vs cache hit rate
- Cache invalidation forces immediate content updates
- Origin shield adds caching layer to reduce origin load
- Access logs provide visibility into traffic patterns
- Custom error pages improve user experience

## Application to H-Smart

**Use cases:**
1. **Static website**: Serve frontend from S3 via CloudFront
2. **API acceleration**: Cache API responses with short TTLs
3. **Media delivery**: Stream images and videos from edge locations
4. **Software downloads**: Distribute installers and updates globally

**Recommended cache strategy:**
```text
Static assets (JS/CSS/images): 1 year TTL with versioned filenames
HTML pages: 5 minute TTL
API responses: No cache or 60 second TTL
User-specific data: No cache (use query strings to bypass)
```

## Reference Materials

- [What is CloudFront?](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [Working with distributions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html)
- [Managing cache expiration](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
