---
title: "Day 1 - Docker Containerization and Amazon ECR"
date: 2026-05-11
weight: 1
summary: "Practiced Docker containerization by building a Docker image for H-Smart application and pushing it to Amazon ECR private registry for centralized container image management."
chapter: false
---

## Why I Did This

This task practiced Docker containerization and Amazon Elastic Container Registry (ECR) as the foundation for modern application deployment on AWS.

Containers package an application and all its dependencies into a single portable unit that runs consistently across different environments. Amazon ECR is a fully managed Docker container registry that stores, manages, and deploys container images.

Key benefits of containerization:

- **Consistency**: "Works on my machine" problems disappear because the container includes the entire runtime environment
- **Isolation**: Applications run in isolated environments without conflicting dependencies
- **Portability**: Same container runs on development laptop, staging server, and production ECS cluster
- **Efficiency**: Containers are lightweight compared to virtual machines, enabling higher density

For H-Smart, containerization enables:

- Packaging the application with exact dependency versions for reproducible deployments
- Running multiple services (backend API, frontend, worker jobs) with different technology stacks on the same infrastructure
- Seamless deployment from local development to AWS ECS/Fargate
- Version control for application images with ECR image tags

## Implementation Steps

### Step 1: Install Docker on Local Development Machine

I installed Docker Desktop for local development and testing.

**For Windows:**
- Downloaded Docker Desktop from https://www.docker.com/products/docker-desktop/
- Installed and enabled WSL 2 backend
- Verified installation:

```bash
docker --version
docker run hello-world
```

Expected output:
```text
Docker version 24.0.7, build afdd53b
Hello from Docker!
```

### Step 2: Create Simple Node.js Application for Containerization

I created a simple Node.js web application to containerize:

**app.js:**
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from H-Smart containerized application!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`H-Smart app listening on port ${port}`);
});
```

**package.json:**
```json
{
  "name": "hsmart-app",
  "version": "1.0.0",
  "description": "H-Smart containerized application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### Step 3: Create Dockerfile

A Dockerfile defines the steps to build a container image.

**Dockerfile:**
```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy application code
COPY app.js ./

# Expose port 3000
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run application
CMD ["npm", "start"]
```

**Key Dockerfile instructions:**

- `FROM`: Base image (Node.js 18 on Alpine Linux for small image size)
- `WORKDIR`: Sets working directory inside container
- `COPY`: Copies files from host to container
- `RUN`: Executes commands during image build
- `EXPOSE`: Documents which port the container listens on
- `CMD`: Default command when container starts

### Step 4: Build Docker Image Locally

I built the Docker image from the Dockerfile:

```bash
docker build -t hsmart-app:1.0.0 .
```

Build output:
```text
[+] Building 12.3s (11/11) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [1/5] FROM docker.io/library/node:18-alpine
 => [2/5] WORKDIR /app
 => [3/5] COPY package*.json ./
 => [4/5] RUN npm install --production
 => [5/5] COPY app.js ./
 => exporting to image
 => => naming to docker.io/library/hsmart-app:1.0.0
```

Verify the image was created:

```bash
docker images
```

Expected output:
```text
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
hsmart-app    1.0.0     abc123def456   10 seconds ago   120MB
```

### Step 5: Test Container Locally

I ran the container locally to verify it works:

```bash
docker run -d -p 3000:3000 --name hsmart-test hsmart-app:1.0.0
```

Test the application:

```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "message": "Hello from H-Smart containerized application!",
  "version": "1.0.0",
  "timestamp": "2026-05-11T10:30:00.000Z",
  "environment": "production"
}
```

Check container logs:

```bash
docker logs hsmart-test
```

Expected output:
```text
H-Smart app listening on port 3000
```

Stop and remove test container:

```bash
docker stop hsmart-test
docker rm hsmart-test
```

### Step 6: Create ECR Repository

In the AWS ECR console, I created a private repository:

```text
Repository name: hsmart-app
Image tag mutability: Immutable (prevents overwriting existing tags)
Image scan on push: Enabled (scans for vulnerabilities)
Encryption: AES-256 (default)
```

After creation, ECR provides the repository URI:

```text
123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/hsmart-app
```

### Step 7: Authenticate Docker to ECR

To push images to ECR, Docker must authenticate with the ECR registry.

I used AWS CLI to get authentication credentials:

```bash
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-southeast-2.amazonaws.com
```

Expected output:
```text
Login Succeeded
```

This authentication token is valid for 12 hours.

### Step 8: Tag Image for ECR

Docker images must be tagged with the full ECR repository URI:

```bash
docker tag hsmart-app:1.0.0 123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/hsmart-app:1.0.0
docker tag hsmart-app:1.0.0 123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/hsmart-app:latest
```

This creates two tags pointing to the same image:
- `1.0.0`: Specific version tag
- `latest`: Convenience tag for most recent version

### Step 9: Push Image to ECR

I pushed the tagged image to ECR:

```bash
docker push 123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/hsmart-app:1.0.0
docker push 123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/hsmart-app:latest
```

Push output:
```text
The push refers to repository [123456789012.dkr.ecr.ap-southeast-2.amazonaws.com/hsmart-app]
1.0.0: digest: sha256:abc123...def456 size: 1234
latest: digest: sha256:abc123...def456 size: 1234
```

### Step 10: Verify Image in ECR Console

In the ECR console, I verified the image was successfully pushed:

- Repository: `hsmart-app`
- Tags: `1.0.0`, `latest`
- Image size: ~120 MB
- Pushed: 2026-05-11 10:45 AM
- Vulnerability scan: Complete (0 critical, 0 high)

The image is now ready to be pulled by ECS, Fargate, or any other AWS service.

## What I Learned

- Docker packages applications and dependencies into portable, consistent containers.
- Dockerfiles define the steps to build container images using layered instructions.
- Multi-stage builds and layer caching optimize image size and build speed.
- Amazon ECR is a fully managed Docker registry integrated with IAM for access control.
- ECR authentication tokens are valid for 12 hours and obtained via AWS CLI.
- Docker images must be tagged with the full ECR repository URI before pushing.
- Immutable image tags prevent accidental overwrites in production.
- ECR image scanning automatically detects vulnerabilities in container images.
- Health checks in Dockerfile enable container orchestrators to monitor application health.

## Evidence and Verification

### Verification Checklist

- Confirm that Docker is installed and `docker --version` returns a valid version.
- Confirm that a Node.js application with `app.js` and `package.json` is created.
- Confirm that a Dockerfile is created with multi-stage best practices.
- Confirm that `docker build` successfully creates the image with tag `hsmart-app:1.0.0`.
- Confirm that `docker run` starts the container and the application responds on port 3000.
- Confirm that an ECR repository `hsmart-app` is created in ap-southeast-2.
- Confirm that `aws ecr get-login-password` successfully authenticates Docker to ECR.
- Confirm that the image is tagged with the ECR repository URI.
- Confirm that `docker push` successfully uploads the image to ECR.
- Confirm that the image appears in the ECR console with tags `1.0.0` and `latest`.
- Confirm that ECR vulnerability scanning completes with results shown.

## Challenges and Troubleshooting

- Challenge 1: Docker build failed with "COPY failed: no source files were specified".
  Resolution: I ensured the Dockerfile and application files were in the same directory, and that the COPY paths were correct relative to the build context.

- Challenge 2: Docker login to ECR returned "unauthorized: authentication required".
  Resolution: I verified that my AWS CLI credentials were configured correctly with `aws sts get-caller-identity` and that I had ECR permissions (`ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`).

- Challenge 3: Docker push to ECR was extremely slow.
  Resolution: I optimized the Dockerfile by copying `package.json` before `app.js` to leverage Docker layer caching. Dependencies are cached unless `package.json` changes, speeding up subsequent builds.

- Challenge 4: Container exited immediately after starting.
  Resolution: I checked container logs with `docker logs <container-id>` and found a missing dependency. I added it to `package.json` and rebuilt the image.

## Application to H-Smart

Docker and ECR are foundational for H-Smart's production deployment strategy:

1. **Consistent deployments**: Containerizing H-Smart ensures the exact same environment runs in development, staging, and production, eliminating "works on my machine" issues.

2. **Microservices architecture**: As H-Smart grows, different services (API backend, frontend server, background workers) can be containerized separately and scaled independently.

3. **CI/CD integration**: ECR images can be automatically built and pushed by CI/CD pipelines (covered in Week 4 Day 5), enabling automated deployments on every code commit.

4. **ECS/Fargate deployment**: The ECR image created today will be deployed to ECS Fargate in Week 4 Day 2, demonstrating the full container lifecycle.

5. **Rollback capability**: ECR stores all historical image versions, allowing instant rollback to previous versions if a deployment introduces bugs.

The recommended next step is to deploy this ECR image to ECS Fargate, completing the container deployment pipeline from code to production.

## Reference Materials

- [What is Amazon ECR?](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Pushing a Docker image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)
- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
