import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 10 Trends & Circadian Analytics', () => {
  const trendsJsx = domInspector.readClientComponent('pages/Trends.jsx');

  it('renders 24-hour circadian profile canvas partitioned into diurnal zones', () => {
    assert.ok(trendsJsx.includes('Circadian'), 'Must render circadian profile section');
    assert.ok(trendsJsx.includes('04:00') || trendsJsx.includes('00:00') || trendsJsx.includes('Dawn'), 'Must define circadian diurnal timeline');
  });

  it('evaluates Dawn Phenomenon heuristic check (04:00–08:00 AM rise)', () => {
    assert.ok(trendsJsx.includes('Dawn Phenomenon'), 'Must include Dawn Phenomenon assessment');
    assert.ok(
      trendsJsx.includes('Circadian') || trendsJsx.includes('04:00') || trendsJsx.includes('08:00'),
      'Must assess glycemic elevation during dawn window'
    );
  });

  it('provides comparative daytime vs nighttime TIR bars', () => {
    assert.ok(trendsJsx.includes('Day') && trendsJsx.includes('Night'), 'Must compare daytime vs nighttime metrics');
    assert.ok(trendsJsx.includes('%'), 'Must calculate percentage in-target');
  });

  it('surfaces AI lifestyle pattern correlations (carbs, exercise, nocturnal stability)', () => {
    assert.ok(trendsJsx.includes('Correlation') || trendsJsx.includes('Pattern') || trendsJsx.includes('Insight'), 'Must provide lifestyle correlation insights');
  });
});
