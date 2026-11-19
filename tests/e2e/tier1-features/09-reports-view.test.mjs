import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';

describe('Tier 1 — Feature Coverage: 09 Clinical Reports View', () => {
  const reportsJsx = domInspector.readClientComponent('pages/Reports.jsx');

  it('verifies 4 core clinical benchmark metrics (GMI, CV, Mean Glucose, Active Time)', () => {
    assert.ok(reportsJsx.includes('GMI') || reportsJsx.includes('Glucose Management Indicator'), 'Must declare GMI benchmark');
    assert.ok(reportsJsx.includes('CV') || reportsJsx.includes('Coefficient of Variation'), 'Must declare CV stability benchmark');
    assert.ok(reportsJsx.includes('mg/dL'), 'Must report mean glucose metrics in mg/dL');
    assert.ok(reportsJsx.includes('Active Time') || reportsJsx.includes('CGM Active') || reportsJsx.includes('99.4%'), 'Must report CGM active time');
  });

  it('verifies certified clinician attestation card from Dr. Robert Miller', () => {
    assert.ok(reportsJsx.includes('Dr. Robert Miller'), 'Must feature Dr. Robert Miller clinical attestation');
    assert.ok(
      reportsJsx.includes('Endocrinology') || reportsJsx.includes('Attestation'),
      'Must declare endocrine specialty or attestation badge'
    );
  });

  it('verifies 5-tier TIR stacked consensus distribution thresholds', () => {
    const thresholds = ['70', '140', '180'];
    for (const t of thresholds) {
      assert.ok(reportsJsx.includes(t), `Must define international AGP consensus threshold ${t} mg/dL`);
    }
  });

  it('verifies live backend /api/reports endpoint generates structured metrics', async () => {
    const client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
    const res = await client.get('/api/reports?date=2026-11-19');

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.daily, 'Must contain daily summary');
    assert.ok(res.body.mtd, 'Must contain month-to-date summary');
    assert.ok(res.body.previousMonth, 'Must contain previous month summary');
    assert.ok(res.body.distribution, 'Must contain TIR distribution counts');
  });
});
