---
title: "Day 3 - Reviews Module with Rating Calculation"
date: 2026-06-24
weight: 3
summary: "Built the Reviews module with star ratings, average rating calculation, helpful votes, and owner replies."
chapter: false
---

## Why I Did This

Reviews give the Travel Platform trust and feedback signals. They also feed the average rating shown on place pages.

## Implementation Steps

### Step 1: Build Review CRUD

I implemented create, read, update, and delete behavior for user reviews.

### Step 2: Calculate Average Rating

Whenever reviews change, the place rating is recalculated so the displayed score stays accurate.

### Step 3: Track Helpful Votes

Helpful votes are stored with Redis to avoid duplicate voting within the TTL window.

### Step 4: Support Owner Replies

Business owners can respond to reviews to keep the conversation visible and useful.

## Verification

- Confirm ratings update when reviews change.
- Confirm duplicate helpful votes are blocked.
- Confirm owners can reply to reviews.

## What I Learned

- Aggregate values are easy to get wrong if they are not centralized.
- Redis is useful for short-lived voting state.
- Review data needs both moderation and response paths.

## Application to Travel Platform

This module gives the platform credibility and provides signals for search ranking and trip planning later on.
