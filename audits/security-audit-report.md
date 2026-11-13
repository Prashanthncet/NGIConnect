# NGi Connect - Comprehensive Security Audit & Vulnerability Assessment Report

**Target Codebase:** `./backend/src`, `./frontend/src`, `./admin/src`  
**Assessment Date:** 2026-11-07  
**Auditor:** Automated Security Intelligence & Code Review Engine  
**Classification:** Internal Security Review  

---

## 1. Executive Summary

A comprehensive source code security assessment of the **NGi Connect** multi-campus portal and dynamic registry platform was performed. The assessment evaluated authentication mechanisms, authorization controls, data validation, database interaction security, session handling, CORS policies, and potential denial-of-service attack vectors.

### Risk Summary Matrix

| Vulnerability ID | Severity | Category | Status |
|---|---|---|---|
| **SEC-01** | **HIGH** | ReDoS / Injection in MongoDB Search Queries | Identified |
| **SEC-02** | **HIGH** | Permissive CORS Policy with `credentials: true` | Identified |
| **SEC-03** | **HIGH** | Insecure Fallback JWT Secret in Production | Identified |
| **SEC-04** | **MEDIUM** | Unauthenticated Database Seed Endpoint (`/api/seed`) | Identified |
| **SEC-05** | **MEDIUM** | Lack of Rate Limiting on Login and Registration | Identified |
| **SEC-06** | **MEDIUM** | Unbounded Excel Export Memory Exhaustion | Identified |
| **SEC-07** | **MEDIUM** | Missing Defensive HTTP Security Headers | Identified |
| **SEC-08** | **LOW** | JWT Algorithm Not Explicitly Pinned | Identified |
| **SEC-09** | **LOW** | Potential Error Stack / Internal Detail Disclosure | Identified |

---

## 2. Detailed Vulnerability Findings & Technical Analysis

### 🔴 SEC-01: ReDoS & Regular Expression Injection in Query Filters
- **Location:** `backend/src/controllers/registrationController.ts` (Lines 154–162)
- **CWE:** CWE-1333 (Inefficient Regular Expression Complexity), CWE-707 (Improper Neutralization)
- **Description:**  
  The search filter instantiates a `RegExp` object directly from user input without escaping regex metacharacters:
  ```typescript
  if (search && String(search).trim()) {
    const regExp = new RegExp(String(search).trim(), "i");
    query.$or = [
      { registrationId: regExp },
      { candidateName: regExp },
      { candidateEmail: regExp },
      { candidatePhone: regExp },
      { department: regExp },
    ];
  }
  ```
- **Impact:**  
  An attacker can supply catastrophic backtracking patterns (e.g., `(a+)+$`) or unescaped regex symbols that cause heavy CPU consumption on the MongoDB cluster or Node.js thread, leading to application hangs or Denial of Service (ReDoS).
- **Remediation:**  
  Sanitize regex characters prior to constructing queries:
  ```typescript
  function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  const sanitized = escapeRegex(String(search).trim());
  const regExp = new RegExp(sanitized, "i");
  ```

---

### 🔴 SEC-02: Permissive CORS Configuration with `credentials: true`
- **Location:** `backend/src/server.ts` (Lines 22–35)
- **CWE:** CWE-942 (Permissive Cross-Domain Policy with Untrusted Domains)
- **Description:**  
  The CORS configuration allows any origin as a fallback while enabling `credentials: true`:
  ```typescript
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback
      }
    },
    credentials: true,
  })
  ```
- **Impact:**  
  Any external third-party domain visited by an authenticated administrator can make credentialed requests to the backend API (`/api/registrations`, `/api/forms`), reading sensitive student records or executing administrative modifications.
- **Remediation:**  
  In production, disallow untrusted origins:
  ```typescript
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (ENV.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: origin not permitted"));
      }
    },
    credentials: true,
  })
  ```

---

### 🔴 SEC-03: Hardcoded Fallback JWT Secret Key
- **Location:** `backend/src/config/env.ts` (Line 7)
- **CWE:** CWE-798 (Use of Hard-coded Credentials), CWE-321 (Cryptographic Key with Low Entropy)
- **Description:**  
  When `JWT_SECRET` is not provided in environment variables, the system falls back to a static string:
  ```typescript
  JWT_SECRET: process.env.JWT_SECRET || "ngi_connect_super_secret_jwt_key_2026_institutional_secure"
  ```
- **Impact:**  
  If the application is deployed to a staging or production server where the environment variable is omitted or misconfigured, an adversary with knowledge of the public repository can forge administrative JWT tokens and gain full administrative privileges.
- **Remediation:**  
  Force the application to fail fast on startup if `JWT_SECRET` is missing in production:
  ```typescript
  if (ENV.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("FATAL: JWT_SECRET must be defined in production environment.");
  }
  ```

---

### 🟡 SEC-04: Unauthenticated Database Initializer (`/api/seed`)
- **Location:** `backend/src/routes/seedRoutes.ts` (Lines 8–10)
- **CWE:** CWE-306 (Missing Authentication for Critical Function)
- **Description:**  
  The `/api/seed` endpoint accepts public `GET` and `POST` requests without checking for admin session cookies or authorization tokens.
- **Impact:**  
  While the seed logic is designed to be idempotent, exposing database initialization routines publicly allows unauthenticated users to trigger heavy database queries, verify institutional configuration states, or invoke cleanup operations.
- **Remediation:**  
  Disable `/api/seed` in production or enforce `requireAdminAuth`:
  ```typescript
  router.get("/", (req, res, next) => {
    if (ENV.NODE_ENV === "production") {
      return res.status(403).json({ error: "Seed endpoint disabled in production" });
    }
    seedDatabase(req, res, next);
  });
  ```

---

### 🟡 SEC-05: Absence of Rate Limiting on Authentication & Registrations
- **Location:** `backend/src/routes/authRoutes.ts`, `backend/src/routes/registrationRoutes.ts`
- **CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts), CWE-799 (Improper Control of Interaction Frequency)
- **Description:**  
  Neither `/api/auth/login` nor `/api/registrations` have rate limiting or brute force throttling applied.
- **Impact:**  
  - Adversaries can mount automated dictionary attacks against administrator accounts.
  - Malicious bots can flood the registration system with bogus candidate records.
- **Remediation:**  
  Implement `express-rate-limit`:
  ```typescript
  import rateLimit from "express-rate-limit";

  export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { success: false, error: "Too many login attempts. Please try again after 15 minutes." }
  });

  export const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30,
    message: { success: false, error: "Submission rate limit exceeded. Please try again later." }
  });
  ```

---

### 🟡 SEC-06: Unbounded Excel Export Memory Exhaustion (DoS)
- **Location:** `backend/src/controllers/registrationController.ts` (Lines 220–250)
- **CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling)
- **Description:**  
  The Excel export function loads all matching database records into Node memory in a single query:
  ```typescript
  const registrations = await Registration.find(query).sort({ submittedAt: -1 });
  ```
- **Impact:**  
  If the database accumulates tens of thousands of submissions, simultaneous export requests will consume hundreds of megabytes of heap memory, triggering Node.js Out-Of-Memory (OOM) fatal process termination.
- **Remediation:**  
  Enforce a hard maximum record cap (e.g. `.limit(10000)`) or stream rows via ExcelJS `workbook.csv.write` or streaming worksheets.

---

### 🟡 SEC-07: Missing HTTP Security Headers
- **Location:** `backend/src/server.ts`
- **CWE:** CWE-693 (Protection Mechanism Failure)
- **Description:**  
  The Express server does not emit defensive security headers (`Helmet`).
- **Remediation:**  
  Mount `helmet` middleware:
  ```typescript
  import helmet from "helmet";
  app.use(helmet({ contentSecurityPolicy: false })); // customize CSP for Next.js
  ```

---

### 🟢 SEC-08: Explicit JWT Algorithm Not Enforced
- **Location:** `backend/src/utils/jwt.ts` (Line 27)
- **CWE:** CWE-327 (Use of a Broken or Risky Cryptographic Algorithm)
- **Description:**  
  `jwt.verify(token, ENV.JWT_SECRET)` does not enforce `algorithms: ["HS256"]`.
- **Remediation:**  
  ```typescript
  export function verifyAdminToken(token: string): AdminTokenPayload | null {
    try {
      return jwt.verify(token, ENV.JWT_SECRET, { algorithms: ["HS256"] }) as AdminTokenPayload;
    } catch {
      return null;
    }
  }
  ```

---

### 🟢 SEC-09: Generic vs Specific Error Disclosures
- **Location:** `backend/src/middleware/errorHandler.ts`
- **CWE:** CWE-209 (Generation of Error Message Containing Sensitive Information)
- **Description:**  
  Passing raw `err.message` in production may reveal internal MongoDB schema structure, duplicate key constraints, or server paths.
- **Remediation:**  
  In production, return a sanitized error message and log the trace server-side with an event ID.

---

## 3. Testing & Verification Run

The codebase has been instrumented with three automated test suites under `tests/`:

1. **Smoke Tests (`node tests/smoke-test.js`):**  
   Validates HTTP availability, health check endpoints, and frontend/admin portal reachability.
2. **API Tests (`node tests/api-test.js`):**  
   Tests form retrieval, input validation rejection (422), valid registration submission (201), unauthorized endpoint rejection (401), admin credential verification, and cleanup.
3. **Stress Tests (`node tests/stress-test.js`):**  
   Executes concurrent requests to evaluate throughput (RPS), p50/p90/p99 latency percentiles, and error rates under load.

---

## 4. Remediation Priority Plan

1. **Phase 1 (Immediate / High):**
   - Apply regex metacharacter escaping in `registrationController.ts`.
   - Restrict CORS origin whitelist in production in `server.ts`.
   - Pin JWT verification algorithm to `HS256` in `utils/jwt.ts`.
2. **Phase 2 (Medium):**
   - Protect or disable `/api/seed` in production mode.
   - Add rate limiters to `/api/auth/login` and `/api/registrations`.
   - Cap Excel export records to prevent heap exhaustion.
3. **Phase 3 (Hardening):**
   - Add security headers via `helmet`.
   - Sanitize error messages in `errorHandler.ts`.
