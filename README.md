# 🚀 EC2 Deployment Guide

This guide explains how to prepare an AWS EC2 instance and deploy the application using Docker, Docker Compose, and GitHub Actions.

---

# Prerequisites

Before starting, ensure you have:

* An AWS Account
* An EC2 Ubuntu 22.04 LTS instance
* A configured Security Group
* An SSH key pair (.pem)
* Docker Hub account
* GitHub repository with GitHub Actions configured

---

# Step 1: Launch an EC2 Instance

Create an Ubuntu 22.04 LTS EC2 instance.

Configure the Security Group to allow:

| Port | Protocol | Purpose                |
| ---- | -------- | ---------------------- |
| 22   | TCP      | SSH                    |
| 80   | TCP      | HTTP                   |
| 443  | TCP      | HTTPS                  |
| 5000 | TCP      | Backend API (Optional) |

---

# Step 2: Connect to EC2

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

---

# Step 3: Update the Server

```bash
sudo apt update
sudo apt upgrade -y
```

---

# Step 4: Install Git

```bash
sudo apt install git -y

git --version
```

---

# Step 5: Install Docker

```bash
sudo apt install docker.io -y

sudo systemctl enable docker

sudo systemctl start docker

sudo usermod -aG docker $USER

newgrp docker
```

Verify installation:

```bash
docker --version
```

---

# Step 6: Install Docker Compose

```bash
sudo apt install docker-compose-plugin -y
```

Verify installation:

```bash
docker compose version
```

---

# Step 7: Clone the Repository

```bash
git clone https://github.com/<your-username>/<repository>.git

cd <repository>
```

---

# Step 8: Configure Environment Variables

Create the required environment file.

Example:

```bash
nano backend/.env
```

Add your production environment variables.

---

# Step 9: Verify Docker Compose

Ensure the production compose file uses Docker Hub images.

Example:

```yaml
services:
  backend:
    image: your-dockerhub-username/recipe-backend:latest

  frontend:
    image: your-dockerhub-username/recipe-frontend:latest
```

---

# Step 10: Deploy the Application

```bash
docker compose -f docker-compose.prod.yml pull

docker compose -f docker-compose.prod.yml up -d
```

---

# Step 11: Verify Running Containers

```bash
docker ps
```

---

# Step 12: View Container Logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

---

# Step 13: Updating the Application

Whenever new code is pushed to the **main** branch, GitHub Actions will automatically:

1. Build Docker images.
2. Push the images to Docker Hub.
3. Connect to the EC2 instance via SSH.
4. Pull the latest images.
5. Restart the application containers.

The deployment commands executed on the EC2 server are:

```bash
cd <repository>

git pull origin main

docker compose -f docker-compose.prod.yml pull

docker compose -f docker-compose.prod.yml up -d
```

---

# Useful Docker Commands

List running containers:

```bash
docker ps
```

List all containers:

```bash
docker ps -a
```

List Docker images:

```bash
docker images
```

Stop all containers:

```bash
docker compose down
```

Restart containers:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

---

# CI/CD Workflow

```text
Developer
     │
     ▼
Push Code to GitHub
     │
     ▼
GitHub Actions
     │
     ├── Checkout Repository
     ├── Build Backend Image
     ├── Build Frontend Image
     ├── Push Images to Docker Hub
     ├── Connect to EC2 (SSH)
     ├── Pull Latest Images
     └── Restart Docker Containers
     │
     ▼
AWS EC2
     │
     ▼
Docker Compose
     │
     ├── Frontend Container
     ├── Backend Container
     └── MongoDB Container
     │
     ▼
Application Available to Users
```

---

# Project Architecture

```text
Developer
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions (CI/CD)
      │
      ▼
Docker Hub
      │
      ▼
AWS EC2
      │
      ▼
Docker Compose
      │
 ┌────┴──────────┐
 │               │
 ▼               ▼
Frontend      Backend
                   │
                   ▼
               MongoDB
```

---

# Tech Stack

* AWS EC2
* Docker
* Docker Compose
* GitHub Actions
* Docker Hub
* MongoDB
* Node.js
* React
* Nginx (Optional)
