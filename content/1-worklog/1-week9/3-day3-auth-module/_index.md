---
title: "Day 3 - Authentication Module with JWT"
date: 2026-06-17
weight: 3
summary: "Built the authentication module with registration, login, refresh, logout, password reset support, and JWT-based session handling for the Travel Platform."
chapter: false
---

## Why I Did This

Authentication is the first real user-facing business feature in the Travel Platform backend. It defines how users sign up, log in, and keep their session active safely.

I focused on building this module in a way that is secure, predictable, and easy to extend later.

## Implementation Steps

### Step 1: Build Registration Flow

I implemented user registration with:

- Input validation
- Password hashing with bcrypt
- Duplicate email checks
- Secure persistence through Prisma

### Step 2: Build Login Flow

The login endpoint verifies the user credentials and returns:

- Access token
- Refresh token
- Basic profile data

The access token is short-lived, while the refresh token supports longer sessions.

### Step 3: Add Refresh Token Rotation

I set up refresh token rotation so old tokens are replaced after use. This reduces the impact of a stolen token and makes session handling safer.

### Step 4: Add Logout and Password Reset Support

The module also includes the session cleanup and recovery endpoints needed for real usage:

- Logout invalidates the refresh token
- Forgot password triggers a reset flow
- Reset password applies the new password securely

### Step 5: Define JWT Rules

I used a consistent token strategy:

- Access token for API authorization
- Refresh token for session renewal
- Expiration rules designed for a browser-based app

Example payload shape:

```ts
{
  sub: user.id,
  email: user.email,
  role: user.role
}
```

## Verification

- Confirm new users can register successfully.
- Confirm login returns valid tokens.
- Confirm refresh replaces the token rather than reusing the old one.
- Confirm logout prevents further token use.
- Confirm password reset flow is wired to the user record.

## What I Learned

- Authentication is mostly about careful edge cases, not just signing tokens.
- Refresh token rotation is worth the extra logic.
- A secure auth flow depends on both data modeling and operational rules.

## Application to Travel Platform

This module becomes the security foundation for the rest of the backend. Once auth is stable, the app can safely support user-owned features like places, reviews, and trips.

