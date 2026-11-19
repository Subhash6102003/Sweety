import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../config.mjs';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 02 Clinical Themes & CSS Tokens', () => {
  const cssContent = domInspector.readClientComponent('index.css');
  const themeJsx = domInspector.readClientComponent('context/ThemeContext.jsx');

  it('declares all 4 clinical themes in CSS custom properties', () => {
    const themeBlocks = domInspector.extractThemeCssBlocks(cssContent);
    
    // Check rose (default), green, blue, purple
    assert.ok(themeBlocks['rose'] || themeBlocks['root'], 'Rose / root theme variables must be defined');
    assert.ok(themeBlocks['green'], 'Sage Green theme variables must be defined');
    assert.ok(themeBlocks['blue'], 'Cerulean Blue theme variables must be defined');
    assert.ok(themeBlocks['purple'], 'Lilac Purple theme variables must be defined');
  });

  it('Warm Clinical Health (Rose) has primary #ad2737 and surface #fff8f7', () => {
    assert.ok(cssContent.includes('#ad2737'), 'Rose primary #ad2737 must exist in index.css');
    assert.ok(cssContent.includes('#fff8f7'), 'Rose surface #fff8f7 must exist in index.css');
    assert.ok(CONFIG.THEMES.rose.primary === '#ad2737');
    assert.ok(CONFIG.THEMES.rose.surface === '#fff8f7');
  });

  it('Clinical Sage Health (Green) has primary #2d8a70 and surface #e9fef3', () => {
    assert.ok(cssContent.includes('#2d8a70'), 'Sage primary #2d8a70 must exist in index.css');
    assert.ok(cssContent.includes('#e9fef3'), 'Sage surface #e9fef3 must exist in index.css');
    assert.ok(CONFIG.THEMES.green.primary === '#2d8a70');
    assert.ok(CONFIG.THEMES.green.surface === '#e9fef3');
  });

  it('Clinical Cerulean (Blue) has primary #0284c7 and surface #faf8ff', () => {
    assert.ok(cssContent.includes('#0284c7'), 'Cerulean primary #0284c7 must exist in index.css');
    assert.ok(cssContent.includes('#faf8ff'), 'Cerulean surface #faf8ff must exist in index.css');
    assert.ok(CONFIG.THEMES.blue.primary === '#0284c7');
    assert.ok(CONFIG.THEMES.blue.surface === '#faf8ff');
  });

  it('Clinical Lilac Health (Purple) has primary #7c3aed and surface #f9f9ff', () => {
    assert.ok(cssContent.includes('#7c3aed'), 'Lilac primary #7c3aed must exist in index.css');
    assert.ok(cssContent.includes('#f9f9ff'), 'Lilac surface #f9f9ff must exist in index.css');
    assert.ok(CONFIG.THEMES.purple.primary === '#7c3aed');
    assert.ok(CONFIG.THEMES.purple.surface === '#f9f9ff');
  });

  it('ThemeContext exports THEMES array and applyThemeTokens function', () => {
    assert.ok(themeJsx.includes('export const THEMES'), 'ThemeContext must export THEMES');
    assert.ok(themeJsx.includes('applyThemeTokens'), 'ThemeContext must export applyThemeTokens');
    assert.ok(themeJsx.includes('useTheme'), 'ThemeContext must export useTheme hook');
  });

  it('Live client HTML served at port 3000 specifies data-theme="rose" as default', async () => {
    const liveHtml = await domInspector.fetchLiveHtml(CONFIG.CLIENT_URL);
    assert.ok(
      liveHtml.includes('data-theme="rose"') || liveHtml.includes("data-theme='rose'"),
      'Live document must have default data-theme="rose"'
    );
  });
});
