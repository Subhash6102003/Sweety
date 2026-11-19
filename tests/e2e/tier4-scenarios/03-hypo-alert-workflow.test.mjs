import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { domInspector } from '../helpers/dom-inspector.mjs';
import { generateUniqueTestEmail, getPastDateStr } from '../helpers/fixtures.mjs';

describe('Tier 4 — Scenarios: 03 Hypoglycemic Alert & ADA Rule of 15 Workflow', () => {
  let client;
  const testDate = getPastDateStr(4);
  let hypoReadingId = null;
  const logJsx = domInspector.readClientComponent('components/QuickLogModal.jsx');

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    const email = generateUniqueTestEmail();
    await client.register('Hypo Test Patient', email, 'Password123!');
  });

  after(async () => {
    if (hypoReadingId) {
      await client.delete(`/api/readings/${hypoReadingId}`);
    }
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('Step 1: Log acute hypoglycemic reading at 58 mg/dL (< 70 mg/dL threshold)', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 58
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.reading.value, 58);
    hypoReadingId = res.body.reading.id;
  });

  it('Step 2: Reports engine identifies reading below 70 mg/dL as acute Low event', async () => {
    const res = await client.get(`/api/reports?date=${testDate}`);
    assert.strictEqual(res.status, 200);

    const reading = res.body.daily.readings.find(r => r.id === hypoReadingId);
    assert.ok(reading, 'Logged reading must be present in daily reports');
    assert.ok(reading.value < 70, 'Reading must be strictly below clinical 70 mg/dL target');
    assert.strictEqual(res.body.daily.lowest, 58);
  });

  it('Step 3: Verification of ADA Clinical Rule of 15 Emergency Guidance content', () => {
    assert.ok(logJsx.includes('Clinical Rule of 15') || logJsx.includes('Rule of 15'), 'Must declare "Rule of 15" header');
    assert.ok(logJsx.includes('15g') || logJsx.includes('carbohydrate'), 'Must specify fast-acting carbohydrate intake');
    assert.ok(logJsx.includes('15') && (logJsx.includes('min') || logJsx.includes('minute')), 'Must instruct 15-minute re-test interval');
    assert.ok(logJsx.includes('70'), 'Must cite 70 mg/dL threshold for hypoglycemic intervention');
  });
});
