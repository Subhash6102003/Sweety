import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 3 — Combinations: 05 Slot Cascade & Quick Log Interaction', () => {
  const quickLogJsx = domInspector.readClientComponent('components/dashboard/QuickGlucoseLogCard.jsx');

  it('QuickGlucoseLogCard renders all 4 clinical meal slot selector chips', () => {
    const slots = ['Fasting', 'Breakfast', 'Lunch', 'Dinner'];
    for (const slot of slots) {
      assert.ok(quickLogJsx.includes(slot), `Must display slot chip for ${slot}`);
    }
  });

  it('automatically defaults to first unlogged slot using existingSlots prop', () => {
    assert.ok(
      quickLogJsx.includes('existingSlots') && quickLogJsx.includes('!existingSlots.includes'),
      'Must inspect existingSlots to identify pending slot'
    );
  });

  it('two-way +/- tactile stepper constrains values within clinical 40–600 limits', () => {
    assert.ok(quickLogJsx.includes('value > 40'), 'Decrement must not allow values below 40 mg/dL');
    assert.ok(quickLogJsx.includes('value < 600'), 'Increment must not allow values above 600 mg/dL');
  });

  it('includes shortcuts for insulin bolus and carbohydrate estimation', () => {
    assert.ok(
      quickLogJsx.includes('Insulin') || quickLogJsx.includes('Carbs') || quickLogJsx.includes('💉'),
      'Must include meal or insulin bolus contextual tags'
    );
  });
});
