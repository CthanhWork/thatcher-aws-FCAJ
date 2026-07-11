---
title: "Publish the Frontend"
weight: 4
---

Set the production API URL in the frontend environment file, then build the Next.js application:

```powershell
cd frontend
npm install
npm run build
```

Deploy the resulting frontend through Vercel and configure
`NEXT_PUBLIC_API_URL` with the API Gateway URL ending in `/api`.

The completed project uses the following public endpoints:

- Production frontend: [https://travel.thatcherdev.id.vn](https://travel.thatcherdev.id.vn)
- Places catalog: [https://travel.thatcherdev.id.vn/places](https://travel.thatcherdev.id.vn/places)
- Public source repository: [CthanhWork/travel-platform-aws](https://github.com/CthanhWork/travel-platform-aws)

The custom domain is configured as a CNAME through the Mắt Bão DNS service and
verified by Vercel. Vercel provisions the HTTPS certificate automatically after
DNS ownership verification.

Before sharing the URL, test a real browser session. For this deployment, the
domain root and `/places` both returned HTTP 200, registration and login were
verified against AWS, and the places page loaded 301 records with working search,
category filters, and pagination.

![Travel Platform frontend home page](/images/5-Workshop/travel-platform/frontend-home.png)
