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

Confirm that the compiled output, Prisma files, and production `package.json` are ready for the Lambda package. If dependencies or Prisma binaries changed, rebuild the Lambda layer as well.

```powershell
npm install --production
Compress-Archive -Path node_modules -DestinationPath layer.zip -Force
```

Keep the application package focused on compiled code and required runtime assets. This reduces upload time and makes deployment behavior predictable.
