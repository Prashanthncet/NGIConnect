/**
 * NGi Connect - Functional API Integration Test Suite
 * Validates endpoints, authentication, input validation, and database operations.
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

let adminToken = "";
let publishedFormId = "";
let createdRegistrationId = "";

const results = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

async function runStep(name, fn) {
  process.stdout.write(`• ${name.padEnd(45)} ... `);
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    console.log(`✅ PASS [${duration}ms]`);
    results.push({ name, status: "PASS", duration });
  } catch (err) {
    const duration = Date.now() - start;
    console.log(`❌ FAIL (${err.message}) [${duration}ms]`);
    results.push({ name, status: "FAIL", error: err.message, duration });
  }
}

async function runApiTests() {
  console.log("====================================================");
  console.log("🧪 RUNNING API INTEGRATION TESTS - NGi CONNECT");
  console.log(`Backend Target: ${BACKEND_URL}`);
  console.log("====================================================\n");

  // Step 1: Health check
  await runStep("1. GET /api/health", async () => {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.status === "ok", "Expected status ok");
  });

  // Step 2: Seed Database
  await runStep("2. GET /api/seed (Initialization)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/seed`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true, "Expected success: true");
  });

  // Step 3: Public GET /api/institutions
  await runStep("3. GET /api/institutions", async () => {
    const res = await fetch(`${BACKEND_URL}/api/institutions`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(Array.isArray(data.data) && data.data.length >= 2, "Expected at least 2 institutions (NCET, NCMS)");
  });

  // Step 4: Public GET /api/forms
  await runStep("4. GET /api/forms (Fetch published forms)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/forms?institution=NCET`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true && Array.isArray(data.data) && data.data.length > 0, "Expected forms array");
    publishedFormId = data.data[0]._id;
  });

  // Step 5: Validation Failure on Invalid Registration
  await runStep("5. POST /api/registrations (Missing required fields)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formId: publishedFormId,
        institutionShortName: "NCET",
        responses: {}, // Missing required questions
      }),
    });
    assert(res.status === 422, `Expected 422 Unprocessable Entity, got ${res.status}`);
    const data = await res.json();
    assert(data.success === false && data.error, "Expected validation error message");
  });

  // Step 6: Successful Registration Submission
  const testCandidateEmail = `test.student.${Date.now()}@example.com`;
  await runStep("6. POST /api/registrations (Valid submission)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formId: publishedFormId,
        institutionShortName: "NCET",
        responses: {
          full_name: "Automated Test Candidate",
          email: testCandidateEmail,
          phone: "+91 99887 76655",
          category: "Prospective Student",
          department: "Computer Science & Engineering (CSE)",
          academic_interests: ["Artificial Intelligence & GenAI"],
          statement_of_purpose: "Automated API verification submission.",
        },
      }),
    });
    assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true && data.registrationId, "Expected registration ID returned");
    createdRegistrationId = data.registrationId;
  });

  // Step 7: Unauthorized Access Blocked
  await runStep("7. GET /api/stats (Unauthorized request rejection)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/stats`);
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // Step 8: Admin Authentication Login
  await runStep("8. POST /api/auth/login (Admin Login)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@ngi.org.in",
        password: "AdminNGI@2026",
      }),
    });
    assert(res.status === 200, `Expected 200 OK, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true && data.token, "Expected token in login response");
    adminToken = data.token;
  });

  // Step 9: Authorized GET /api/stats
  await runStep("9. GET /api/stats (Authorized metrics)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true && typeof data.data.total === "number", "Expected numeric total metric");
  });

  // Step 10: Authorized GET /api/registrations query
  await runStep("10. GET /api/registrations (Authorized query with search)", async () => {
    const res = await fetch(`${BACKEND_URL}/api/registrations?search=${encodeURIComponent(createdRegistrationId)}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.success === true && data.data.length > 0, "Expected to find submitted registration");
  });

  // Step 11: Cleanup created test registration
  if (createdRegistrationId) {
    await runStep("11. DELETE /api/registrations/:id (Cleanup)", async () => {
      const res = await fetch(`${BACKEND_URL}/api/registrations/${createdRegistrationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
    });
  }

  const passedCount = results.filter((r) => r.status === "PASS").length;
  const failedCount = results.filter((r) => r.status === "FAIL").length;

  console.log("\n----------------------------------------------------");
  console.log(`API Tests Completed: ${passedCount} passed, ${failedCount} failed`);
  console.log("----------------------------------------------------\n");

  return failedCount === 0;
}

if (require.main === module) {
  runApiTests().then((ok) => {
    process.exit(ok ? 0 : 1);
  });
}

module.exports = { runApiTests };
