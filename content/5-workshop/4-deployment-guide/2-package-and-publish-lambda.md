---
title: "Package and Publish Lambda"
weight: 2
---

## Create the Function Artifact

```powershell
cd backend
Compress-Archive -Path dist,prisma,package.json -DestinationPath function.zip -Force
```

## Upload and Update

Replace the placeholders with the target account resources:

```powershell
aws s3 cp function.zip s3://ARTIFACT_BUCKET/function.zip --region ap-southeast-2
aws lambda update-function-code `
  --function-name travel-platform-api `
  --s3-bucket ARTIFACT_BUCKET `
  --s3-key function.zip `
  --region ap-southeast-2
```

Wait for the update to reach `Successful` before changing configuration or sending test traffic. Publish a new layer version only when dependencies or Prisma binaries change; plain TypeScript code changes only require the function artifact update.

```powershell
aws lambda get-function-configuration `
  --function-name travel-platform-api `
  --query 'LastUpdateStatus' `
  --output text
```
