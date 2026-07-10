---
title: "Day 2 - Bookings Module"
date: 2026-06-30
weight: 2
summary: "Implemented booking creation, status management, cancellation, and owner booking views."
chapter: false
---

## Why I Did This

Bookings are the core transaction in the Business & Bookings module. They let customers reserve services and let owners manage demand.

## Implementation Steps

### Step 1: Build Booking Lifecycle

I defined the main booking states and the endpoints to move between them.

### Step 2: Add Cancellation Handling

Cancellation checks make sure users can only cancel when the booking state allows it.

### Step 3: Add Owner Views

Owners can view the bookings tied to their places and manage them from the backend.

## Verification

- Confirm booking creation works.
- Confirm status updates follow the allowed state flow.
- Confirm cancellation is blocked when it should be.

## What I Learned

- State machines keep booking logic predictable.
- Owner-facing views need different permissions from customer views.
- Validation is important around cancellation edge cases.

## Application to Travel Platform

This module gives the platform a real reservation workflow that can support production travel operations.
