---
title: "Day 3 - Amazon ElastiCache for Redis Caching"
date: 2026-05-27
weight: 3
summary: "Practiced Amazon ElastiCache for Redis by creating a Redis cluster for session storage and database query caching, testing cache hit/miss performance improvements for H-Smart application."
chapter: false
---

## Why I Did This

Amazon ElastiCache for Redis provides a fully managed in-memory data store for caching frequently accessed data and reducing database load.

**Benefits:**
- **Sub-millisecond latency**: 10-100x faster than database queries
- **Reduced database load**: Cache hit rates of 80-90% typical
- **Session storage**: Centralized session data for stateless applications
- **Real-time analytics**: Fast counters, leaderboards, rate limiting

For H-Smart: Product catalog caching, user session storage, shopping cart data.

## Implementation Steps

### Step 1: Create Redis Cluster

**Cluster configuration:**
```text
Cluster name: h-smart-redis
Engine: Redis 7.0
Node type: cache.t3.micro (for testing)
Number of replicas: 1 (for high availability)
Multi-AZ: Enabled
Subnet group: Private subnets in H-smart-VPC
Security group: Allow port 6379 from application tier
```

**Using AWS CLI:**
```bash
aws elasticache create-replication-group \
  --replication-group-id h-smart-redis \
  --replication-group-description "H-Smart Redis cluster" \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-clusters 2 \
  --automatic-failover-enabled
```

Cluster creation takes 5-10 minutes.

### Step 2: Get Redis Endpoint

```bash
aws elasticache describe-replication-groups \
  --replication-group-id h-smart-redis
```

**Primary endpoint:**
```text
h-smart-redis.xxxxx.cache.amazonaws.com:6379
```

### Step 3: Connect to Redis from Application

**Python example with redis-py:**
```python
import redis
import json

# Connect to Redis
r = redis.Redis(
    host='h-smart-redis.xxxxx.cache.amazonaws.com',
    port=6379,
    decode_responses=True
)

# Test connection
r.ping()  # Returns True if connected
```

### Step 4: Implement Cache-Aside Pattern

**Cache product data:**
```python
def get_product(product_id):
    cache_key = f"product:{product_id}"
    
    # Try cache first
    cached_data = r.get(cache_key)
    if cached_data:
        print("Cache HIT")
        return json.loads(cached_data)
    
    # Cache miss - fetch from database
    print("Cache MISS - fetching from database")
    product = db.query(f"SELECT * FROM products WHERE id = {product_id}")
    
    # Store in cache with TTL (1 hour)
    r.setex(cache_key, 3600, json.dumps(product))
    
    return product
```

**Performance comparison:**
```text
Without cache: 50-100ms per request (database query)
With cache hit: 1-5ms per request (Redis lookup)
95% improvement in response time
```

### Step 5: Session Storage

**Store user session:**
```python
def create_session(user_id, session_data):
    session_id = generate_session_id()
    session_key = f"session:{session_id}"
    
    # Store session with 30-minute TTL
    r.setex(
        session_key,
        1800,
        json.dumps({
            'user_id': user_id,
            'login_time': time.time(),
            'preferences': session_data
        })
    )
    
    return session_id

def get_session(session_id):
    session_key = f"session:{session_id}"
    session_data = r.get(session_key)
    
    if session_data:
        # Extend session TTL on activity
        r.expire(session_key, 1800)
        return json.loads(session_data)
    
    return None  # Session expired
```

### Step 6: Shopping Cart with Redis

**Cart operations:**
```python
def add_to_cart(user_id, product_id, quantity):
    cart_key = f"cart:{user_id}"
    r.hset(cart_key, product_id, quantity)
    r.expire(cart_key, 86400)  # 24 hour TTL

def get_cart(user_id):
    cart_key = f"cart:{user_id}"
    return r.hgetall(cart_key)

def remove_from_cart(user_id, product_id):
    cart_key = f"cart:{user_id}"
    r.hdel(cart_key, product_id)
```

### Step 7: Monitor Cache Performance

**CloudWatch metrics:**
- `CacheHitRate`: Percentage of requests served from cache
- `CurrConnections`: Number of client connections
- `CPUUtilization`: Redis node CPU usage
- `NetworkBytesIn/Out`: Data transfer

**Target metrics:**
- Cache hit rate: > 80%
- CPU utilization: < 70%
- Evictions: Near zero (increase cache size if high)

## What I Learned

- ElastiCache provides sub-millisecond latency for frequently accessed data
- Cache-aside pattern: Application checks cache first, then database on miss
- Session storage in Redis enables stateless application servers
- TTL (Time To Live) automatically expires stale cache entries
- Multi-AZ replication provides high availability for cache layer
- Monitoring cache hit rate is critical for optimizing performance

## Application to H-Smart

**Use cases:**
1. **Product catalog**: Cache product details to reduce database queries
2. **User sessions**: Store session data centrally for horizontal scaling
3. **Shopping cart**: Fast cart updates without database writes
4. **Rate limiting**: Track API request counts per user/IP
5. **Leaderboards**: Real-time ranking for promotions or gamification

**Cache strategy for H-Smart:**
- Product data: 1 hour TTL (updated frequently)
- User profiles: 30 minutes TTL
- Static content: 24 hours TTL
- Session data: 30 minutes with activity extension

## Reference Materials

- [What is ElastiCache for Redis?](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html)
- [Creating a Redis cluster](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Clusters.Create.html)
- [Caching best practices](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/BestPractices.html)
