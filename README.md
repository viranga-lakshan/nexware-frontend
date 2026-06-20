# NexWare Distribution Platform — Frontend

Production-grade Next.js 15 enterprise frontend for the NexWare Spring Boot API.

| Environment | Frontend | Backend API |
|-------------|----------|-------------|
| **Local** | http://localhost:3000 | http://localhost:8080/api/v1 |
| **Production** | Vercel (custom domain or `*.vercel.app`) | https://nexware.me/api/v1 |

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui-style components (Radix primitives)
- TanStack Query (server state) + Zustand (UI/session only)
- Axios, React Hook Form, Zod, TanStack Table, Recharts, Sonner

## Quick start (local)

```bash
cd nexware-frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 — backend must run at http://localhost:8080 (see `nexware-backend`).

### Demo credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@nexware.lk` | `Password123!` | ADMIN |
| `maya.fernando@nexware.lk` | `Password123!` | WAREHOUSE_MANAGER |
| `kasun.perera@nexware.lk` | `Password123!` | INVENTORY_STAFF |
| `nimali.wickramasinghe@nexware.lk` | `Password123!` | PROCUREMENT_OFFICER |

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | API base URL — production: `https://nexware.me/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Public frontend URL (for docs/links) |
| `NEXT_PUBLIC_APP_NAME` | Application title |
| `NEXT_PUBLIC_REALTIME_ENABLED` | Enable WebSocket sync (`false` by default) |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL when realtime is enabled |

## Deploy to Vercel

1. Import [github.com/viranga-lakshan/nexware-frontend](https://github.com/viranga-lakshan/nexware-frontend) in Vercel.
2. Set **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://nexware.me/api/v1` |
   | `NEXT_PUBLIC_APP_NAME` | `NexWare Distribution Platform` |
   | `NEXT_PUBLIC_REALTIME_ENABLED` | `false` |

3. Deploy. Optionally add a custom domain (e.g. `app.nexware.me`).

4. On the **backend EC2** `.env`, add your Vercel URL to CORS:

   ```env
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://app.nexware.me,http://localhost:3000
   ```

   Then restart: `docker compose up -d --build`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run typecheck` | TypeScript validation |
| `npm run lint` | ESLint |

## Docker (optional)

```bash
docker build -t nexware-frontend:latest \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://nexware.me/api/v1 .
docker run -p 3000:3000 nexware-frontend:latest
```

## Architecture

```
Backend (https://nexware.me/api/v1)
  → Axios (JWT + refresh) → TanStack Query → UI
Zustand → sidebar, theme, warehouse context (no API cache)
```

Feature folders under `src/features/{domain}/` with `api/`, `hooks/`, `components/`, `schemas/`.

## CI

GitHub Actions runs typecheck, lint, and build on every push/PR to `main` (`.github/workflows/ci.yml`).

## License

Proprietary — NexWare Distribution Platform.
