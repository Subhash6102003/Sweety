import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { getPastDateStr, generateUniqueTestEmail } from '../helpers/fixtures.mjs';

describe('Tier 2 — Boundary Cases: 08 Input Sanitization & Data Integrity', () => {
  let client;
  const testDate = getPastDateStr(2);
  let createdId = null;

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    const email = generateUniqueTestEmail();
    await client.register('Sanitization Test User', email, 'Password123!');
  });

  after(async () => {
    if (createdId) {
      await client.delete(`/api/readings/${createdId}`);
    }
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('rejects non-numeric string values (NaN) with exact clinical range error', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 'one-hundred-twenty'
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Value must be between 40 and 600 mg/dl.');
  });

  it('rejects decimal numbers: values must be whole integers for capillary clinical logs', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 125.8
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Value must be between 40 and 600 mg/dl.');
  });

  it('rejects malicious injection / XSS payloads in glucose value', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: '<script>alert("hack")</script>'
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Value must be between 40 and 600 mg/dl.');
  });

  it('rejects invalid meal slot naming', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Midnight snack',
      value: 120
    });

    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error.includes('Invalid time slot'));
  });

  it('rejects invalid date format strings', async () => {
    const res = await client.post('/api/readings', {
      date: '19/11/2026', // Expected YYYY-MM-DD
      slot: 'Morning (fasting)',
      value: 120
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Invalid date format. Expected YYYY-MM-DD.');
  });

  it('correctly coerces numeric string into valid integer value', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: '115'
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(typeof res.body.reading.value, 'number');
    assert.strictEqual(res.body.reading.value, 115);
    createdId = res.body.reading.id;
  });
});
