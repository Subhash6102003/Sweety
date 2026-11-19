import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';
import { ApiClient } from '../helpers/api-client.mjs';
import { CONFIG } from '../config.mjs';

describe('Tier 1 — Feature Coverage: 03 Dashboard KPI Strip', () => {
  const kpiJsx = domInspector.readClientComponent('components/dashboard/KpiCards.jsx');

  it('renders all 4 clinical KPI cards in the strip', () => {
    assert.ok(kpiJsx.includes("Today's Avg Glucose"), 'Card 1: Today\'s Avg Glucose must be present');
    assert.ok(kpiJsx.includes('Time in Range (TIR)'), 'Card 2: Time in Range (TIR) must be present');
    assert.ok(kpiJsx.includes('Scheduled Readings'), 'Card 3: Scheduled Readings must be present');
    assert.ok(kpiJsx.includes('Estimated HbA1c'), 'Card 4: Estimated HbA1c must be present');
  });

  it('implements anti-slop tabular-nums typography to prevent layout jitter', () => {
    assert.ok(
      kpiJsx.includes('tabular-nums'),
      'Animated numbers in KPI cards must use tabular-nums class for stability'
    );
  });

  it('verifies 4/4 sync indicator with SVG circular progress ring', () => {
    assert.ok(kpiJsx.includes('<svg') && kpiJsx.includes('strokeDasharray'), 'Scheduled readings card must render SVG circular progress');
    assert.ok(kpiJsx.includes('/ 4'), 'Must show target of 4 daily checks');
  });

  it('verifies clinical target references (<6.5% HbA1c, >70% TIR)', () => {
    assert.ok(
      kpiJsx.includes('70%') || kpiJsx.includes('&gt; 70%'),
      'TIR target benchmark >70% must be stated'
    );
    assert.ok(
      kpiJsx.includes('6.5%') || kpiJsx.includes('5.9'),
      'HbA1c target benchmark must be stated'
    );
  });

  it('verifies live reports API computes average glucose correctly', async () => {
    const client = new ApiClient(CONFIG.API_URL);
    await client.login(CONFIG.DEMO_USER.email, CONFIG.DEMO_USER.password);
    const res = await client.get('/api/reports?date=2026-11-19');
    
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.daily, 'Response must contain daily metrics');
    assert.strictEqual(typeof res.body.daily.average, 'number');
    assert.strictEqual(res.body.daily.average, 125.5);
  });
});
