import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { getPastDateStr, generateUniqueTestEmail } from '../helpers/fixtures.mjs';

describe('Tier 2 — Boundary Cases: 03 Slot Uniqueness', () => {
  let client;
  const testDate = getPastDateStr(2);
  let createdId = null;

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    const email = generateUniqueTestEmail();
    await client.register('Slot Test User', email, 'Password123!');
  });

  after(async () => {
    if (createdId) {
      await client.delete(`/api/readings/${createdId}`);
    }
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('rejects duplicate reading for the same slot on the same date', async () => {
    // 1. First reading succeeds
    const firstRes = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 95
    });

    assert.strictEqual(firstRes.status, 201);
    createdId = firstRes.body.reading?.id;

    // 2. Duplicate attempt fails with exact clinical error message
    const duplicateRes = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 102
    });

    assert.strictEqual(duplicateRes.status, 400);
    assert.strictEqual(
      duplicateRes.body.error,
      'You already have an Morning (fasting) reading for this date.'
    );
  });
});
