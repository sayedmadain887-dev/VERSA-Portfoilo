# VERSA Backend

Node.js + Express + MongoDB API. Admin-only — there is no public registration anywhere.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — a free MongoDB Atlas connection string, or a local MongoDB instance
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — generate with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your login credentials

## Create your admin account (run once)

```bash
node seedAdmin.js
```

This is the **only** way an admin account is ever created. There is no sign-up form, no public `/register` route, anywhere in this project.

## Run the server

```bash
npm run dev
```

API runs on `http://localhost:5000` by default.

## What's built so far

- `POST /api/auth/login` — admin login (rate-limited, account lockout after 5 failed attempts)
- `POST /api/auth/logout`
- `GET /api/auth/me` — current admin info
- `GET /api/finance/stats` — income/expense/profit totals, monthly breakdown, pending payments
- Full CRUD on `/api/finance/transactions`, `/api/finance/clients`, `/api/finance/categories`

Every `/api/finance/*` route requires a valid admin session — verified on the backend via `requireAdmin` middleware, not just hidden in the UI. There is no way to reach this data without logging in first.

## Next phases (per the original spec)

Projects, Services, Skills, About, Navigation, Contact Messages, Media Library, Site Settings, and SEO management will follow the same pattern: a Mongoose model, a controller, routes behind `requireAdmin`, and a matching dashboard page.
