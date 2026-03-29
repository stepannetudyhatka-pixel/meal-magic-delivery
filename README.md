# Meal Magic Delivery

Web application for ordering food delivery.

## Completed Task Level
- Advanced (includes Base + Middle + Advanced requirements)

## Repository and Hosting
- GitHub repository: [https://github.com/stepannetudyhatka-pixel/meal-magic-delivery](https://github.com/stepannetudyhatka-pixel/meal-magic-delivery)
- Default public hosting URL: [https://meal-magic-delivery.vercel.app](https://meal-magic-delivery.vercel.app)

## Tech Stack
- `frontend/`: React + TypeScript + Vite
- `backend/`: NestJS + Prisma ORM + SQLite
- API docs: Swagger (`/api`)
- Architecture docs: C4 in [docs/C4.md](docs/c4.md)
- Containerization: Docker + Docker Compose
- Deployment config: root `vercel.json`

## Project Structure
```text
.
├─ frontend/
├─ backend/
├─ docs/
├─ docker-compose.yml
└─ vercel.json
```

## Prerequisites
- Node.js 20+ (or newer LTS)
- npm 10+

## Environment Variables
Create `frontend/.env.local`:

```bash
VITE_API_URL=http://localhost:3000
```

## Local Development
Install dependencies:

```bash
npm install
```

Initialize database and seed data:

```bash
npm run db:setup
```

Start backend:

```bash
npm run dev:backend
```

Start frontend:

```bash
npm run dev:frontend
```

## Build Instructions
Build all workspaces:

```bash
npm run build
```

Build backend only:

```bash
npm run build:backend
```

Build frontend only:

```bash
npm run build:frontend
```

## Test Instructions
Run tests (currently configured for frontend workspace):

```bash
npm test
```

## API and App URLs (Local)
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

## Docker
Run with Docker Compose:

```bash
docker compose up --build
```

Default Docker URLs:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`
