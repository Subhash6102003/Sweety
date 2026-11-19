import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 3 — Combinations: 03 App Mode Transition (Landing -> App Shell)', () => {
  const appJsx = domInspector.readClientComponent('App.jsx');
  const landingJsx = domInspector.readClientComponent('pages/LandingPage.jsx');
  const authModalJsx = domInspector.readClientComponent('components/AuthModal.jsx');

  it('App.jsx declares dual appMode state (landing vs app)', () => {
    assert.ok(appJsx.includes("appMode === 'landing'"), 'App.jsx must differentiate landing mode');
    assert.ok(appJsx.includes('sweety_token'), 'App.jsx checks existing session token for initial routing');
  });

  it('LandingPage exposes onGetStarted and onSignIn invocation triggers', () => {
    assert.ok(landingJsx.includes('onGetStarted'), 'LandingPage must accept onGetStarted prop');
    assert.ok(landingJsx.includes('onSignIn'), 'LandingPage must accept onSignIn prop');
  });

  it('handleGetStartedOrDemo authenticates demo patient and transitions to app shell', () => {
    assert.ok(appJsx.includes('handleGetStartedOrDemo'), 'App.jsx must define demo transition handler');
    assert.ok(appJsx.includes("setAppMode('app')"), 'Must switch mode to app upon successful authentication');
    assert.ok(appJsx.includes("setActiveTab('dashboard')"), 'Must navigate to dashboard upon login transition');
  });

  it('AuthModal onSuccess transitions mode to app shell and mounts Sidebar', () => {
    assert.ok(appJsx.includes('<Sidebar'), 'App shell must mount persistent 72-width Sidebar');
    assert.ok(appJsx.includes('<TopHeader'), 'App shell must mount fixed Telemetry TopHeader');
  });
});
