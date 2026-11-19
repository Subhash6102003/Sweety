import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';

describe('Tier 1 — Feature Coverage: 08 History Table & Audit Log', () => {
  const historyJsx = domInspector.readClientComponent('pages/ReadingHistory.jsx');

  it('renders telemetry table with semantic <table>, <thead>, <tbody> tags', () => {
    const tags = domInspector.assertSemanticTags(historyJsx, ['table', 'thead', 'tbody', 'th', 'tr', 'td']);
    assert.ok(tags.valid, `History view must render clean semantic table. Missing: ${tags.missing.join(', ')}`);
  });

  it('verifies columns for slot, glucose value, nutrition/carbs, and actions', () => {
    const requiredCols = ['Slot', 'Glucose', 'Carbs', 'Actions'];
    for (const col of requiredCols) {
      assert.ok(
        historyJsx.includes(col),
        `Table must contain column concept: ${col}`
      );
    }
  });

  it('renders search filter input and slot category filter buttons', () => {
    assert.ok(historyJsx.includes('Search') || historyJsx.includes('placeholder='), 'Must render search input');
    assert.ok(historyJsx.includes('FILTER_TABS'), 'Must provide meal slot filter tabs');
  });

  it('verifies live readings endpoint returns seeded history rows', async () => {
    const client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
    const res = await client.get('/api/readings');

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.readings), 'Readings must be an array');
    assert.ok(res.body.readings.length > 0, 'Should return at least 1 reading');
    
    const sample = res.body.readings[0];
    assert.ok(sample.slot, 'Reading must have a slot');
    assert.ok(typeof sample.value === 'number', 'Reading must have a numeric value');
  });

  it('provides clinical export capability (Export Clinical CSV)', () => {
    assert.ok(
      historyJsx.includes('exportCSV') || historyJsx.includes('Export Clinical CSV'),
      'History view must offer telemetry CSV export'
    );
  });
});
