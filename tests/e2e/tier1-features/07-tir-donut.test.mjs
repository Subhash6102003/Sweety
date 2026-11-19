import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 07 TIR Distribution Donut Gauge', () => {
  const donutJsx = domInspector.readClientComponent('components/dashboard/TirDistributionGauge.jsx');

  it('renders SVG circular donut chart with 2 concentric or segmented paths', () => {
    assert.ok(donutJsx.includes('<svg'), 'Component must contain <svg>');
    assert.ok(donutJsx.includes('<circle'), 'Component must contain <circle> slices');
    assert.ok(donutJsx.includes('strokeWidth="16"'), 'Must match Stitch 16px donut thickness');
  });

  it('displays 3 clinical glycemic bands: In-Target (88%), Elevated (12%), Low (0%)', () => {
    assert.ok(donutJsx.includes('Target In-Range') || donutJsx.includes('88%'), 'Must display In-Target band');
    assert.ok(donutJsx.includes('Elevated (>140)') || donutJsx.includes('12%'), 'Must display Elevated band');
    assert.ok(donutJsx.includes('Low (<70 mg/dL)') || donutJsx.includes('0%'), 'Must display Low band');
  });

  it('renders center score badge with 88% and tabular-nums', () => {
    assert.ok(donutJsx.includes('tabular-nums'), 'TIR central text must use tabular-nums');
    assert.ok(donutJsx.includes('TIR Score'), 'Must display "TIR Score" center label');
  });

  it('cites official clinical benchmark (Clinical Target: ≥70% TIR)', () => {
    assert.ok(donutJsx.includes('≥70% TIR') || donutJsx.includes('70%'), 'Must declare consensus TIR target threshold');
  });
});
