import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { getPastDateStr, generateUniqueTestEmail } from '../helpers/fixtures.mjs';

describe('Tier 2 — Boundary Cases: 04 Daily 4-Reading Limit', () => {
  let client;
  const testDate = getPastDateStr(2);
  const createdIds = [];

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    const email = generateUniqueTestEmail();
    await client.register('Limit Test User', email, 'Password123!');
  });

  after(async () => {
    for (const id of createdIds) {
      await client.delete(`/api/readings/${id}`);
    }
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('allows logging up to 4 readings in a single day', async () => {
    const slots = [
      { slot: 'Morning (fasting)', value: 92 },
      { slot: 'After breakfast', value: 125 },
      { slot: 'After lunch', value: 138 },
      { slot: 'After dinner', value: 115 }
    ];

    for (const item of slots) {
      const res = await client.post('/api/readings', {
        date: testDate,
        slot: item.slot,
        value: item.value
      });
      assert.strictEqual(res.status, 201, `Failed to create reading for ${item.slot}: ${JSON.stringify(res.body)}`);
      if (res.body.reading?.id) {
        createdIds.push(res.body.reading.id);
      }
    }

    assert.strictEqual(createdIds.length, 4);
  });

  it('strictly rejects any attempt to add a 5th reading on the same day', async () => {
    const fifthRes = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 110
    });

    assert.strictEqual(fifthRes.status, 400);
    assert.strictEqual(fifthRes.body.error, 'You can add only 4 readings per day.');
  });
});
