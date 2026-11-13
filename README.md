# NGi Connect – Monorepo Architecture

A modern, multi-tier institutional web application and dynamic form engine connecting **Nagarjuna College of Engineering and Technology (NCET)** and **Nagarjuna College of Management Studies (NCMS)** under the **Nagarjuna Group of Institutions (NGi)**.

---

## 🏗️ Redesigned Monorepo Architecture

The repository has been decoupled into three cleanly separated and safely isolated projects:

```
NGIConnect/
├── backend/                       # Standalone Express & Node.js REST API Server (Port 5000)
│   ├── src/
│   │   ├── config/                # Database pool connection (Mongoose) & Environment config
│   │   │   ├── db.ts
│   │   │   └── env.ts
│   │   ├── controllers/           # API request controllers (CRUD, business logic)
│   │   │   ├── authController.ts
│   │   │   ├── formController.ts
│   │   │   ├── institutionController.ts
│   │   │   ├── registrationController.ts
│   │   │   ├── seedController.ts
│   │   │   └── statsController.ts
│   │   ├── middleware/            # Security, JWT auth, and centralized error handling
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/                # Mongoose Document Schemas & Indexes
│   │   │   ├── Admin.ts
│   │   │   ├── Form.ts
│   │   │   ├── Institution.ts
│   │   │   └── Registration.ts
│   │   ├── routes/                # Express Router endpoints (/api/*)
│   │   │   ├── authRoutes.ts
│   │   │   ├── formRoutes.ts
│   │   │   ├── index.ts
│   │   │   ├── institutionRoutes.ts
│   │   │   ├── registrationRoutes.ts
│   │   │   ├── seedRoutes.ts
│   │   │   └── statsRoutes.ts
│   │   ├── utils/                 # JWT tokens, ID generators, ExcelJS exporters, Seed data
│   │   │   ├── excelExport.ts
│   │   │   ├── jwt.ts
│   │   │   ├── registrationId.ts
│   │   │   └── seedData.ts
│   │   └── server.ts              # Express initialization, CORS, cookie-parser, port listening
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Public Candidate Portal (Next.js 14 App Router, Port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Academic prestige branding, typography (Poppins, Inter)
│   │   │   ├── globals.css        # Tailwind directives & CSS variables
│   │   │   ├── page.tsx           # Public Landing Page (Hero, NCET, NCMS, Why NGI, CTA)
│   │   │   ├── register/          # Dynamic Candidate Registration Page (NCET / NCMS toggle)
│   │   │   │   └── page.tsx
│   │   │   └── registration-success/ # Confirmation slip with unique Registration ID
│   │   │       └── page.tsx
│   │   ├── components/            # Reusable UI components
│   │   │   ├── FormFieldRenderer.tsx # Dynamic question renderer (13 field types)
│   │   │   ├── Footer.tsx         # Institutional footer with campus locations
│   │   │   └── Navbar.tsx         # Top utility bar + Sticky navbar with NCET/NCMS Mega-Menu
│   │   ├── lib/                   # API client & utility helpers
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   └── types/                 # Shared TypeScript interfaces (no direct Mongoose dependency)
│   │       └── index.ts
│   ├── next.config.mjs            # Seamless /api proxying to Backend
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── package.json
│   └── tsconfig.json
│
└── admin/                         # Redesigned Administrative Control Studio (Next.js 14, Port 3001)
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx         # Root layout with font tokens
    │   │   ├── globals.css        # Custom admin scrollbars & theme styles
    │   │   ├── page.tsx           # Redirects to /dashboard
    │   │   ├── login/             # Isolated split-screen Admin Authentication
    │   │   │   └── page.tsx
    │   │   └── (portal)/          # Authenticated Route Group with shared Portal Layout & Guard
    │   │       ├── layout.tsx     # Shell with AdminSidebar + Topbar + Auth check
    │   │       ├── dashboard/     # Live MongoDB KPI cards, growth trend charts, campus share
    │   │       │   └── page.tsx
    │   │       ├── registrations/ # Filterable data grid, inspection drawer, Excel export
    │   │       │   └── page.tsx
    │   │       └── form-builder/  # 3-Panel dynamic form studio (Palette, Canvas, Inspector)
    │   │           └── page.tsx
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── AdminHeader.tsx   # Topbar with backend health indicator & actions
    │   │   │   └── AdminSidebar.tsx  # Responsive navigation sidebar with badge indicators
    │   │   ├── dashboard/
    │   │   │   └── StatCard.tsx      # Metric KPI card
    │   │   └── registrations/
    │   │       └── StatusBadge.tsx   # Color-coded status badge
    │   ├── lib/
    │   │   ├── api.ts                # Authenticated API client
    │   │   ├── auth.ts               # Session & logout utilities
    │   │   └── utils.ts              # Formatting & CSS helpers
    │   └── types/
    │       └── index.ts              # Strongly typed admin domain models
    ├── next.config.mjs               # Seamless /api proxying to Backend
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── package.json
    └── tsconfig.json
```

---

## ⚡ Network Port Mapping

| Service | Port | Description |
|---|---|---|
| **`frontend`** | `http://localhost:3000` | Public applicant landing page, registration form & success slip |
| **`admin`** | `http://localhost:3001` | Executive administrative console, form builder & registrations manager |
| **`backend`** | `http://localhost:5000` | REST API with MongoDB persistence, JWT authentication, and Excel export |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run from the root repository:
```bash
# Install workspace dependencies across all three packages
npm run install:all
```
*(Or navigate into each directory `cd backend && npm install`, `cd frontend && npm install`, `cd admin && npm install`)*

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in `backend/`, and to `.env.local` in `frontend/` and `admin/`:
- **Backend:** `backend/.env` (default port 5000, MongoDB URI, JWT secret)
- **Frontend:** `frontend/.env.local` (points to `http://localhost:5000/api`)
- **Admin:** `admin/.env.local` (points to `http://localhost:5000/api`)

### 3. Start Development Servers
You can start each service in separate terminal windows:

```bash
# Terminal 1: Start Backend REST API (Port 5000)
npm run dev:backend

# Terminal 2: Start Frontend Public Portal (Port 3000)
npm run dev:frontend

# Terminal 3: Start Admin Portal Studio (Port 3001)
npm run dev:admin
```

---

## 🔑 Administrative Access Credentials

- **Admin Login Route:** [http://localhost:3001/login](http://localhost:3001/login)
- **Default Email:** `admin@ngi.org.in`
- **Default Password:** `AdminNGI@2026`

*(The database automatically initializes default institutions NCET and NCMS, published versioned forms, and sample records upon first access via `/api/seed`)*

---

## 🛡️ Key Features

- **Decoupled Architecture:** Frontend and Admin client bundles no longer depend on backend or Mongoose packages, drastically reducing bundle size and improving build speeds.
- **RESTful API Backend:** Express server with centralized error handling, robust CORS for local and staging environments, cookie-based sessions with JWT bearer fallback.
- **Dynamic Form Engine:** 3-panel builder (Palette, Canvas, Inspector) supporting 13 field types and automated schema versioning (`v1`, `v2`, etc.).
- **ExcelJS Export Pipeline:** Real `.xlsx` binary exports styled with Deep Institutional Navy headers, orange accents, auto-filters, and frozen panes.
