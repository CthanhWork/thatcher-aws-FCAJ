---
title: "Day 2 - S3 Presigned URLs for Image Uploads"
date: 2026-06-23
weight: 2
summary: "Implemented secure image uploads using S3 presigned URLs and configured the bucket for browser-based uploads."
chapter: false
---

## Why I Did This

Places need images, but the browser should never upload files through the API server directly. Presigned URLs let the client upload safely to S3 without exposing long-lived credentials.

## Implementation Steps

### Step 1: Configure the Bucket

I prepared the S3 bucket with the required upload settings and CORS rules for browser access.

### Step 2: Generate Presigned Upload URLs

The backend returns a short-lived upload URL that the client can use for a single file upload.

### Step 3: Test the Client Flow

I verified the full flow from client request to S3 upload completion.

### Step 4: Keep the Upload Flow Secure

I enforced limited expiration and scoped the upload behavior to the intended place image workflow.

## Verification

- Confirm the bucket accepts browser uploads.
- Confirm presigned URLs expire as expected.
- Confirm uploaded files are reachable after a successful upload.

## What I Learned

- Presigned URLs are a clean boundary between app logic and file storage.
- S3 CORS details matter more than they first appear.
- Expiration handling is part of the security model, not just convenience.

## Application to Travel Platform

This makes it possible for places, trips, and reviews to share a secure media upload pattern later on.
