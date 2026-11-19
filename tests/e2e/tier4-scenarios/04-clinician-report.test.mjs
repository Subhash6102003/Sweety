import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 4 — Scenarios: 04 30-Day Clinician Report & AGP Consensus', () => {
  let client;
  const reportsJsx = domInspector.readClientComponent('pages/Reports.jsx');

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
  });

  it('Step 1: Queries complete 30-day AGP clinical dataset via /api/reports', async () => {
    const res = await client.get('/api/reports?date=2026-11-19');
    assert.strictEqual(res.status, 200);

    // Verify 30-day trend telemetry array
    assert.ok(Array.isArray(res.body.trend), 'Report must include 30-day trend array');
    assert.ok(res.body.trend.length >= 30, 'Trend dataset must include historical days');

    // Chronological order verification
    for (let i = 1; i < res.body.trend.length; i++) {
      const prev = res.body.trend[i - 1].reading_date;
      const curr = res.body.trend[i].reading_date;
      assert.ok(prev <= curr, `Trend must be sorted chronologically: ${prev} <= ${curr}`);
    }
  });

  it('Step 2: Verifies MTD and Previous Month longitudinal comparison metrics', async () => {
    const res = await client.get('/api/reports?date=2026-11-19');
    assert.strictEqual(res.status, 200);

    const { mtd, previousMonth } = res.body;
    assert.ok(mtd.count > 0, 'MTD readings count must be positive');
    assert.ok(typeof mtd.average === 'number', 'MTD average must be numeric');
    assert.ok(previousMonth.count > 0, 'Previous month readings count must be positive');
    assert.ok(typeof previousMonth.average === 'number', 'Previous month average must be numeric');
    assert.ok(previousMonth.range.includes('–'), 'Previous month must format date range');
  });

  it('Step 3: Verifies cumulative distribution counts in reports payload', async () => {
    const res = await client.get('/api/reports?date=2026-11-19');
    const { distribution } = res.body;

    assert.ok(typeof distribution.low_count === 'number', 'low_count must be numeric');
    assert.ok(typeof distribution.in_target_count === 'number', 'in_target_count must be numeric');
    assert.ok(typeof distribution.high_count === 'number', 'high_count must be numeric');
    assert.ok(distribution.in_target_count > distribution.low_count, 'In-target counts should exceed low count in stable patient');
  });

  it('Step 4: Certified Doctor Attestation card matches Dr. Robert Miller credentials', () => {
    assert.ok(reportsJsx.includes('Dr. Robert Miller'), 'Clinician attestation must name Dr. Robert Miller');
    assert.ok(reportsJsx.includes('Endocrinology'), 'Must state Endocrinology department');
    assert.ok(reportsJsx.includes('Sharing active') || reportsJsx.includes('Active'), 'Must display active sharing status badge');
  });
});
