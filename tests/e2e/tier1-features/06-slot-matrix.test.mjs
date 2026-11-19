import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 06 Slot Compliance Heatmap Matrix', () => {
  const matrixJsx = domInspector.readClientComponent('components/dashboard/SlotComplianceMatrix.jsx');

  it('renders 4x7 clinical matrix covering all 4 daily slots across 7 days', () => {
    const slots = ['Fasting', 'Breakfast', 'Lunch', 'Dinner'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (const s of slots) {
      assert.ok(matrixJsx.includes(s), `Matrix must contain row for slot "${s}"`);
    }
    for (const d of days) {
      assert.ok(matrixJsx.includes(d), `Matrix must contain column for day "${d}"`);
    }
  });

  it('utilizes semantic <table>, <thead>, <tbody>, <tr>, <th>, <td> elements', () => {
    const tags = domInspector.assertSemanticTags(matrixJsx, ['table', 'thead', 'tbody', 'tr', 'th', 'td']);
    assert.ok(tags.valid, `Matrix must render clean semantic table. Missing: ${tags.missing.join(', ')}`);
  });

  it('differentiates recorded readings, elevated spikes, and pending slots', () => {
    assert.ok(matrixJsx.includes('Pending'), 'Must handle pending / unrecorded slot state');
    assert.ok(matrixJsx.includes('isSpike'), 'Must apply distinct styling to elevated excursions');
    assert.ok(matrixJsx.includes('tabular-nums'), 'Matrix numbers must use tabular-nums');
  });

  it('displays weekly adherence summary (e.g. 27 of 28 readings, 96.4% Compliance)', () => {
    assert.ok(
      matrixJsx.includes('Compliance Rate') || matrixJsx.includes('expected readings recorded'),
      'Must display weekly compliance adherence rate'
    );
  });
});
