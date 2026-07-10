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

Deploy the resulting frontend through the selected hosting workflow, such as Vercel or AWS Amplify. Configure the deployed API domain as the only allowed CORS origin in API Gateway and Lambda configuration.

Before sharing the URL, test a real browser session. A successful build alone does not prove that browser CORS, token storage, and presigned S3 uploads work end to end.

![Travel Platform frontend home page](/images/5-Workshop/travel-platform/frontend-home.png)
