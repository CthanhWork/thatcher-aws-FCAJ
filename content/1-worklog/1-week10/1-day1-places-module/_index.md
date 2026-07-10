---
title: "Day 1 - Places Module with Search and Caching"
date: 2026-06-22
weight: 1
summary: "Built the Places module with CRUD, search filters, Redis caching, and view tracking for the Travel Platform."
chapter: false
---

## Why I Did This

The Places module is the first core business feature in Week 10. It gives users a way to discover and manage travel locations while keeping listings fast through Redis caching.

## Implementation Steps

### Step 1: Build CRUD Endpoints

I designed the module around the main lifecycle of a place:

- Create new places
- List places with pagination
- Read place details
- Update place records
- Delete place records

### Step 2: Add Search Filters

Search needed to support the main user-facing filters:

- Category
- City
- Price range
- Rating

### Step 3: Add Redis Caching

To reduce repeated database reads, I cached place listing and detail responses with a short TTL.

### Step 4: Track Views

Every place detail request updates the view counter so the platform can later surface popular places.

## Verification

- Confirm place CRUD routes return the expected responses.
- Confirm search filters narrow results correctly.
- Confirm cached responses are reused within the TTL window.
- Confirm view counts increase on reads.

## What I Learned

- Search and caching need to be designed together.
- A small TTL gives a good balance between freshness and speed.
- View tracking is easiest to maintain when it lives close to the read path.

## Application to Travel Platform

This module becomes the base layer for reviews, favorites, and trip planning in the rest of Week 10.
