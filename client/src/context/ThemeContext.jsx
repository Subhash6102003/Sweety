import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

/**
 * 4 Official Clinical Themes synchronized with Google Stitch Project 306623237418365832
 * 1. Warm Clinical Health (Default Primary, key: 'rose')
 * 2. Clinical Sage Health (key: 'green')
 * 3. Clinical Cerulean (key: 'blue')
 * 4. Clinical Lilac Health (key: 'purple')
 */
export const THEMES = [
  {
    id: 'rose',
    name: 'Warm Clinical Health',
    label: 'Warm Clinical Health',
    badge: 'Primary',
    description: 'Default continuous clinical glycemic telemetry palette',
    color: '#ad2737',
    primary: '#ad2737',
    secondary: '#8a4c57',
    tertiary: '#106854',
    surface: '#fff8f7',
    colors: {
      primary: '#ad2737',
      primaryContainer: '#cf414d',
      primaryHover: '#8f0c24',
      primaryFixed: '#ffdad9',
      primaryFixedDim: '#ffb3b3',
      onPrimary: '#ffffff',
      onPrimaryFixed: '#40000a',
      onPrimaryFixedVariant: '#8f0c24',
      onPrimaryContainer: '#fffbff',
      secondary: '#8a4c57',
      secondaryContainer: '#feaeba',
      secondaryFixed: '#ffd9dd',
      secondaryFixedDim: '#ffb2bd',
      onSecondary: '#ffffff',
      onSecondaryFixed: '#3b0814',
      onSecondaryFixedVariant: '#6e3540',
      onSecondaryContainer: '#7a3e49',
      tertiary: '#106854',
      tertiaryContainer: '#33816c',
      tertiaryFixed: '#a4f2d8',
      tertiaryFixedDim: '#88d5bd',
      onTertiary: '#ffffff',
      onTertiaryFixed: '#002018',
      onTertiaryFixedVariant: '#005140',
      onTertiaryContainer: '#f5fff9',
      inTarget: '#106854',
      background: '#fff8f7',
      onBackground: '#26181a',
      surface: '#fff8f7',
      surfaceBright: '#fff8f7',
      surfaceDim: '#eed4d7',
      surfaceVariant: '#f7dcdf',
      surfaceContainerLowest: '#ffffff',
      surfaceContainerLow: '#fff0f1',
      surfaceContainer: '#ffe9eb',
      surfaceContainerHigh: '#fde2e5',
      surfaceContainerHighest: '#f7dcdf',
      inverseSurface: '#3d2c2f',
      inverseOnSurface: '#ffecee',
      inversePrimary: '#ffb3b3',
      onSurface: '#26181a',
      onSurfaceVariant: '#594141',
      outline: '#8c7070',
      outlineVariant: '#e0bfbe',
      error: '#ba1a1a',
      errorContainer: '#ffdad6',
      onError: '#ffffff',
      onErrorContainer: '#93000a',
      chartLine: '#ad2737',
      chartFill: 'rgba(173, 39, 55, 0.15)'
    },
    get tokens() {
      return this.colors;
    }
  },
  {
    id: 'green',
    name: 'Clinical Sage Health',
    label: 'Clinical Sage Health',
    badge: 'Metabolic',
    description: 'Calm restorative metabolic and nutrition tracking',
    color: '#2d8a70',
    primary: '#2d8a70',
    secondary: '#4b645a',
    tertiary: '#3c6472',
    surface: '#e9fef3',
    colors: {
      primary: '#2d8a70',
      primaryContainer: '#248369',
      primaryHover: '#1f6853',
      primaryFixed: '#9bf4d5',
      primaryFixedDim: '#7dd8b9',
      onPrimary: '#ffffff',
      onPrimaryFixed: '#002117',
      onPrimaryFixedVariant: '#0e513d',
      onPrimaryContainer: '#ffffff',
      secondary: '#4b645a',
      secondaryContainer: '#cde9dc',
      secondaryFixed: '#cde9dc',
      secondaryFixedDim: '#b1cdbf',
      onSecondary: '#ffffff',
      onSecondaryFixed: '#072018',
      onSecondaryFixedVariant: '#344c42',
      onSecondaryContainer: '#334b42',
      tertiary: '#3c6472',
      tertiaryContainer: '#bfe9f9',
      tertiaryFixed: '#89f8d0',
      tertiaryFixedDim: '#70dcb5',
      onTertiary: '#ffffff',
      onTertiaryFixed: '#002117',
      onTertiaryFixedVariant: '#224c3d',
      onTertiaryContainer: '#00201a',
      inTarget: '#137a53',
      background: '#e9fef3',
      onBackground: '#161d19',
      surface: '#e9fef3',
      surfaceBright: '#f4fbf6',
      surfaceDim: '#cadfd4',
      surfaceVariant: '#d2e7dc',
      surfaceContainerLowest: '#ffffff',
      surfaceContainerLow: '#eef5f0',
      surfaceContainer: '#e8efe9',
      surfaceContainerHigh: '#e2eae4',
      surfaceContainerHighest: '#d2e7dc',
      inverseSurface: '#2b322e',
      inverseOnSurface: '#ecf2ed',
      inversePrimary: '#7dd8b9',
      onSurface: '#161d19',
      onSurfaceVariant: '#404944',
      outline: '#707973',
      outlineVariant: '#bfc9c2',
      error: '#ba1a1a',
      errorContainer: '#ffdad6',
      onError: '#ffffff',
      onErrorContainer: '#93000a',
      chartLine: '#2d8a70',
      chartFill: 'rgba(45, 138, 112, 0.15)'
    },
    get tokens() {
      return this.colors;
    }
  },
  {
    id: 'blue',
    name: 'Clinical Cerulean',
    label: 'Clinical Cerulean',
    badge: 'Cardio',
    description: 'Precision cardiovascular and acute telemetry profile',
    color: '#0284c7',
    primary: '#0284c7',
    secondary: '#51606f',
    tertiary: '#68546f',
    surface: '#faf8ff',
    colors: {
      primary: '#0284c7',
      primaryContainer: '#007bb9',
      primaryHover: '#0369a1',
      primaryFixed: '#cce5ff',
      primaryFixedDim: '#90cdff',
      onPrimary: '#ffffff',
      onPrimaryFixed: '#001e30',
      onPrimaryFixedVariant: '#004c75',
      onPrimaryContainer: '#ffffff',
      secondary: '#51606f',
      secondaryContainer: '#d5e4f7',
      secondaryFixed: '#d5e4f7',
      secondaryFixedDim: '#b9c8db',
      onSecondary: '#ffffff',
      onSecondaryFixed: '#0d1d29',
      onSecondaryFixedVariant: '#3a4857',
      onSecondaryContainer: '#394856',
      tertiary: '#68546f',
      tertiaryContainer: '#f0dbf7',
      tertiaryFixed: '#f0dbf7',
      tertiaryFixedDim: '#d3bfe0',
      onTertiary: '#ffffff',
      onTertiaryFixed: '#001f28',
      onTertiaryFixedVariant: '#4f3d56',
      onTertiaryContainer: '#24112e',
      inTarget: '#0284c7',
      background: '#faf8ff',
      onBackground: '#181c20',
      surface: '#faf8ff',
      surfaceBright: '#f8fafc',
      surfaceDim: '#d2d9f4',
      surfaceVariant: '#dae2fd',
      surfaceContainerLowest: '#ffffff',
      surfaceContainerLow: '#f0f3fa',
      surfaceContainer: '#eaedf4',
      surfaceContainerHigh: '#e4e8ee',
      surfaceContainerHighest: '#dae2fd',
      inverseSurface: '#2d3135',
      inverseOnSurface: '#eff1f6',
      inversePrimary: '#90cdff',
      onSurface: '#181c20',
      onSurfaceVariant: '#41474d',
      outline: '#72777e',
      outlineVariant: '#c1c7cf',
      error: '#ba1a1a',
      errorContainer: '#ffdad6',
      onError: '#ffffff',
      onErrorContainer: '#93000a',
      chartLine: '#0284c7',
      chartFill: 'rgba(2, 132, 199, 0.15)'
    },
    get tokens() {
      return this.colors;
    }
  },
  {
    id: 'purple',
    name: 'Clinical Lilac Health',
    label: 'Clinical Lilac Health',
    badge: 'Endocrine',
    description: 'Holistic neuroendocrine and circadian balance profile',
    color: '#7c3aed',
    primary: '#7c3aed',
    secondary: '#645a70',
    tertiary: '#7a525f',
    surface: '#f9f9ff',
    colors: {
      primary: '#7c3aed',
      primaryContainer: '#7c3aed',
      primaryHover: '#6d28d9',
      primaryFixed: '#eaddff',
      primaryFixedDim: '#d0bcff',
      onPrimary: '#ffffff',
      onPrimaryFixed: '#22005d',
      onPrimaryFixedVariant: '#601bb9',
      onPrimaryContainer: '#ffffff',
      secondary: '#645a70',
      secondaryContainer: '#ebddef',
      secondaryFixed: '#ebddef',
      secondaryFixedDim: '#cfc1d3',
      onSecondary: '#ffffff',
      onSecondaryFixed: '#20182a',
      onSecondaryFixedVariant: '#4c4256',
      onSecondaryContainer: '#4c4357',
      tertiary: '#7a525f',
      tertiaryContainer: '#ffd9e3',
      tertiaryFixed: '#ffd9e3',
      tertiaryFixedDim: '#f2b7c6',
      onTertiary: '#ffffff',
      onTertiaryFixed: '#260058',
      onTertiaryFixedVariant: '#5f3b47',
      onTertiaryContainer: '#30111d',
      inTarget: '#7c3aed',
      background: '#f9f9ff',
      onBackground: '#1d1a1f',
      surface: '#f9f9ff',
      surfaceBright: '#fdf7ff',
      surfaceDim: '#d3daea',
      surfaceVariant: '#dce2f3',
      surfaceContainerLowest: '#ffffff',
      surfaceContainerLow: '#f6f1f8',
      surfaceContainer: '#f0ebf2',
      surfaceContainerHigh: '#eae5ec',
      surfaceContainerHighest: '#dce2f3',
      inverseSurface: '#322f35',
      inverseOnSurface: '#f5eff7',
      inversePrimary: '#d0bcff',
      onSurface: '#1d1a1f',
      onSurfaceVariant: '#4a454d',
      outline: '#7b757e',
      outlineVariant: '#ccc3cd',
      error: '#ba1a1a',
      errorContainer: '#ffdad6',
      onError: '#ffffff',
      onErrorContainer: '#93000a',
      chartLine: '#7c3aed',
      chartFill: 'rgba(124, 58, 237, 0.15)'
    },
    get tokens() {
      return this.colors;
    }
  }
];

export const ThemeContext = createContext({
  currentTheme: 'rose',
  changeTheme: () => {},
  themes: THEMES,
  theme: THEMES[0]
});

/**
 * Applies both the HTML data-theme attribute AND root CSS variables synchronously.
 * This completely resolves the CSS specificity issue where partial inline styles
 * could clash with index.css class definitions.
 */
export const applyThemeTokens = (themeId) => {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const root = document.documentElement;

  // Set the data-theme attribute on <html>
  root.setAttribute('data-theme', theme.id);

  // Synchronize all CSS variables to root inline style
  const vars = {
    '--primary': theme.colors.primary,
    '--primary-container': theme.colors.primaryContainer,
    '--primary-hover': theme.colors.primaryHover,
    '--primary-fixed': theme.colors.primaryFixed,
    '--primary-fixed-dim': theme.colors.primaryFixedDim,
    '--on-primary': theme.colors.onPrimary,
    '--on-primary-fixed': theme.colors.onPrimaryFixed,
    '--on-primary-fixed-variant': theme.colors.onPrimaryFixedVariant,
    '--on-primary-container': theme.colors.onPrimaryContainer,
    '--secondary': theme.colors.secondary,
    '--secondary-container': theme.colors.secondaryContainer,
    '--secondary-fixed': theme.colors.secondaryFixed,
    '--secondary-fixed-dim': theme.colors.secondaryFixedDim,
    '--on-secondary': theme.colors.onSecondary,
    '--on-secondary-fixed': theme.colors.onSecondaryFixed,
    '--on-secondary-fixed-variant': theme.colors.onSecondaryFixedVariant,
    '--on-secondary-container': theme.colors.onSecondaryContainer,
    '--tertiary': theme.colors.tertiary,
    '--tertiary-container': theme.colors.tertiaryContainer,
    '--tertiary-fixed': theme.colors.tertiaryFixed,
    '--tertiary-fixed-dim': theme.colors.tertiaryFixedDim,
    '--on-tertiary': theme.colors.onTertiary,
    '--on-tertiary-fixed': theme.colors.onTertiaryFixed,
    '--on-tertiary-fixed-variant': theme.colors.onTertiaryFixedVariant,
    '--on-tertiary-container': theme.colors.onTertiaryContainer,
    '--in-target': theme.colors.inTarget,
    '--background': theme.colors.background,
    '--on-background': theme.colors.onBackground,
    '--surface': theme.colors.surface,
    '--surface-bright': theme.colors.surfaceBright,
    '--surface-dim': theme.colors.surfaceDim,
    '--surface-variant': theme.colors.surfaceVariant,
    '--surface-container-lowest': theme.colors.surfaceContainerLowest,
    '--surface-container-low': theme.colors.surfaceContainerLow,
    '--surface-container': theme.colors.surfaceContainer,
    '--surface-container-high': theme.colors.surfaceContainerHigh,
    '--surface-container-highest': theme.colors.surfaceContainerHighest,
    '--inverse-surface': theme.colors.inverseSurface,
    '--inverse-on-surface': theme.colors.inverseOnSurface,
    '--inverse-primary': theme.colors.inversePrimary,
    '--on-surface': theme.colors.onSurface,
    '--on-surface-variant': theme.colors.onSurfaceVariant,
    '--outline': theme.colors.outline,
    '--outline-variant': theme.colors.outlineVariant,
    '--error': theme.colors.error,
    '--error-container': theme.colors.errorContainer,
    '--on-error': theme.colors.onError,
    '--on-error-container': theme.colors.onErrorContainer,
    '--chart-line': theme.colors.chartLine,
    '--chart-fill': theme.colors.chartFill,
    '--theme-brand-name': `"${theme.name}"`
  };

  Object.entries(vars).forEach(([prop, val]) => {
    if (val !== undefined && val !== null) {
      root.style.setProperty(prop, val);
    }
  });

  try {
    localStorage.setItem('sweety_theme', theme.id);
  } catch {
    // Ignore storage quota or access errors in restricted environments
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('sweety_theme');
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'rose';
  });

  const activeTheme = useMemo(() => {
    return THEMES.find((t) => t.id === currentTheme) || THEMES[0];
  }, [currentTheme]);

  useEffect(() => {
    applyThemeTokens(currentTheme);
  }, [currentTheme]);

  const changeTheme = useCallback((themeId) => {
    if (THEMES.some((t) => t.id === themeId)) {
      setCurrentTheme(themeId);
      applyThemeTokens(themeId);
    }
  }, []);

  const contextValue = useMemo(() => ({
    currentTheme,
    changeTheme,
    themes: THEMES,
    theme: activeTheme
  }), [currentTheme, changeTheme, activeTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
