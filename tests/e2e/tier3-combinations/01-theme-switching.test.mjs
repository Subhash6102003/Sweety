import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../config.mjs';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 3 — Combinations: 01 Clinical Theme Switching & Reactivity', () => {
  const themeJsx = domInspector.readClientComponent('context/ThemeContext.jsx');
  const selectorJsx = domInspector.readClientComponent('components/ThemeSelector.jsx');
  const cssContent = domInspector.readClientComponent('index.css');

  it('ThemeContext defines dynamic state switcher across all 4 themes', () => {
    assert.ok(themeJsx.includes('changeTheme'), 'ThemeContext must export changeTheme function');
    assert.ok(themeJsx.includes('localStorage.setItem'), 'Theme switching must persist selection to localStorage');
  });

  it('ThemeSelector UI renders interactive theme options matching 4 Stitch palettes', () => {
    const requiredThemes = ['rose', 'green', 'blue', 'purple'];
    for (const t of requiredThemes) {
      assert.ok(
        selectorJsx.includes(t) || themeJsx.includes(t),
        `Theme selector must support theme option: ${t}`
      );
    }
  });

  it('verifies token synchronization maps CSS variables for each theme', () => {
    const themeBlocks = domInspector.extractThemeCssBlocks(cssContent);
    const themeKeys = Object.keys(CONFIG.THEMES);

    for (const key of themeKeys) {
      const spec = CONFIG.THEMES[key];
      const cssBlock = themeBlocks[key] || themeBlocks['root'];
      assert.ok(cssBlock, `CSS block for theme ${key} must exist`);
      assert.strictEqual(
        cssBlock['--primary']?.toLowerCase(),
        spec.primary.toLowerCase(),
        `Primary color mismatch for ${key}`
      );
      assert.strictEqual(
        cssBlock['--surface']?.toLowerCase(),
        spec.surface.toLowerCase(),
        `Surface color mismatch for ${key}`
      );
    }
  });
});
