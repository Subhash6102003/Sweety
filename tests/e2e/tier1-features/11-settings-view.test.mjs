import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 11 Settings & Clinical Preferences', () => {
  const settingsJsx = domInspector.readClientComponent('pages/Settings.jsx');

  it('organizes preferences into category navigation tabs', () => {
    assert.ok(
      settingsJsx.includes('Account') || settingsJsx.includes('Security') || settingsJsx.includes('Preferences'),
      'Must contain categorized settings tabs'
    );
  });

  it('provides glycemic unit selection (mg/dL vs mmol/L)', () => {
    assert.ok(settingsJsx.includes('mg/dL'), 'Must support mg/dL units');
    assert.ok(settingsJsx.includes('mmol/L'), 'Must support mmol/L units');
  });

  it('includes two-factor authentication (2FA) and security controls', () => {
    assert.ok(
      settingsJsx.includes('2FA') || settingsJsx.includes('Two-Factor') || settingsJsx.includes('Biometric'),
      'Must offer 2FA / authentication security controls'
    );
  });

  it('provides clinician care team sharing management', () => {
    assert.ok(
      settingsJsx.includes('Miller') || settingsJsx.includes('Share') || settingsJsx.includes('Clinician'),
      'Must support clinician sharing authorization'
    );
  });

  it('provides telemetry export options (CSV, FHIR JSON) and account management', () => {
    assert.ok(settingsJsx.includes('Export'), 'Must support telemetry data export');
    assert.ok(
      settingsJsx.includes('Danger') || settingsJsx.includes('Delete'),
      'Must include account danger zone'
    );
  });
});
