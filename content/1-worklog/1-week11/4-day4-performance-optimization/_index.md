---
title: "Day 4 - Performance Optimization"
date: 2026-07-02
weight: 4
summary: "Improved Lambda performance with connection reuse, indexing, and endpoint benchmarking."
chapter: false
---

## Why I Did This

Once the backend was complete, I wanted to make sure it remained fast enough for real usage.

## Implementation Steps

### Step 1: Reduce Cold Start Cost

I reviewed the Lambda runtime footprint and dependency shape to lower startup overhead.

### Step 2: Reuse Connections

Database and cache connections are reused where possible to avoid unnecessary setup work.

### Step 3: Add Useful Indexes

Indexes help the most common queries stay efficient as data grows.

### Step 4: Benchmark the API

I compared endpoint performance before and after the optimization pass.

## Verification

- Confirm startup time is lower after the optimization changes.
- Confirm connection reuse behaves correctly.
- Confirm benchmark results show improvement.

## What I Learned

- Small backend tweaks can have a big impact on serverless latency.
- Connection handling matters as much as query design.
- Benchmarking is the best way to prove the effect of optimization work.

## Application to Travel Platform

This keeps the completed backend responsive as traffic and data volume grow.
