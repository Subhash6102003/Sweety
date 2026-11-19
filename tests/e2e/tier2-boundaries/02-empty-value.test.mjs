import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { getPastDateStr } from '../helpers/fixtures.mjs';

describe('Tier 2 — Boundary Cases: 02 Missing / Empty Glucose Value', () => {
  let client;
  const testDate = getPastDateStr(11);

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
  });

  it('rejects missing value field completely', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)'
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Please enter a glucose value.');
  });

  it('rejects null value', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: null
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Please enter a glucose value.');
  });

  it('rejects empty string value ""', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: ''
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Please enter a glucose value.');
  });
});
