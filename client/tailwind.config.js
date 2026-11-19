/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${variableName})`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': withOpacity('--primary'),
        'primary-container': withOpacity('--primary-container'),
        'primary-hover': withOpacity('--primary-hover'),
        'primary-fixed': withOpacity('--primary-fixed'),
        'primary-fixed-dim': withOpacity('--primary-fixed-dim'),
        'on-primary': withOpacity('--on-primary'),
        'on-primary-fixed': withOpacity('--on-primary-fixed'),
        'on-primary-fixed-variant': withOpacity('--on-primary-fixed-variant'),
        'on-primary-container': withOpacity('--on-primary-container'),
        'secondary': withOpacity('--secondary'),
        'secondary-container': withOpacity('--secondary-container'),
        'secondary-fixed': withOpacity('--secondary-fixed'),
        'secondary-fixed-dim': withOpacity('--secondary-fixed-dim'),
        'on-secondary': withOpacity('--on-secondary'),
        'on-secondary-fixed': withOpacity('--on-secondary-fixed'),
        'on-secondary-fixed-variant': withOpacity('--on-secondary-fixed-variant'),
        'on-secondary-container': withOpacity('--on-secondary-container'),
        'tertiary': withOpacity('--tertiary'),
        'tertiary-container': withOpacity('--tertiary-container'),
        'tertiary-fixed': withOpacity('--tertiary-fixed'),
        'tertiary-fixed-dim': withOpacity('--tertiary-fixed-dim'),
        'on-tertiary': withOpacity('--on-tertiary'),
        'on-tertiary-fixed': withOpacity('--on-tertiary-fixed'),
        'on-tertiary-fixed-variant': withOpacity('--on-tertiary-fixed-variant'),
        'on-tertiary-container': withOpacity('--on-tertiary-container'),
        'in-target': withOpacity('--in-target'),
        'background': withOpacity('--background'),
        'on-background': withOpacity('--on-background'),
        'surface': withOpacity('--surface'),
        'surface-bright': withOpacity('--surface-bright'),
        'surface-dim': withOpacity('--surface-dim'),
        'surface-variant': withOpacity('--surface-variant'),
        'surface-container-lowest': withOpacity('--surface-container-lowest'),
        'surface-container-low': withOpacity('--surface-container-low'),
        'surface-container': withOpacity('--surface-container'),
        'surface-container-high': withOpacity('--surface-container-high'),
        'surface-container-highest': withOpacity('--surface-container-highest'),
        'inverse-surface': withOpacity('--inverse-surface'),
        'inverse-on-surface': withOpacity('--inverse-on-surface'),
        'inverse-primary': withOpacity('--inverse-primary'),
        'on-surface': withOpacity('--on-surface'),
        'on-surface-variant': withOpacity('--on-surface-variant'),
        'outline': withOpacity('--outline'),
        'outline-variant': withOpacity('--outline-variant'),
        'error': withOpacity('--error'),
        'error-container': withOpacity('--error-container'),
        'on-error': withOpacity('--on-error'),
        'on-error-container': withOpacity('--on-error-container'),
        'chart-line': withOpacity('--chart-line'),
        'chart-fill': 'var(--chart-fill)',
      },
      spacing: {
        'space-xs': '0.25rem',  // 4px
        'space-sm': '0.5rem',   // 8px
        'space-md': '1rem',     // 16px
        'space-lg': '1.5rem',   // 24px
        'space-xl': '2rem',     // 32px
        'space-2xl': '3rem',    // 48px
        'gutter': '1.25rem',    // 20px
        'gutter-sm': '0.75rem',
        'gutter-lg': '1.5rem',  // 24px
        'margin': '1rem',
        'margin-md': '1.5rem',
        'margin-lg': '2rem',
        'margin-desktop': '2.5rem',
        'margin-mobile': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        'display-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-lg-mobile': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-md': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-sm': ['Plus Jakarta Sans', 'sans-serif'],
        'title-md': ['Plus Jakarta Sans', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        'label-lg': ['Inter', 'sans-serif'],
        'label-md': ['Plus Jakarta Sans', 'sans-serif'],
        'label-sm': ['Plus Jakarta Sans', 'sans-serif'],
        'data-metric': ['Plus Jakarta Sans', 'sans-serif'],
        'metric-display': ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.025em', fontWeight: '700' }],
        'headline-lg': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg-mobile': ['1.625rem', { lineHeight: '2.125rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-md': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-md': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.005em', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['0.8125rem', { lineHeight: '1.125rem', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.04em', fontWeight: '700' }],
        'data-metric': ['1.75rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '700' }],
        'metric-display': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      transitionTimingFunction: {
        'snappy': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '180': '180ms',
      }
    },
  },
  plugins: [],
}
