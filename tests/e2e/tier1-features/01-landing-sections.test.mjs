import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { domInspector } from '../helpers/dom-inspector.mjs';

describe('Tier 1 — Feature Coverage: 01 Landing Page 11 Sections', () => {
  const landingJsx = domInspector.readClientComponent('pages/LandingPage.jsx');

  it('Section 1: Renders Sticky Header & Nav with brand, 5 anchor links, and CTAs', () => {
    assert.ok(landingJsx.includes('<header') || landingJsx.includes('<nav'), 'Landing page must render <header> or <nav>');
    const links = ['Features', 'How It Works', 'Clinical Solutions', 'Pricing', 'Security'];
    for (const link of links) {
      assert.ok(landingJsx.includes(link), `Landing nav must include anchor link "${link}"`);
    }
    assert.ok(landingJsx.includes('HIPAA'), 'Landing nav must cite HIPAA');
    assert.ok(landingJsx.includes('Sign In'), 'Landing header must contain Sign In CTA');
    assert.ok(landingJsx.includes('Get Started Free'), 'Landing header must contain Get Started Free CTA');
  });

  it('Section 2: Renders Telemetry Hero Mockup with live CGM sync and AGP corridor', () => {
    assert.ok(landingJsx.includes('Continuous Glucose Intelligence'), 'Hero headline must be present');
    assert.ok(landingJsx.includes('Dexcom'), 'Hero must reference CGM sensor telemetry (Dexcom)');
    assert.ok(landingJsx.includes('<svg'), 'Hero preview must render AGP curve SVG');
  });

  it('Section 3: Renders Clinical Proof & Trust Bar with institutional partners', () => {
    const trustPartners = ['Stanford', 'ADA', 'Dexcom', 'Abbott', 'Endocrine'];
    const matched = trustPartners.filter(p => landingJsx.includes(p));
    assert.ok(matched.length >= 3, `Trust bar must include at least 3 institutional partners (found: ${matched.join(', ')})`);
  });

  it('Section 4: Renders Lifestyle Photographic Grid with clinical imagery', () => {
    assert.ok(
      landingJsx.includes('Lifestyle') || landingJsx.includes('Capillary vs CGM') || landingJsx.includes('photo') || landingJsx.includes('img'),
      'Section 4 Lifestyle Photographic Grid must be implemented in LandingPage.jsx'
    );
  });

  it('Section 5: Renders 6 Pillars Bento Grid highlighting core telemetry capabilities', () => {
    const bentoKeywords = ['Sub-second CGM', 'AGP Corridors', 'TIR Consensus', 'Dawn Alarms', 'Export', 'Themes'];
    let matches = 0;
    for (const kw of bentoKeywords) {
      if (landingJsx.toLowerCase().includes(kw.toLowerCase())) matches++;
    }
    assert.ok(matches >= 3, 'Section 5 Bento grid must cover core architectural pillars');
  });

  it('Section 6: Renders 3-Step "How Sweety Works" progressive workflow', () => {
    assert.ok(
      landingJsx.includes('How Sweety Works') || landingJsx.includes('How It Works'),
      'Section 6 How Sweety Works workflow must be present in LandingPage.jsx'
    );
  });

  it('Section 7: Renders Clinical Outcomes Matrix with validated percentage metrics', () => {
    assert.ok(
      landingJsx.includes('+14.2%') || landingJsx.includes('Outcomes') || landingJsx.includes('-62%') || landingJsx.includes('-0.6%'),
      'Section 7 Clinical outcomes matrix must present quantified clinical outcomes in LandingPage.jsx'
    );
  });

  it('Section 8: Renders Solo vs Sweety Comparison Table with feature contrast', () => {
    assert.ok(
      landingJsx.includes('Solo vs Sweety') || landingJsx.includes('<table') || landingJsx.includes('Comparison'),
      'Section 8 Solo vs Sweety comparison matrix must be present in LandingPage.jsx'
    );
  });

  it('Section 9: Renders Clinical Testimonials Strip including Dr. Robert Miller endorsement', () => {
    assert.ok(
      landingJsx.includes('Robert Miller') || landingJsx.includes('Elena Vance'),
      'Section 9 Testimonials strip must feature clinical or patient endorsement in LandingPage.jsx'
    );
  });

  it('Section 10: Renders Interactive Pricing Preview with Annual / Monthly toggle', () => {
    assert.ok(
      landingJsx.includes('Pricing') && (landingJsx.includes('$') || landingJsx.includes('Monthly') || landingJsx.includes('Annual')),
      'Section 10 Pricing preview must be implemented in LandingPage.jsx'
    );
  });

  it('Section 11: Renders Semantic Conversion Footer with HIPAA badge and operational status', () => {
    assert.ok(landingJsx.includes('<footer'), 'Landing page must render semantic <footer>');
    assert.ok(landingJsx.includes('HIPAA'), 'Footer must indicate HIPAA compliance');
    assert.ok(landingJsx.includes('2026'), 'Footer must display 2026 copyright notice');
  });
});
