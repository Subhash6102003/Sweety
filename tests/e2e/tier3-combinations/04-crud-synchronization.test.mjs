import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { getPastDateStr, generateUniqueTestEmail } from '../helpers/fixtures.mjs';

describe('Tier 3 — Combinations: 04 CRUD Synchronization & Real-Time Recalculation', () => {
  let client;
  const testDate = getPastDateStr(3);
  let firstReadingId = null;
  let secondReadingId = null;

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    const email = generateUniqueTestEmail();
    await client.register('Sync Patient', email, 'Password123!');
  });

  after(async () => {
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('verifies clean initial baseline: 0 readings and null report average', async () => {
    const readingsRes = await client.get(`/api/readings?date=${testDate}`);
    assert.strictEqual(readingsRes.status, 200);
    assert.strictEqual(readingsRes.body.readings.length, 0);

    const reportsRes = await client.get(`/api/reports?date=${testDate}`);
    assert.strictEqual(reportsRes.status, 200);
    assert.strictEqual(reportsRes.body.daily.count, 0);
    assert.strictEqual(reportsRes.body.daily.average, null);
  });

  it('POST reading immediately synchronizes with GET readings and daily reports', async () => {
    const postRes = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 100
    });
    assert.strictEqual(postRes.status, 201);
    firstReadingId = postRes.body.reading.id;

    // Verify GET readings immediately returns this reading
    const readingsRes = await client.get(`/api/readings?date=${testDate}`);
    assert.strictEqual(readingsRes.body.readings.length, 1);
    assert.strictEqual(readingsRes.body.readings[0].value, 100);

    // Verify GET reports immediately computes average as 100
    const reportsRes = await client.get(`/api/reports?date=${testDate}`);
    assert.strictEqual(reportsRes.body.daily.count, 1);
    assert.strictEqual(reportsRes.body.daily.average, 100);
  });

  it('second POST immediately updates and recalculates mathematical average', async () => {
    const secondPost = await client.post('/api/readings', {
      date: testDate,
      slot: 'After breakfast',
      value: 140
    });
    assert.strictEqual(secondPost.status, 201);
    secondReadingId = secondPost.body.reading.id;

    // Mathematical average of 100 and 140 is 120.0
    const reportsRes = await client.get(`/api/reports?date=${testDate}`);
    assert.strictEqual(reportsRes.body.daily.count, 2);
    assert.strictEqual(reportsRes.body.daily.lowest, 100);
    assert.strictEqual(reportsRes.body.daily.highest, 140);
    assert.strictEqual(reportsRes.body.daily.average, 120);
  });

  it('DELETE reading removes record and restores original metrics', async () => {
    const delRes = await client.delete(`/api/readings/${secondReadingId}`);
    assert.strictEqual(delRes.status, 200);

    const reportsRes = await client.get(`/api/reports?date=${testDate}`);
    assert.strictEqual(reportsRes.body.daily.count, 1);
    assert.strictEqual(reportsRes.body.daily.average, 100);

    // Clean up first reading
    if (firstReadingId) {
      await client.delete(`/api/readings/${firstReadingId}`);
    }
  });
});
