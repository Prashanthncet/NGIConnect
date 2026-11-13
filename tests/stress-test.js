/**
 * NGi Connect - High Concurrency Stress & Load Test Suite
 * Measures latency, throughput, error rates, and system stability under concurrent load.
 */

const TARGET_URL = process.env.STRESS_TARGET || "http://localhost:5000/api/health";
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "20", 10);
const TOTAL_REQUESTS = parseInt(process.env.TOTAL_REQUESTS || "200", 10);

function calculatePercentile(sortedArray, percentile) {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, index)];
}

async function runStressTest() {
  console.log("====================================================");
  console.log("⚡ HIGH CONCURRENCY STRESS & LOAD TEST - NGi CONNECT");
  console.log(`Target URL:      ${TARGET_URL}`);
  console.log(`Total Requests:  ${TOTAL_REQUESTS}`);
  console.log(`Concurrency:     ${CONCURRENCY} workers`);
  console.log("====================================================\n");

  const latencies = [];
  const statusCodes = {};
  let completed = 0;
  let errors = 0;
  let queueIndex = 0;

  const testStartTime = Date.now();

  async function worker(workerId) {
    while (queueIndex < TOTAL_REQUESTS) {
      const currentReq = ++queueIndex;
      if (currentReq > TOTAL_REQUESTS) break;

      const reqStart = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(TARGET_URL, {
          signal: controller.signal,
          headers: { "User-Agent": "NGiConnect-StressTest/1.0" },
        });
        clearTimeout(timeout);

        const duration = Date.now() - reqStart;
        latencies.push(duration);

        statusCodes[res.status] = (statusCodes[res.status] || 0) + 1;
      } catch (err) {
        const duration = Date.now() - reqStart;
        latencies.push(duration);
        errors++;
        statusCodes["ERR"] = (statusCodes["ERR"] || 0) + 1;
      }

      completed++;
      if (completed % 25 === 0 || completed === TOTAL_REQUESTS) {
        process.stdout.write(`\rProgress: ${completed}/${TOTAL_REQUESTS} requests completed (${Math.round((completed / TOTAL_REQUESTS) * 100)}%)`);
      }
    }
  }

  // Launch concurrent workers
  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker(i));
  }

  await Promise.all(workers);
  const totalDurationSeconds = (Date.now() - testStartTime) / 1000;

  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1);
  const rps = (completed / totalDurationSeconds).toFixed(2);

  console.log("\n\n====================================================");
  console.log("📊 STRESS TEST RESULTS & PERFORMANCE BENCHMARK");
  console.log("====================================================");
  console.log(`Total Elapsed Time:   ${totalDurationSeconds.toFixed(2)}s`);
  console.log(`Throughput:           ${rps} requests/sec`);
  console.log(`Total Requests:       ${completed}`);
  console.log(`Successful Requests:  ${completed - errors}`);
  console.log(`Failed / Timed Out:   ${errors}`);

  console.log("\n📈 Latency Distribution:");
  console.log(`  • Minimum (Fastest): ${latencies[0] || 0} ms`);
  console.log(`  • Average Latency:   ${avgLatency.toFixed(2)} ms`);
  console.log(`  • 50th Percentile:   ${calculatePercentile(latencies, 50)} ms`);
  console.log(`  • 90th Percentile:   ${calculatePercentile(latencies, 90)} ms`);
  console.log(`  • 95th Percentile:   ${calculatePercentile(latencies, 95)} ms`);
  console.log(`  • 99th Percentile:   ${calculatePercentile(latencies, 99)} ms`);
  console.log(`  • Maximum (Slowest): ${latencies[latencies.length - 1] || 0} ms`);

  console.log("\n🏷️ HTTP Status Code Breakdown:");
  for (const [code, count] of Object.entries(statusCodes)) {
    console.log(`  • Status ${code}: ${count} (${((count / completed) * 100).toFixed(1)}%)`);
  }
  console.log("====================================================\n");

  return errors === 0;
}

if (require.main === module) {
  runStressTest().then((ok) => {
    process.exit(ok ? 0 : 1);
  });
}

module.exports = { runStressTest };
