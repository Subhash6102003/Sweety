import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';

describe('Tier 2 — Boundary Cases: 06 Unauthenticated Requests & Security', () => {
  const client = new ApiClient(CONFIG.API_URL);

  it('rejects GET /api/readings without Bearer token (401 Unauthorized)', async () => {
    client.clearToken();
    const res = await client.get('/api/readings');
    assert.strictEqual(res.status, 401);
  });

  it('rejects POST /api/readings without Bearer token (401 Unauthorized)', async () => {
    client.clearToken();
    const res = await client.post('/api/readings', {
      date: '2026-11-19',
      slot: 'Morning (fasting)',
      value: 100
    });
    assert.strictEqual(res.status, 401);
  });

  it('rejects GET /api/reports without Bearer token (401 Unauthorized)', async () => {
    client.clearToken();
    const res = await client.get('/api/reports');
    assert.strictEqual(res.status, 401);
  });

  it('rejects forged / corrupted JWT token (401 Unauthorized)', async () => {
    client.setToken('invalid.bearer.signature');
    const res = await client.get('/api/readings');
    assert.strictEqual(res.status, 401);
  });
});
