import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CONFIG } from './config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIERS = [
  {
    id: 'tier1_features',
    name: 'Tier 1: Single Features & Visual Elements',
    dir: path.join(__dirname, 'tier1-features')
  },
  {
    id: 'tier2_boundaries',
    name: 'Tier 2: Domain Invariants & 5 Sweety Domain Laws',
    dir: path.join(__dirname, 'tier2-boundaries')
  },
  {
    id: 'tier3_combinations',
    name: 'Tier 3: Cross-Component Combinations & State Transitions',
    dir: path.join(__dirname, 'tier3-combinations')
  },
  {
    id: 'tier4_scenarios',
    name: 'Tier 4: Clinical End-to-End Scenarios',
    dir: path.join(__dirname, 'tier4-scenarios')
  }
];

async function runPreflightChecks() {
  console.log('======================================================================');
  console.log('🍬 Sweety Glucose Tracker — 4-Tier Automated E2E Test Runner');
  console.log('======================================================================');

  // Check Client
  let clientOk = false;
  try {
    const res = await fetch(CONFIG.CLIENT_URL, { signal: AbortSignal.timeout(4000) });
    clientOk = res.ok;
    console.log(`[Pre-flight] Checking Client on ${CONFIG.CLIENT_URL} ... ${clientOk ? 'OK (200)' : 'FAILED (' + res.status + ')'}`);
  } catch (err) {
    console.log(`[Pre-flight] Checking Client on ${CONFIG.CLIENT_URL} ... FAILED (${err.message})`);
  }

  // Check Server API
  let serverOk = false;
  try {
    const res = await fetch(`${CONFIG.API_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
    const data = await res.json().catch(() => null);
    serverOk = res.ok && data?.status === 'ok';
    console.log(`[Pre-flight] Checking Server on ${CONFIG.API_URL} ... ${serverOk ? 'OK (200)' : 'FAILED (' + res.status + ')'}`);
  } catch (err) {
    console.log(`[Pre-flight] Checking Server on ${CONFIG.API_URL} ... FAILED (${err.message})`);
  }

  if (!clientOk || !serverOk) {
    console.error('\n❌ Pre-flight checks failed! Please ensure both client (port 3000) and server (port 5000) are running.');
    process.exit(1);
  }

  console.log('\nAll pre-flight checks passed. Starting test tiers...\n');
}

function parseTapOutput(output) {
  let tests = 0;
  let pass = 0;
  let fail = 0;
  const failureDetails = [];

  const lines = output.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('ok ')) {
      pass++;
      tests++;
    } else if (trimmed.startsWith('not ok ')) {
      fail++;
      tests++;
      failureDetails.push(trimmed);
    }
  }

  return { tests, pass, fail, failureDetails };
}

async function main() {
  const startTime = Date.now();
  await runPreflightChecks();

  const results = {
    timestamp: new Date().toISOString(),
    durationMs: 0,
    passed: true,
    stats: {
      total: 0,
      passed: 0,
      failed: 0,
      suites: 0
    },
    tiers: {},
    failures: []
  };

  for (const tier of TIERS) {
    console.log(`\n▶ ${tier.name}`);
    const files = fs.readdirSync(tier.dir)
      .filter(f => f.endsWith('.test.mjs'))
      .sort();

    const tierStats = {
      totalSuites: files.length,
      passedSuites: 0,
      failedSuites: 0,
      totalTests: 0,
      passed: 0,
      failed: 0,
      files: []
    };

    for (const file of files) {
      const filePath = path.join(tier.dir, file);
      const testStart = Date.now();

      const proc = spawnSync(process.execPath, ['--test', filePath], {
        encoding: 'utf8',
        cwd: CONFIG.ROOT_DIR,
        env: { ...process.env, CLIENT_URL: CONFIG.CLIENT_URL, API_URL: CONFIG.API_URL }
      });

      const durationMs = Date.now() - testStart;
      const parsed = parseTapOutput(proc.stdout || '');
      const isOk = proc.status === 0 && parsed.fail === 0;

      results.stats.suites++;
      tierStats.totalTests += (parsed.tests || 1);
      results.stats.total += (parsed.tests || 1);

      if (isOk) {
        tierStats.passedSuites++;
        tierStats.passed += (parsed.pass || 1);
        results.stats.passed += (parsed.pass || 1);
        console.log(`  ✔ ${file} (${durationMs}ms)`);
      } else {
        tierStats.failedSuites++;
        tierStats.failed += (parsed.fail || 1);
        results.stats.failed += (parsed.fail || 1);
        results.passed = false;
        console.log(`  ✖ ${file} FAILED (${durationMs}ms)`);
        
        const failureInfo = {
          tier: tier.id,
          file,
          durationMs,
          error: proc.stderr || proc.stdout
        };
        results.failures.push(failureInfo);
        if (proc.stderr) console.error(proc.stderr);
      }

      tierStats.files.push({
        file,
        passed: isOk,
        durationMs,
        tests: parsed.tests,
        pass: parsed.pass,
        fail: parsed.fail
      });
    }

    results.tiers[tier.id] = tierStats;
  }

  const totalDuration = Date.now() - startTime;
  results.durationMs = totalDuration;

  console.log('\n======================================================================');
  console.log('🍬 Test Suite Summary:');
  console.log(`  Total Suites: ${results.stats.suites} | Passed: ${results.stats.suites - results.failures.length} | Failed: ${results.failures.length}`);
  console.log(`  Total Tests:  ${results.stats.total} | Passed: ${results.stats.passed} | Failed: ${results.stats.failed}`);
  console.log(`  Duration:     ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`  Status:       ${results.passed ? 'ALL TIERS PASSED (100% PASS RATE)' : 'TEST FAILURES DETECTED'}`);
  console.log('======================================================================\n');

  // Ensure results directory exists
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const summaryPath = path.join(resultsDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Detailed test summary saved to: ${summaryPath}\n`);

  if (!results.passed) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error executing test runner:', err);
  process.exit(1);
});
