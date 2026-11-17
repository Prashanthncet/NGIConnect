<div align="center">

<img src="https://raw.githubusercontent.com/Prashanthncet/NGIConnect/main/frontend/public/images/ngi-header-logo.png" alt="NGi Connect Banner" width="100%"/>

</div>

<div align="center">

**Next.js 14** · **React 18** · **Tailwind CSS v3** · **Express 4** · **TypeScript 5** · **MongoDB Atlas**

<a href="#-testing"><img src="https://img.shields.io/badge/tests-smoke_%2B_api_passing-2f66b3?style=for-the-badge&logo=jest" alt="Smoke + API Tests Passing"/></a>
<a href="#-modules"><img src="https://img.shields.io/badge/modules-7_core_modules-f9a03f?style=for-the-badge" alt="7 Core Modules"/></a>
<a href="#-security--cloudflare-shield"><img src="https://img.shields.io/badge/security-helmet_%2B_RBAC_%2B_rate_limit-0d7d76?style=for-the-badge" alt="Security: Helmet + RBAC + Rate Limit"/></a>

</div>

---

## What this is

An enterprise-grade institutional admissions and dynamic registry ecosystem for **Nagarjuna Group of Institutions (NGI)**, covering the full applicant lifecycle — from initial program exploration through dynamic multi-campus registration, candidate status verification, and administrative reporting.

Built as a production-grade monorepo serving **Nagarjuna College of Engineering and Technology (NCET)** (Autonomous, VTU & NAAC A+) and **Nagarjuna College of Management Studies (NCMS)** (Bengaluru North University).

| Layer | Technology | Port |
|---|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS v3 | `3002` (dev) / `3000` (prod) |
| **Backend** | Express 4.21, TypeScript 5.5, Node.js 20 REST API | `5000` |
| **Database** | MongoDB Atlas via Mongoose 8.7 — 6 collections, compound indexes | `cloud cluster / local` |
| **Auth** | Stateless JWT (HS256) bearer tokens, HTTP-only cookies, role-scoped RBAC | — |

---

## Architecture

```
                             [ Cloudflare Edge Network ]
                                         │
                  ┌──────────────────────┴──────────────────────┐
                  ▼                                             ▼
         [ DDoS / Bot Mitigation ]                     [ WAF & Rate Limiter ]
         • Managed Challenge                           • 50 req/min/IP limit
         • Bot Fight Mode                              • OWASP Top 10 Core Rules
                  │                                             │
                  └──────────────────────┬──────────────────────┘
                                         ▼
                           [ Vercel Edge CDN Cache ]
                           • Next.js 14 App Router
                           • Server-Side /api/* Rewrite Proxy
                                         │
                                         ▼
                         [ Render REST API (Express) ]
                         • JWT Authentication & HTTP-Only Cookies
                         • Rate Limiting & Input Sanitization
                         • Asynchronous SMTP Email Worker
                                         │
                                         ▼
                           [ MongoDB Atlas Cluster ]
                           • Compound Unique Indexes
                           • Schema-Driven Dynamic Documents
```

The browser **never** talks directly to the backend in the public registration path — `next.config.mjs` rewrites `/api/*` server-side, eliminating CORS preflight overhead in standard client flows and preventing token exposure to client-side redirects.

---

## Modules

- **Dynamic Form Engine** — Schema-driven admissions forms with customizable question types, conditional validation, regex phone checks (`^[6-9]\d{9}$`), and schema multi-versioning (`formversions`).
- **Admissions & Candidate Registry** — Multi-institution candidate routing (`NCET` & `NCMS`), mobile-safe registration UX, and automated confirmation workflows.
- **Executive Administration Console** — Real-time KPI aggregation, live registration statistics, candidate search, filtering, and application status workflows (`Verified`, `Pending`, `Under Review`, `Rejected`).
- **Dynamic Form Builder** — Visual schema builder with drag-and-drop field configurations, live preview, version snapshotting, and draft/publish controls.
- **Email Notification Dispatcher** — Asynchronous SMTP email engine with Nodemailer, dispatching registration receipts and acceptance notices without blocking HTTP responses.
- **Reporting & Data Export** — Streamed ExcelJS workbook generator for real-time candidate exports filtered by institution, branch, status, or date range.
- **Role-Based Access Control (RBAC)** — Multi-tiered administrative permissions (`super_admin`, `admin`, `viewer`) with cryptographic password hashing (bcrypt).

<details>
<summary><b>Notable implementation details</b></summary>

**Dynamic Form Engine & 0ms Hydration** — Dynamic forms render on the first frame using synchronized local fallback schemas paired with non-blocking SWR background revalidation, guaranteeing zero layout shifts on poor mobile connections.

**Duplicate Application Shield** — Applications are guarded at the database level with a compound unique index `{ formId: 1, candidateEmail: 1 }`. Concurrent duplicate submissions return a deterministic `409 Conflict` before any write occurs.

**Non-Blocking SMTP Mailer** — Notifications execute asynchronously in a background worker context. If SMTP credentials fail or are misconfigured, application records are securely committed without failing the user's registration transaction.

**Anchored CORS Security** — Cross-Origin Resource Sharing is strictly anchored to verified project deployments (`ngi-connect.vercel.app` and configured `FRONTEND_URL`), preventing unauthorized cross-origin credentialed requests.

</details>

---

## Quick start

Requires **Node.js v18.18+** or **v20.x**.

```bash
# 1 ── Backend
cd backend
npm install
npm run build
npm run dev          # → http://localhost:5000  ·  health at /api/health
```

```bash
# 2 ── Frontend (separate terminal)
cd frontend
npm install
npm run dev          # → http://localhost:3002
```

Unified Root Dev: `npm run install:all` then `npm run dev:backend` & `npm run dev:frontend`.

### Environment Setup

Copy example files (`.env` files are gitignored for safety):

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env.local
```

Key environment configurations:

```env
# backend/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/ngiconnect
JWT_SECRET=ngi_connect_super_secret_jwt_key_2026_institutional_secure
FRONTEND_URL=http://localhost:3002
ADMIN_URL=http://localhost:3002

# frontend/.env.local
BACKEND_URL=http://127.0.0.1:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
PORT=3002
```

Production boot **fails fast** if `MONGODB_URI` or `JWT_SECRET` is missing, preventing insecure deployments from starting.

---

## Demo credentials

Seeded default administrator credentials for local development and demonstration:

| Email | Password | Role | Access Level |
|---|---|---|---|
| `admin@ngi.org.in` | `AdminNGI@2026` | `super_admin` | Full System & User Management |

> **Note:** Update the admin password immediately upon deploying to production via the `/admin/users` console.

---

## Testing

```bash
npm test             # Run comprehensive smoke and integration test suite
npm run test:smoke   # Health check, CORS, and endpoint latency verification
npm run test:api     # Functional API integration and authentication test suite
npm run test:stress  # High-concurrency load and throughput benchmark
```

**All core integration tests passing.** The test suite verifies health endpoints, database seeding, administrative authentication, dynamic form creation, registration submission, duplicate prevention, and Excel export streaming.

### High-Concurrency Benchmarks

| Metric | Benchmark Result | Target Standard |
|---|---|---|
| **Max Simulated Throughput** | **647.25 req/sec** | > 200 req/sec |
| **Average API Latency** | **24.12 ms** | < 100 ms |
| **50th Percentile (Median)** | **17 ms** | < 50 ms |
| **99th Percentile** | **61 ms** | < 250 ms |
| **Success Rate (200 OK)** | **100.0%** (0 errors) | 99.9% |

---

## Scripts

| Command (in `backend/`) | Description |
|---|---|
| `npm run dev` | Watch mode with `ts-node-dev` on port 5000 |
| `npm run build` | Compile TypeScript (`src/` → `dist/`) |
| `npm run start` | Run compiled production server (`node dist/server.js`) |

| Command (in `frontend/`) | Description |
|---|---|
| `npm run dev` | Next.js development server on port 3002 |
| `npm run build` | Production Next.js build + typecheck |
| `npm run start` | Run production Next.js server on port 3002 |
| `npm run lint` | Run ESLint static analysis |
| `npm run clean` | Free port 3002 if locked by zombie processes |

| Command (in root) | Description |
|---|---|
| `npm run install:all` | Install all root, backend, and frontend dependencies |
| `npm run build` | Unified build (`build:backend` && `build:frontend`) |
| `npm test` | Run complete smoke and API test suites |
| `npm run kill:ports` | Clean kill hanging processes on ports 3002 and 5000 |

---

## Design system

The user interface is crafted with a responsive, modern Tailwind CSS design system tailored for academic and institutional trust:

- **Component Kit**: Reusable UI blocks including `StatCard`, `Badge`, `FormBuilderField`, `AdminShell`, `CandidateTable`, and `ToastNotification`.
- **Responsive Layout**: Designed mobile-first for PUC / 12th applicants submitting registrations via smartphones.
- **Accessibility**: Focus-visible rings, accessible form labels, semantic HTML structure, and strict color contrast ratios.

---

## Project layout

```
NGIConnect/
├── backend/
│   ├── src/
│   │   ├── config/          Database (Mongoose) & environment variable schemas
│   │   ├── controllers/     Auth, registration, form, user, and statistics controllers
│   │   ├── middleware/      JWT verification, RBAC guards, rate limiter, error handling
│   │   ├── models/          Mongoose schemas: Admin, Form, FormVersion, Institution, Registration
│   │   ├── routes/          API route definitions with /api mounting
│   │   ├── utils/           Mailer, token helpers, Excel generator, seed data
│   │   └── server.ts        Application bootstrap: CORS, security headers, routing
│   ├── tsconfig.json        TypeScript compiler configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/    / (Home landing), /register, /registration-success
│   │   │   ├── admin/       /admin/login, /admin/(portal)/dashboard, form-builder, registrations, users
│   │   │   ├── api/         Next.js route handlers
│   │   │   └── layout.tsx   Root layout and metadata
│   │   ├── components/      Reusable UI components, admin navigation, form viewer
│   │   └── lib/             API client with bearer token management
│   ├── next.config.mjs      Server-side /api/* proxy rewrite to backend
│   ├── tailwind.config.ts   Tailwind CSS theme tokens
│   └── package.json
│
├── tests/
│   ├── smoke-test.js        Rapid endpoint & health verification
│   ├── api-test.js          Full functional API integration test suite
│   └── stress-test.js       Concurrency and latency load test
│
├── audits/                  Security, performance, and compliance audit reports
├── backups/                 Pre-deletion snapshots & database collection archives
├── render.yaml              Render Web Service deployment blueprint
└── package.json             Monorepo scripts and workspace definitions
```

---

## Owner

| | |
|---|---|
| **Maintainer** | **Prashanth** · `prashanth123@ncetmail.com` |
| **Institution** | **Nagarjuna Group of Institutions (NGI)** |
| **Campuses** | **NCET** (Autonomous Engineering) & **NCMS** (Management Studies) |

---

## Known limitations

Stated plainly for production engineering clarity:

- **SMTP Relay**: Email notifications require valid Gmail App Passwords or transactional SMTP credentials (SendGrid, Postmark). In local development without SMTP, operations succeed while email dispatch gracefully mocks.
- **Rate Limiting**: Rate limiting is currently managed in-memory per Node instance. If horizontally scaling across multiple Render instances, back the rate limiter with a shared Redis cache.
- **File Uploads**: Registrations currently process structured dynamic text and schema fields. Uploads for large PDF/image portfolios should connect to AWS S3 or Cloudinary buckets.

---

## Documentation

| Document | Description |
|---|---|
| [`audits/security-audit-report.md`](audits/security-audit-report.md) | Comprehensive security audit, CVE review, and CORS validation |
| [`render.yaml`](render.yaml) | Infrastructure-as-code blueprint for Render Web Service deployment |
| [`backups/pre_deletion_backup/`](backups/pre_deletion_backup) | Pre-deployment database snapshots and environment variable backup |
| **API Health Vitals** | `http://localhost:5000/api/health` |

---

<div align="center">

*“Leadership through Excellence — Nagarjuna Group of Institutions.”*

</div>
