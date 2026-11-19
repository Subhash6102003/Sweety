import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { getPastDateStr, generateUniqueTestEmail } from '../helpers/fixtures.mjs';

describe('Tier 2 — Boundary Cases: 01 Glucose Range (40–600 mg/dL)', () => {
  let client;
  const testDate = getPastDateStr(2);
  const createdIds = [];

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    const email = generateUniqueTestEmail();
    await client.register('Range Test User', email, 'Password123!');
  });

  after(async () => {
    for (const id of createdIds) {
      await client.delete(`/api/readings/${id}`);
    }
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('rejects lower boundary violation: 39 mg/dL with exact clinical error', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 39
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Value must be between 40 and 600 mg/dl.');
  });

  it('rejects upper boundary violation: 601 mg/dL with exact clinical error', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 601
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Value must be between 40 and 600 mg/dl.');
  });

  it('accepts exact lower boundary: 40 mg/dL', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 40
    });

    assert.strictEqual(res.status, 201);
    assert.ok(res.body.reading);
    assert.strictEqual(res.body.reading.value, 40);
    if (res.body.reading.id) createdIds.push(res.body.reading.id);
  });

  it('accepts exact upper boundary: 600 mg/dL', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'After breakfast',
      value: 600
    });

    assert.strictEqual(res.status, 201);
    assert.ok(res.body.reading);
    assert.strictEqual(res.body.reading.value, 600);
    if (res.body.reading.id) createdIds.push(res.body.reading.id);
  });
});
