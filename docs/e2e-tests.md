# E2E Test Guide

Last updated: 2026-03-29

## Where E2E Tests Are
- Playwright config: `frontend/playwright.config.ts`
- E2E specs folder: `frontend/e2e/`
- Example spec: `frontend/e2e/shop-flow.spec.ts`

## Prerequisites
- Node.js 20+
- Dependencies installed (`npm install` in repo root)
- Backend running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`

## Run E2E Tests
From `frontend/`:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test e2e/shop-flow.spec.ts
```

Run with headed browser:

```bash
npx playwright test --headed
```

Generate HTML report:

```bash
npx playwright test --reporter=html
```

## Suggested Full Local Flow
Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev:frontend
```

Terminal 3:
```bash
cd frontend
npx playwright test
```
