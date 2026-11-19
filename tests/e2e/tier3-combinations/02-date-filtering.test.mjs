import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 3 — Combinations: 02 Date Picker & Telemetry Shifting', () => {
  let client;
  const topHeaderJsx = domInspector.readClientComponent('components/layout/TopHeader.jsx');
  const dashboardJsx = domInspector.readClientComponent('pages/Dashboard.jsx');

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
  });

  it('TopHeader and Dashboard contracts support selectedDate and onDateChange', () => {
    assert.ok(topHeaderJsx.includes('selectedDate'), 'TopHeader must receive selectedDate prop');
    assert.ok(topHeaderJsx.includes('onDateChange'), 'TopHeader must provide onDateChange callback');
    assert.ok(dashboardJsx.includes('selectedDate'), 'Dashboard must receive selectedDate prop');
  });

  it('switching query date to 2026-11-19 returns today telemetry dataset', async () => {
    const res = await client.get('/api/reports?date=2026-11-19');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.selectedDate, '2026-11-19');
    assert.strictEqual(res.body.daily.range, '2026-11-19');
    assert.ok(Array.isArray(res.body.daily.readings));
  });

  it('switching query date to 2026-11-18 shifts daily metrics and returns day-specific logs', async () => {
    const res = await client.get('/api/reports?date=2026-11-18');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.selectedDate, '2026-11-18');
    assert.strictEqual(res.body.daily.range, '2026-11-18');
    
    // Check that all returned daily readings match 2026-11-18
    for (const r of res.body.daily.readings) {
      assert.strictEqual(r.reading_date, '2026-11-18');
    }
  });
});
