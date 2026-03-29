# Frontend App (React + TypeScript + Vite)

## Overview
Frontend client for Meal Magic Delivery.

Main pages:
- Shops and products
- Cart and checkout
- Order history
- Coupons

## Features
- responsive layout
- product filtering and sorting
- shop filtering by rating
- product pagination
- coupon list lazy loading
- order history lazy loading

## Local Run
npm install
npm run dev

Default app URL:
- http://localhost:5173

## Environment Variables
Create frontend/.env.local:
VITE_API_URL=http://localhost:3000

## Build
npm run build
npm run preview

## Docker
Build frontend image:
docker build -t meal-magic-frontend ./frontend

Run frontend container:
docker run --rm -p 8080:80 meal-magic-frontend

Run full stack with Docker Compose (from repository root):
docker compose up --build

## Hosting / Deployment
### Vercel (frontend)
The root vercel.json is configured for frontend/dist output.

Typical deployment:
1. Import repository into Vercel.
2. Keep root as project directory.
3. Confirm build/output from vercel.json.
4. Set VITE_API_URL to your deployed backend URL.
5. Deploy.

Default public URL:
- https://meal-magic-delivery.vercel.app

Repository:
- https://github.com/stepannetudyhatka-pixel/meal-magic-delivery
