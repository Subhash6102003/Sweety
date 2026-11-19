import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';
import { generateUniqueTestEmail, getPastDateStr } from '../helpers/fixtures.mjs';

describe('Tier 4 — Scenarios: 02 Full-Day 24h Glycemic Monitoring Cycle', () => {
  let client;
  const testDate = getPastDateStr(1);
  const createdIds = [];

  before(async () => {
    client = new ApiClient(CONFIG.API_URL);
    const email = generateUniqueTestEmail();
    await client.register('Monitoring Patient', email, 'Password123!');
  });

  after(async () => {
    for (const id of createdIds) {
      await client.delete(`/api/readings/${id}`);
    }
    if (client && client.token) {
      await client.delete('/api/auth/me');
    }
  });

  it('Step 1: Log Morning Fasting reading at 95 mg/dL (In-Target)', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'Morning (fasting)',
      value: 95
    });
    assert.strictEqual(res.status, 201);
    createdIds.push(res.body.reading.id);
  });

  it('Step 2: Log Post-Breakfast reading at 132 mg/dL (In-Target)', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'After breakfast',
      value: 132
    });
    assert.strictEqual(res.status, 201);
    createdIds.push(res.body.reading.id);
  });

  it('Step 3: Log Post-Lunch reading at 162 mg/dL (Elevated Excursion >140)', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'After lunch',
      value: 162
    });
    assert.strictEqual(res.status, 201);
    createdIds.push(res.body.reading.id);
  });

  it('Step 4: Log Post-Dinner reading at 120 mg/dL (In-Target Recovery)', async () => {
    const res = await client.post('/api/readings', {
      date: testDate,
      slot: 'After dinner',
      value: 120
    });
    assert.strictEqual(res.status, 201);
    createdIds.push(res.body.reading.id);
  });

  it('Step 5: Daily reports verify exact mathematical calculations: avg 127.3 mg/dL and 75% TIR', async () => {
    const res = await client.get(`/api/reports?date=${testDate}`);
    assert.strictEqual(res.status, 200);

    const { daily } = res.body;
    assert.strictEqual(daily.count, 4);
    assert.strictEqual(daily.lowest, 95);
    assert.strictEqual(daily.highest, 162);
    // (95 + 132 + 162 + 120) / 4 = 127.25 -> rounded to 127.3
    assert.strictEqual(daily.average, 127.3);

    // Compute exact clinical TIR for the day
    const values = daily.readings.map(r => r.value);
    const inTargetCount = values.filter(v => v >= 70 && v <= 140).length;
    const elevatedCount = values.filter(v => v > 140).length;
    const lowCount = values.filter(v => v < 70).length;

    const tirPercent = (inTargetCount / values.length) * 100;
    const elevatedPercent = (elevatedCount / values.length) * 100;
    const lowPercent = (lowCount / values.length) * 100;

    assert.strictEqual(tirPercent, 75, 'TIR must equal 75% (3/4 readings in target)');
    assert.strictEqual(elevatedPercent, 25, 'Elevated must equal 25% (1/4 reading elevated)');
    assert.strictEqual(lowPercent, 0, 'Low must equal 0% (0 readings below 70)');
  });
});
