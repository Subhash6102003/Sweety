import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 04 Metabolic Stability Arch Gauge', () => {
  const cardJsx = domInspector.readClientComponent('components/dashboard/MetabolicStabilityCard.jsx');

  it('renders SVG semicircular radial arch with strokeWidth 16', () => {
    assert.ok(cardJsx.includes('<svg'), 'Component must contain <svg> element');
    assert.ok(cardJsx.includes('strokeWidth="16"'), 'Must have thick 16px arc stroke matching Stitch specification');
    assert.ok(cardJsx.includes('d="M 20 100 A 80 80'), 'Must contain SVG arc path geometry');
  });

  it('binds primary clinical theme color to the progress arc', () => {
    assert.ok(
      cardJsx.includes('var(--primary') || cardJsx.includes('#AD2737'),
      'Gauge arc stroke must bind to primary theme CSS variable'
    );
  });

  it('renders metabolic stability score display with tabular-nums', () => {
    assert.ok(cardJsx.includes('tabular-nums'), 'Score display must use tabular numerals for layout stability');
    assert.ok(cardJsx.includes('of 100 index points'), 'Scale must show denominator of 100 index points');
  });

  it('displays CV glycemic variability metric in callout box', () => {
    assert.ok(
      cardJsx.includes('CV is under 16%') || cardJsx.includes('70–140 target corridor'),
      'Must display CV variability and 70-140 target corridor statement'
    );
  });

  it('includes GSAP smooth stroke animation lifecycle hook', () => {
    assert.ok(cardJsx.includes('gsap.fromTo') || cardJsx.includes('gsap.to'), 'Must use GSAP for smooth arc stroke transition');
  });
});
