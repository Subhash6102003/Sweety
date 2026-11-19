import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 12 Authentication & Clinical Onboarding', () => {
  const authModalJsx = domInspector.readClientComponent('components/AuthModal.jsx');

  it('renders credential input fields for email and password', () => {
    assert.ok(authModalJsx.includes('email') && authModalJsx.includes('password'), 'Auth modal must include email and password fields');
    assert.ok(authModalJsx.includes('type="email"') || authModalJsx.includes("type='email'"), 'Auth modal must include email input');
    assert.ok(authModalJsx.includes('type="password"') || authModalJsx.includes("type='password'"), 'Auth modal must include password input');
  });

  it('provides single-click demo account auto-fill helper', () => {
    assert.ok(authModalJsx.includes('handleDemoFill') || authModalJsx.includes('demo@sweety.app'), 'Auth modal must provide demo credentials quick-fill');
  });

  it('renders password strength evaluation in clinical registration', () => {
    assert.ok(
      authModalJsx.includes('Password') && (authModalJsx.includes('Strength') || authModalJsx.includes('meter') || authModalJsx.includes('strength')),
      'Registration form must render password strength meter in AuthModal.jsx'
    );
  });

  it('includes clinical condition tags (Type 1, Type 2, Gestational)', () => {
    assert.ok(authModalJsx.includes('Type 1'), 'Must include Type 1 condition tag in AuthModal.jsx');
    assert.ok(authModalJsx.includes('Type 2'), 'Must include Type 2 condition tag in AuthModal.jsx');
    assert.ok(authModalJsx.includes('Gestational'), 'Must include Gestational diabetes option in AuthModal.jsx');
  });
});
