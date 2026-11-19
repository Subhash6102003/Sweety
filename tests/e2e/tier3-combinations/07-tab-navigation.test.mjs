import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 3 — Combinations: 07 Tab Navigation & Screen Routing', () => {
  const sidebarJsx = domInspector.readClientComponent('components/layout/Sidebar.jsx');
  const appJsx = domInspector.readClientComponent('App.jsx');

  it('renders semantic <aside> element with responsive 72-width navigation bar', () => {
    assert.ok(sidebarJsx.includes('<aside'), 'Sidebar must render semantic <aside> tag');
    assert.ok(sidebarJsx.includes('w-72'), 'Sidebar must enforce fixed 72-width matching Stitch specification');
  });

  it('declares navigation items for all core application modules', () => {
    const modules = ['dashboard', 'history', 'reports', 'trends', 'settings'];
    for (const m of modules) {
      assert.ok(sidebarJsx.includes(`id: '${m}'`), `Sidebar must include navigation target for "${m}"`);
    }
  });

  it('App.jsx binds onSelectTab and manages activeTab dynamic view rendering', () => {
    assert.ok(appJsx.includes('activeTab'), 'App.jsx must hold activeTab state');
    assert.ok(appJsx.includes('onSelectTab'), 'App.jsx must provide onSelectTab handler to Sidebar');
    assert.ok(appJsx.includes("activeTab === 'dashboard'"), 'App.jsx renders Dashboard view for dashboard tab');
    assert.ok(appJsx.includes("activeTab === 'history'"), 'App.jsx renders ReadingHistory view for history tab');
    assert.ok(appJsx.includes('<Reports') || appJsx.includes("activeTab === 'reports'"), 'App.jsx must mount Reports component for reports tab');
    assert.ok(appJsx.includes('<Trends') || appJsx.includes("activeTab === 'trends'"), 'App.jsx must mount Trends component for trends tab');
    assert.ok(appJsx.includes('<Settings') || appJsx.includes("activeTab === 'settings'"), 'App.jsx must mount Settings component for settings tab');
  });
});
