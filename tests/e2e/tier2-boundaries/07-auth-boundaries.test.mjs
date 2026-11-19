import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { generateUniqueTestEmail } from '../helpers/fixtures.mjs';

describe('Tier 2 — Boundary Cases: 07 Auth Invariants & Credentials Boundaries', () => {
  const client = new ApiClient(CONFIG.API_URL);

  after(async () => {
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('rejects password shorter than 6 characters during registration', async () => {
    const email = generateUniqueTestEmail();
    const res = await client.register('Test User', email, '12345');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Password must be at least 6 characters long.');
  });

  it('rejects missing or whitespace name during registration', async () => {
    const email = generateUniqueTestEmail();
    const res = await client.register('   ', email, 'validPass123!');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Name is required.');
  });

  it('rejects missing email during registration', async () => {
    const res = await client.register('Test User', '', 'validPass123!');

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.error, 'Email is required.');
  });

  it('rejects duplicate email registration with HTTP 409 Conflict', async () => {
    // Attempt to register with demo user email which already exists
    const res = await client.register('Duplicate Demo', CONFIG.DEMO_USER.email, 'Password123!');

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.error, 'An account with this email already exists.');
  });

  it('rejects login with incorrect password with HTTP 401', async () => {
    const res = await client.login(CONFIG.DEMO_USER.email, 'WrongPassword999!');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error, 'Invalid email or password.');
  });
});
