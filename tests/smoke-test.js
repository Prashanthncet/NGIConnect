/**
 * NGi Connect - Smoke Test Suite
 * Rapid verification of service availability and core HTTP endpoints.
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:3002";

const tests = [
  {
    name: "Backend Root Service Info",
    url: `${BACKEND_URL}/`,
    expectedStatus: 200,
    validate: (data) => data.service && data.service.includes("NGi Connect"),
  },
  {
    name: "Backend Health Check Endpoint",
    url: `${BACKEND_URL}/api/health`,
    expectedStatus: 200,
    validate: (data) => data.status === "ok",
  },
  {
    name: "Institutions API Availability",
    url: `${BACKEND_URL}/api/institutions`,
    expectedStatus: 200,
    validate: (data) => data.success === true && Array.isArray(data.data),
  },
  {
    name: "Registration Forms API Availability",
    url: `${BACKEND_URL}/api/forms`,
    expectedStatus: 200,
    validate: (data) => data.success === true,
  },
  {
    name: "Public Registration Page (Frontend)",
    url: `${FRONTEND_URL}/`,
    expectedStatus: [200, 307, 308],
    isHtml: true,
  },
  {
    name: "Admin Route Redirect (/admin)",
    url: `${FRONTEND_URL}/admin`,
    expectedStatus: [200, 307, 308],
    isHtml: true,
  },
  {
    name: "Admin Login Page (/admin/login)",
    url: `${FRONTEND_URL}/admin/login`,
    expectedStatus: [200, 307, 308],
    isHtml: true,
  },
];

async function runSmokeTests() {
  console.log("====================================================");
  console.log("🔥 RUNNING SMOKE TESTS - NGi CONNECT");
  console.log(`Backend Target:  ${BACKEND_URL}`);
  console.log(`Frontend Target: ${FRONTEND_URL}`);
  console.log("====================================================\n");

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    process.stdout.write(`• Checking ${test.name.padEnd(38)} ... `);
    const start = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(test.url, {
        signal: controller.signal,
        headers: test.isHtml ? { Accept: "text/html" } : { Accept: "application/json" },
      });
      clearTimeout(timeoutId);

      const duration = Date.now() - start;
      const validStatus = Array.isArray(test.expectedStatus)
        ? test.expectedStatus.includes(res.status)
        : res.status === test.expectedStatus;

      if (!validStatus) {
        console.log(`❌ FAIL (Status ${res.status}, expected ${test.expectedStatus}) [${duration}ms]`);
        failed++;
        continue;
      }

      if (!test.isHtml && test.validate) {
        const body = await res.json().catch(() => null);
        if (!body || !test.validate(body)) {
          console.log(`❌ FAIL (Validation failed) [${duration}ms]`);
          failed++;
          continue;
        }
      }

      console.log(`✅ PASS (${res.status}) [${duration}ms]`);
      passed++;
    } catch (err) {
      const duration = Date.now() - start;
      const isConnRefused = err.cause?.code === "ECONNREFUSED" || err.message.includes("fetch failed");
      console.log(`❌ DOWN (${isConnRefused ? "Connection Refused / Server Not Running" : err.message}) [${duration}ms]`);
      failed++;
    }
  }

  console.log("\n====================================================");
  console.log(`Smoke Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log("====================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runSmokeTests();
