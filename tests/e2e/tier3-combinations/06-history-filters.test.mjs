import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 3 — Combinations: 06 History Multi-Criteria Filtering & Metrics', () => {
  let client;
  const historyJsx = domInspector.readClientComponent('pages/ReadingHistory.jsx');

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
  });

  it('ReadingHistory defines slot filtering tabs for all 4 slots plus All Readings', () => {
    assert.ok(historyJsx.includes('All Readings'), 'Filter tabs must include All Readings');
    assert.ok(historyJsx.includes('Morning (fasting)'), 'Filter tabs must include Morning fasting');
    assert.ok(historyJsx.includes('After breakfast'), 'Filter tabs must include After breakfast');
    assert.ok(historyJsx.includes('After lunch'), 'Filter tabs must include After lunch');
    assert.ok(historyJsx.includes('After dinner'), 'Filter tabs must include After dinner');
  });

  it('ReadingHistory integrates search input filtering', () => {
    assert.ok(historyJsx.includes('searchQuery') && historyJsx.includes('filteredReadings'), 'Component must compute filteredReadings based on query');
  });

  it('verifies server API pagination parameters (page, limit) filter results', async () => {
    const res = await client.get('/api/readings?page=1&limit=5');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.pagination, 'Response must include pagination metadata');
    assert.strictEqual(res.body.pagination.page, 1);
    assert.strictEqual(res.body.pagination.limit, 5);
    assert.ok(res.body.readings.length <= 5);
  });
});
