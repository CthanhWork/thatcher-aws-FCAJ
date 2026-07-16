---
title: "Production UI Evidence"
weight: 3
date: 2026-07-16
---

## Public Production Check

On 16 July 2026, the public frontend at
[travel.thatcherdev.id.vn](https://travel.thatcherdev.id.vn) was opened and
checked without creating or changing any user data.

The homepage presented the expected TravelPlatform journey: discovering places,
saving favourites, planning trips, booking services, and sharing reviews.

![TravelPlatform homepage](/images/project-evidence/travel-home-2026-07-16.png)

## Browsing Evidence

The Places page loaded search and category controls and returned **301 places**.
The visible results included hotels, restaurants, attractions, and tours across
Vietnamese destinations.

![TravelPlatform places list](/images/project-evidence/travel-places-2026-07-16.png)

## Destination Detail Evidence

The Datanla Fall detail page loaded with a five-photo gallery, rating and review
count, price level, destination data, visit highlights, opening hours,
coordinates, and a booking-request form. The booking control correctly requires
sign-in before submission.

![Datanla Fall place detail](/images/project-evidence/travel-place-detail-2026-07-16.png)

## Scope of This Check

This evidence captures public, non-destructive checks only. Registration,
saved-place creation, bookings, trip changes, reviews, admin actions, and AWS
console checks should be demonstrated with a dedicated test account and the
appropriate AWS console access during the final recording.
