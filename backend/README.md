# Backend Service (NestJS + Prisma + SQLite)

## Overview
Backend API for Meal Magic Delivery.

Main responsibilities:
- shops, categories, products retrieval
- coupon validation
- order creation and order history search
- paginated responses for list endpoints

## Stack
- NestJS
- Prisma ORM
- SQLite
- Swagger/OpenAPI (`/api`)

## Local Run
```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run start:dev
```

## Environment Variables
Use `.env` (based on `.env.example`):

```env
DATABASE_URL=file:./dev.db
FRONTEND_URL=http://localhost:5173
PORT=3000
```

## Build
```bash
npm run build
npm run start:prod
```

## API Endpoints
- `GET /shops`
- `GET /categories`
- `GET /products`
- `GET /products/:id`
- `GET /coupons?page=1&limit=6`
- `GET /coupons/all?page=1&limit=20`
- `GET /coupons/validate/:code`
- `POST /orders`
- `GET /orders/search?email=...&phone=...&page=1&limit=6`

Swagger UI:
- `http://localhost:3000/api`

## Pagination Contract
Paginated endpoints return:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "limit": 6,
  "totalPages": 0,
  "hasMore": false
}
```

## Docker
### Build backend image
```bash
docker build -t meal-magic-backend ./backend
```

### Run backend container
```bash
docker run --rm -p 3000:3000 -e DATABASE_URL=file:./dev.db -e FRONTEND_URL=http://localhost:8080 meal-magic-backend
```

### Run full stack with Docker Compose (recommended)
From repository root:
```bash
docker compose up --build
```

## Hosting / Deployment
Recommended options:
- Render (Docker service)
- Railway (Dockerfile)
- Fly.io (Dockerfile)
- VPS with Docker Compose

Typical deployment flow:
1. Build and publish backend image from `backend/Dockerfile`.
2. Set environment variables (`DATABASE_URL`, `FRONTEND_URL`, `PORT`).
3. Expose port `3000`.
4. Run startup command that applies schema and seeds data (`prisma db push` + `prisma:seed`) if needed.
