---
title: "Day 4 - API Gateway Configuration"
date: 2026-06-18
weight: 4
summary: "Configured API Gateway for the Travel Platform REST API, connected Lambda proxy routes, enabled CORS, and prepared throttling and request validation."
chapter: false
---

## Why I Did This

Lambda by itself is not a public API surface. API Gateway gives the backend a stable HTTP layer, routes requests to Lambda, and adds cross-cutting controls such as CORS and throttling.

This day turns the authentication logic into something a browser client can actually call.

## Implementation Steps

### Step 1: Create REST API Routes

I mapped the authentication endpoints behind API Gateway:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Step 2: Enable Lambda Proxy Integration

Lambda proxy integration keeps the routing simple by passing the full request context into the function handler.

This is useful for:

- Request headers
- Query strings
- Path parameters
- Body payloads

### Step 3: Configure CORS

Because the frontend will call the API from a browser, I enabled CORS so the browser can accept the response safely.

Typical allowed settings:

- Origin: frontend domain
- Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Headers: `Content-Type`, `Authorization`

### Step 4: Prepare Rate Limiting

I documented a simple throttling target so the API can resist accidental abuse and noisy traffic:

- 100 requests per minute

### Step 5: Add Request Validation Plan

I planned request validation at the gateway or application level so bad input is rejected early.

## Verification

- Confirm each route points to the correct Lambda handler.
- Confirm browser requests pass CORS checks.
- Confirm preflight requests respond correctly.
- Confirm throttling settings are documented and ready for deployment.

## What I Learned

- API Gateway is the public contract for the backend.
- CORS needs to be planned before frontend integration begins.
- Proxy integration keeps early development flexible.

## Application to Travel Platform

This work makes the backend reachable from the frontend and prepares the API for safer production-style behavior once the app grows.

