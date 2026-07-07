---
title: "Day 3 - Amazon DynamoDB for NoSQL Data Storage"
date: 2026-05-13
weight: 3
summary: "Practiced Amazon DynamoDB by creating tables with partition and sort keys, performing CRUD operations, and querying with secondary indexes. Supplemented with lab06 from AWS Foundation video series on NoSQL database fundamentals."
chapter: false
---

## Why I Did This

This task practiced Amazon DynamoDB as a fully managed NoSQL database service for high-performance applications requiring single-digit millisecond latency at any scale.

DynamoDB is ideal for:
- Session storage and user profiles
- Real-time analytics and leaderboards
- IoT data streams
- Mobile and gaming applications

For H-Smart, DynamoDB enables storing product catalogs, user sessions, and activity logs with predictable performance.

## Lab06 - NoSQL Database Fundamentals

Before hands-on practice, I reviewed lab06 from the AWS Foundation video series covering:

- **NoSQL vs SQL**: NoSQL databases sacrifice ACID transactions for horizontal scalability and flexible schemas
- **Key-value data model**: DynamoDB stores items (rows) identified by primary keys
- **Partition and sort keys**: Partition key distributes data, sort key enables range queries
- **Indexes**: Global Secondary Indexes (GSI) and Local Secondary Indexes (LSI) enable alternate query patterns
- **Capacity modes**: On-demand (pay per request) vs Provisioned (reserve capacity)

## Implementation Steps

### Step 1: Create DynamoDB Table

Table configuration:
```text
Table name: H-Smart-Products
Partition key: ProductID (String)
Sort key: Category (String)
Capacity mode: On-demand (no capacity planning needed)
Encryption: AWS owned key
```

### Step 2: Add Sample Data

Sample items:
```json
{
  "ProductID": "PROD-001",
  "Category": "Electronics",
  "Name": "Wireless Mouse",
  "Price": 29.99,
  "Stock": 150,
  "Rating": 4.5
}
```

### Step 3: Perform CRUD Operations

Using AWS CLI:

```bash
# Create item
aws dynamodb put-item --table-name H-Smart-Products \
  --item '{"ProductID": {"S": "PROD-001"}, "Category": {"S": "Electronics"}, "Name": {"S": "Wireless Mouse"}, "Price": {"N": "29.99"}}'

# Read item
aws dynamodb get-item --table-name H-Smart-Products \
  --key '{"ProductID": {"S": "PROD-001"}, "Category": {"S": "Electronics"}}'

# Update item
aws dynamodb update-item --table-name H-Smart-Products \
  --key '{"ProductID": {"S": "PROD-001"}, "Category": {"S": "Electronics"}}' \
  --update-expression "SET Price = :price" \
  --expression-attribute-values '{":price": {"N": "27.99"}}'

# Delete item
aws dynamodb delete-item --table-name H-Smart-Products \
  --key '{"ProductID": {"S": "PROD-001"}, "Category": {"S": "Electronics"}}'
```

### Step 4: Create Global Secondary Index

GSI configuration:
```text
Index name: PriceIndex
Partition key: Category (String)
Sort key: Price (Number)
Projected attributes: All
```

This enables querying products by category sorted by price.

### Step 5: Query with GSI

```bash
aws dynamodb query --table-name H-Smart-Products \
  --index-name PriceIndex \
  --key-condition-expression "Category = :cat" \
  --expression-attribute-values '{":cat": {"S": "Electronics"}}' \
  --scan-index-forward false
```

Returns all Electronics products sorted by price descending.

## What I Learned

- DynamoDB is a fully managed NoSQL database with single-digit millisecond latency
- Partition key distributes data across partitions for horizontal scaling
- Sort key enables range queries within a partition
- GSI allows querying on alternate attributes without scanning entire table
- On-demand capacity mode eliminates capacity planning
- DynamoDB automatically scales to handle traffic spikes

## Application to H-Smart

DynamoDB is ideal for:
1. **Product catalog**: Fast lookups by ProductID
2. **User sessions**: Store session data with TTL for automatic expiration
3. **Activity logs**: High-throughput writes for user interactions
4. **Shopping cart**: Low-latency reads for real-time cart updates

## Reference Materials

- [What is DynamoDB?](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
- [Working with tables](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.html)
- [Secondary indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html)
- [AWS Foundation Video Series - Lab06](https://www.youtube.com/watch?v=AQlsd0nWdZk&list=PLahN4TLWtox2a3vElknwzU_urND8hLn1i)
