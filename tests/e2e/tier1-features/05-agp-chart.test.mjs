import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 05 AGP Glycemic Curve & Corridor', () => {
  const agpJsx = domInspector.readClientComponent('components/dashboard/AmbulatoryGlucoseProfileChart.jsx');

  it('renders Ambulatory Glucose Profile (AGP) header and 7-day scope badge', () => {
    assert.ok(agpJsx.includes('Ambulatory Glucose Profile (AGP)'), 'Title must be present');
    assert.ok(agpJsx.includes('Last 7 Days'), 'Scope badge must indicate Last 7 Days');
  });

  it('configures clinical target corridor (70–140 mg/dL) reference area', () => {
    assert.ok(agpJsx.includes('y1={70}') && agpJsx.includes('y2={140}'), 'ReferenceArea must bound 70 to 140 mg/dL');
    assert.ok(agpJsx.includes('y={140}') && agpJsx.includes('y={70}'), 'ReferenceLine boundaries at 70 and 140 must exist');
  });

  it('renders excursion callout popover for Thursday post-lunch spike (158 mg/dL)', () => {
    assert.ok(agpJsx.includes('Thu'), 'Excursion popover must reference Thursday spike');
    assert.ok(agpJsx.includes('158 mg/dL'), 'Must display 158 mg/dL spike');
    assert.ok(agpJsx.includes('Elevated') || agpJsx.includes('Post-Lunch Spike'), 'Must indicate excursion context');
  });

  it('renders statistical footer metrics with tabular numerals', () => {
    assert.ok(agpJsx.includes('7-Day Mean Glucose'), 'Must show 7-Day Mean Glucose footer metric');
    assert.ok(agpJsx.includes('Highest Peak'), 'Must show Highest Peak metric');
    assert.ok(agpJsx.includes('Lowest Fasting'), 'Must show Lowest Fasting metric');
    assert.ok(agpJsx.includes('Ambulatory CV'), 'Must show Ambulatory CV metric');
    assert.ok(agpJsx.includes('tabular-nums'), 'Metrics must use tabular-nums');
  });
});
