import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { getFutureDateStr } from '../helpers/fixtures.mjs';

describe('Tier 2 — Boundary Cases: 05 Future Date Rejection', () => {
  let client;

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
  });

  it('rejects tomorrow date with exact clinical error message', async () => {
    const tomorrow = getFutureDateStr(1);
    const res = await client.post('/api/readings', {
      date: tomorrow,
      slot: 'Morning (fasting)',
      value: 100
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Date cannot be in the future.');
  });

  it('rejects date 1 year in the future', async () => {
    const nextYear = getFutureDateStr(365);
    const res = await client.post('/api/readings', {
      date: nextYear,
      slot: 'Morning (fasting)',
      value: 100
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Date cannot be in the future.');
  });
});
