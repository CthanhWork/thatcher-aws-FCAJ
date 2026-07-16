---
title: "Prepare the Application"
weight: 1
---

From the project root, install backend dependencies, compile TypeScript, and generate the Prisma client:

```powershell
cd backend
npm install
npm run build
npx prisma generate
```

The generated Prisma Client confirms that the database access layer is ready for the compiled API package.

![Prisma Client generated successfully](../../../images/5-Workshop/travel-platform/prisma-generate.png)

## Local Runtime Check

Before publishing an artifact, the backend can be started locally to verify that the HTTP server is reachable. In local development, the application can fall back to in-memory behavior when a local Redis instance is unavailable.

![Local backend runtime check with Redis fallback](../../../images/5-Workshop/travel-platform/12-backend-build.png)

Confirm that the compiled output, Prisma files, and production `package.json` are ready for the Lambda package. If dependencies or Prisma binaries changed, rebuild the Lambda layer as well.

```powershell
npm install --production
Compress-Archive -Path node_modules -DestinationPath layer.zip -Force
```

Keep the application package focused on compiled code and required runtime assets. This reduces upload time and makes deployment behavior predictable.
