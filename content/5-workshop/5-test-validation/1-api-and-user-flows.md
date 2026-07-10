---
title: "API and Core User Flows"
weight: 1
---

## Health Check

Call the API health route after every deployment:

```powershell
curl https://API_ID.execute-api.REGION.amazonaws.com/health
```

The response should return a successful status payload. If it fails, inspect the Lambda log stream before changing unrelated resources.

## Functional Validation

Use a test account and validate the completed modules:

| Flow | Expected result |
| --- | --- |
| Register and login | The API returns access and refresh tokens. |
| Browse and search places | Filtering and pagination return matching records. |
| Create or update a review | The review is persisted and the place rating is refreshed. |
| Create a trip | The itinerary stores day, order, and notes for each place. |
| Share a public trip | The shared link works without user authentication. |
| Create a booking | The booking follows the expected status workflow. |
| Upload a place image | The browser uploads through a short-lived S3 presigned URL. |

The project implementation was manually validated across all 43 API endpoints. Repeat the tests against your own environment after configuration or schema changes.
