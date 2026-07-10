---
title: "Day 3 - Admin Dashboard and Monitoring"
date: 2026-07-01
weight: 3
summary: "Built admin statistics views and set up CloudWatch logging and dashboard monitoring for the backend."
chapter: false
---

## Why I Did This

The backend needs observability so I can understand system health and admin-level usage patterns.

## Implementation Steps

### Step 1: Build Statistics Aggregation

I prepared the data flow for users, places, bookings, and revenue summaries.

### Step 2: Set Up CloudWatch Logs

Lambda logs are captured so operational issues can be diagnosed later.

### Step 3: Create Monitoring Dashboards

I planned a dashboard for API-level metrics and service health.

## Verification

- Confirm stats queries return the right aggregates.
- Confirm Lambda logs appear in CloudWatch.
- Confirm the dashboard layout is ready for production use.

## What I Learned

- Observability should be part of the app, not an afterthought.
- Aggregated admin metrics are useful for both operations and reporting.
- Dashboards are easier to maintain when the metrics are defined early.

## Application to Travel Platform

This work gives the team visibility into the health and usage of the finished backend.
