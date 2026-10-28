# Klick Pro

**Klick Pro** is a modern, high-performance marketplace platform connecting verified service professionals with clients. Built with **Next.js 16 (App Router)**, **React 19**, a custom **Node.js + Socket.IO** real-time server, **PostgreSQL**, and **Prisma ORM**.

---

## 2-Tier Architecture Overview

Klick Pro operates as a decoupled 2-tier architecture separating the user-facing frontend from the backend API and real-time microservices:

```
                      +------------------------------------------+
                      |         Browser / Client Device          |
                      +-------------------+----------------------+
                                          |
                   +----------------------+----------------------+
                   |                                             |
                   v                                             v
       [ Port 3000: Frontend ]                       [ Port 5000: Backend ]
       http://localhost:3000                         http://localhost:5000
+-----------------------------------+         +-----------------------------------+
|  - User Website & Landing Pages   |         |  - Backend Control & API Console  |
|  - Client & Professional Portals  |         |  - REST Endpoints (/api/*)        |
|  - Admin Dashboard UI             |         |  - Socket.IO Server (WebSockets)  |
|  - React 19 & Tailwind CSS v4     |         |  - PostgreSQL Database via Prisma |
|  - Proxies /api/* to Port 5000    |         |  - 15-Min Escrow Cron Workers     |
+-----------------------------------+         +-----------------------------------+
```

### What You See on Each Port:
- **Port 3000 (`http://localhost:3000`) - Frontend**:
  The complete user-facing marketplace application, including the home page, search, professional profiles, job postings, client portal, pro portal, and admin views.
- **Port 5000 (`http://localhost:5000`) - Backend**:
  The dedicated **Backend API & Realtime Gateway Dashboard**, displaying live PostgreSQL database connectivity and latency, Socket.IO server health, Node.js process metrics, active API modules, and direct links to the frontend and admin portal.

---

## Folder Structure

The repository is organized into dedicated directories for the frontend, backend, and core app:

### `backend/` — API, Database & Real-Time Engine
```
backend/
├── api/                   # All REST API route handlers (/api/auth, /api/client, /api/admin, etc.)
├── prisma/                # Prisma schema, migrations, and database seed scripts
├── data/                  # CMS JSON data and system configuration
├── lib/                   # Database pool, auth, JWT, Razorpay, encryption, and utilities
├── services/              # Backend domain business services
├── dashboard.mjs          # Native HTML/CSS Backend Server & API Control Dashboard (Port 5000)
├── server.mjs             # Backend server runner (enforces Port 5000 & IS_BACKEND=true)
├── package.json           # Backend runner scripts
├── openapi.yaml           # OpenAPI 3.0 API documentation specification
└── Klick-Pro API...json   # Postman collection for API testing
```

### `frontend/` — User Interface & Client Application
```
frontend/
├── app/                   # All Next.js page views (marketing, client, pro, admin, auth, projects)
├── components/            # Reusable UI component library (Radix primitives, cards, dialogs, forms)
├── hooks/                 # Client React hooks (real-time subscriptions, queries, form state)
├── public/                # Static assets, branding logos, icons, and illustrations
├── styles/                # Tailwind CSS styling and global stylesheets
├── server.mjs             # Frontend server runner (enforces Port 3000 & IS_FRONTEND=true)
└── package.json           # Frontend runner scripts
```

---

## Tech Stack & Architecture

- **Frontend & App Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions) with [React 19](https://react.dev/)
- **Real-Time Engine**: Custom HTTP & [Socket.IO](https://socket.io/) server (`server.mjs`) for live messaging, instant proposal alerts, and job updates
- **Database & ORM**: [PostgreSQL 16+](https://www.postgresql.org/) managed via [Prisma ORM 7](https://www.prisma.io/) (`@prisma/client`, `@prisma/adapter-pg`)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Lucide Icons](https://lucide.dev/)
- **Payments & Escrow**: [Razorpay](https://razorpay.com/), Razorpay Route (Split Payments), and RazorpayX (Automated Payouts via UPI & IMPS)
- **Identity & Background Verification**: AuthBridge (Aadhaar / PAN verification), SpringVerify (Police & Criminal Record Check), and Persona
- **Mapping & Geolocation**: Google Maps JavaScript API, Places API, and Server Geocoding API
- **State Management & Forms**: TanStack React Query, React Hook Form, and Zod validation

---

## Requirements

- **Node.js**: `22.x` (pinned in `package.json` `engines` and `.nvmrc`)
- **npm**: `10.x` or higher
- **PostgreSQL**: `16` or newer (installed natively or via Docker)

---

## Local Setup

### 1. Clone the repository and enter the directory

```bash
git clone <repository-url>
cd Klick-pro
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure `.env`

Copy `.env.example` to `.env`:

```bash
# Windows (PowerShell)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Edit `.env` and set the core configuration values:

```dotenv
DATABASE_URL="postgresql://klickpro:YOUR_PASSWORD@localhost:5432/klickpro_dev"
DIRECT_URL="postgresql://klickpro:YOUR_PASSWORD@localhost:5432/klickpro_dev"
SHADOW_DATABASE_URL="postgresql://klickpro:YOUR_PASSWORD@localhost:5432/klickpro_shadow"
APP_URL="http://localhost:3000"
REALTIME_ALLOWED_ORIGIN="http://localhost:3000"
AUTH_SECRET="replace-with-a-long-random-secret"
FILE_STORAGE_PROVIDER="local"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-browser-maps-key"
GOOGLE_MAPS_SERVER_KEY="your-server-geocoding-key"
```

### 4. Database Setup & Migrations

```bash
# Generate Prisma Client & apply all database migrations
npx prisma generate
npx prisma migrate deploy

# (Optional) Seed demo users, categories, and marketplace jobs
npm run db:seed
npm run db:seed-categories
```

---

## Running the Application

### 1. Run Both Frontend & Backend (Recommended)

Starts the 2-tier architecture concurrently:
```bash
npm run dev
# or
npm run dev:all
```
- **Frontend UI**: [`http://localhost:3000`](http://localhost:3000)
- **Backend API & Server Dashboard**: [`http://localhost:5000`](http://localhost:5000)

### 2. Run Only the Backend (Port 5000)

```bash
npm run dev:backend
# or
cd backend && npm run dev
```
Serves the Backend Control Dashboard on port 5000, active REST APIs, and Socket.IO at `/api/realtime`.

### 3. Run Only the Frontend (Port 3000)

```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```
Serves the UI on port 3000 and proxies API calls to `http://localhost:5000`.

### 4. Run Unified Single-Port Mode (Port 3000)

```bash
npm run dev:single
```
Runs both UI and API unified on a single port (`http://localhost:3000`) without proxying.

---

## Project Scanning & Quality Verification

| Scan Type                    | Command                             | Description                                                                                                                                       |
| :--------------------------- | :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Full Type Check**          | `npm run typecheck`                 | Scans all TypeScript files across the codebase (`tsc --noEmit`) to verify zero type mismatches or broken references.                              |
| **ESLint Static Scan**       | `npm run lint`                      | Scans all source files for syntax issues, React 19 hook violations, and code quality rules (`eslint . --cache`).                                   |
| **Single-Command Full Scan** | `npm run typecheck && npm run lint` | **Recommended:** Runs both TypeScript compilation check and ESLint scan sequentially in one command.                                              |
| **Production Build Scan**    | `npm run build`                     | Applies pending database migrations and executes `next build` to verify page rendering, server bundle generation, and static optimization.        |
| **Code Formatting Check**    | `npx prettier --check .`            | Verifies whether all files comply with Prettier formatting rules without modifying them. (Use `npm run format` to auto-fix).                      |
| **Razorpay Sandbox Check**   | `npm run check:razorpay`            | Validates your Razorpay API credentials and sandbox connectivity.                                                                                 |
| **Payment Resilience Check** | `npm run test:resilience`           | Executes resilience and error-handling tests for Razorpay payment workflows.                                                                      |

---

## Database & Migration Rules

1. **Every Database Change Must Have a Migration File**:
   - Never use `prisma db push` alone in production or shared development.
   - All schema updates in `prisma/schema.prisma` must be followed by a versioned migration:
     ```bash
     npx prisma format
     npx prisma validate
     npx prisma migrate deploy
     npx prisma generate
     ```
2. **Safe & Idempotent DDL**:
   - Always use `ALTER TABLE "<TableName>" ADD COLUMN IF NOT EXISTS ...`
   - Always use `CREATE TABLE IF NOT EXISTS ...`
   - Always use `CREATE INDEX IF NOT EXISTS ...`

---

## Available NPM Scripts

```bash
# Development & Architecture
npm run dev                  # Start both Frontend (3000) and Backend (5000)
npm run dev:all              # Alias for npm run dev
npm run dev:frontend         # Start only Frontend on port 3000
npm run dev:backend          # Start only Backend on port 5000
npm run dev:single           # Start unified single-port app on port 3000
npm run dev:webpack          # Start development server using Webpack

# Production
npm run build                # Deploy migrations and compile production build
npm start                    # Start production server

# Quality & Verification
npm run typecheck            # TypeScript compiler check
npm run lint                 # ESLint code quality scan
npm run format               # Format codebase with Prettier

# Database & Seeding
npm run db:backup            # Create database backup
npm run db:restore           # Restore database from backup
npm run db:seed              # Seed development database
npm run db:seed-categories   # Seed service categories
npm run check:razorpay       # Validate Razorpay sandbox integration
npm run test:resilience      # Test payment resilience
```
