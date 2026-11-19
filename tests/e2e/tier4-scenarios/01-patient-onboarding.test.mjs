import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { generateUniqueTestEmail, getTodayStr } from '../helpers/fixtures.mjs';

describe('Tier 4 — Scenarios: 01 Patient Onboarding & First Telemetry Log', () => {
  const client = new ApiClient(CONFIG.API_URL);
  const userEmail = generateUniqueTestEmail();
  const userName = 'Sarah Connor';
  let createdReadingId = null;

  after(async () => {
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('Step 1: Patient registers new account and receives JWT authentication session', async () => {
    const res = await client.register(userName, userEmail, 'SecurePass2026!');
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.token, 'Registration must return valid JWT session token');
    assert.strictEqual(res.body.user.name, userName);
    assert.strictEqual(res.body.user.email, userEmail.toLowerCase());
  });

  it('Step 2: Patient retrieves authenticated profile (GET /api/auth/me)', async () => {
    const res = await client.get('/api/auth/me');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.email, userEmail.toLowerCase());
    assert.strictEqual(res.body.user.name, userName);
  });

  it('Step 3: Patient logs their first Fasting glucose reading (95 mg/dL)', async () => {
    const today = getTodayStr();
    const res = await client.post('/api/readings', {
      date: today,
      slot: 'Morning (fasting)',
      value: 95
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.reading.value, 95);
    assert.strictEqual(res.body.reading.slot, 'Morning (fasting)');
    createdReadingId = res.body.reading.id;
  });

  it('Step 4: Newly onboarded patient dashboard reports show 1 reading and 95.0 mg/dL baseline', async () => {
    const today = getTodayStr();
    const res = await client.get(`/api/reports?date=${today}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.daily.count, 1);
    assert.strictEqual(res.body.daily.average, 95.0);
    assert.strictEqual(res.body.daily.lowest, 95);
    assert.strictEqual(res.body.daily.highest, 95);

    // Teardown
    if (createdReadingId) {
      await client.delete(`/api/readings/${createdReadingId}`);
    }
  });
});
