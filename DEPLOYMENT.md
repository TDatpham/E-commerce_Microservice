# Deployment Guide: Electronics Store

This guide explains how to deploy your microservices backend to **Render** and your Vite frontend to **Vercel**.

## 1. Backend Deployment (Render)

We have prepared a `render.yaml` file in the root of your project. This is a **Blueprint** that tells Render how to set up all your microservices at once.

### Prerequisites
- A GitHub repository containing your code.
- A MySQL database (Render provides PostgreSQL, but your app is configured for MySQL. You can use a provider like **Clever Cloud**, **Aiven**, or **Tessell** for a free MySQL database).

### Steps to Deploy
1. **Push your code** to GitHub.
2. Go to the [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will detect the `render.yaml` and list the services:
   - `discovery-service` (Eureka)
   - `api-gateway`
   - `product-service`
   - `user-service`
   - `order-service`
6. **Configure Environment Variables**:
   For `product-service`, `user-service`, and `order-service`, you need to set your MySQL connection details in the Render UI:
   - `SPRING_DATASOURCE_URL`: e.g., `jdbc:mysql://your-db-host:3306/electronics_db`
   - `SPRING_DATASOURCE_USERNAME`: your-db-user
   - `SPRING_DATASOURCE_PASSWORD`: your-db-password
7. **Deploy**. Render will build each service using the multi-stage `backend/Dockerfile`.

> [!NOTE]
> The **Discovery Service** (Eureka) should be deployed first. Once it's up, other services will register with it. We've used internal networking (`http://discovery-service:8761/eureka/`) so they talk to each other privately.

---

## 2. Frontend Deployment (Vercel)

The frontend is a Vite app and is ready for Vercel.

### Steps to Deploy
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. **Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (Root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   Add a new variable:
   - `VITE_API_URL`: Use the **Public URL** of your `api-gateway` from Render (e.g., `https://api-gateway-xyz.onrender.com/api`).
6. Click **Deploy**.

---

## 3. Important Notes

### Database Migration
Ensure your MySQL database allows connections from Render's IP addresses (or allow all `0.0.0.0/0` if you're using a cloud DB). The app is set to `ddl-auto=update`, so it will create tables automatically on first run.

### Kafka
The current configuration expects a Kafka broker at `kafka:9092`. If you don't have Kafka deployed on Render, you may need to:
1. Deploy a Kafka instance on Render/Confluent Cloud.
2. Update the `SPRING_KAFKA_BOOTSTRAP_SERVERS` variable in each service.

### Google OAuth
Remember to update your **Google Cloud Console** authorized redirect URIs to include your new Vercel frontend URL.

---

## Files Created/Updated
- `render.yaml`: Blueprint for Render services.
- `backend/Dockerfile`: Generic multi-stage Docker build for microservices.
- `vercel.json`: Routing configuration for Vercel (SPA support).
- `.env.production.example`: Template for frontend environment variables.
