import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

export const CONFIG = {
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:5000',
  TIMEOUT_MS: 10000,
  ROOT_DIR,
  CLIENT_SRC_DIR: path.join(ROOT_DIR, 'client', 'src'),
  CLIENT_DIST_DIR: path.join(ROOT_DIR, 'client', 'dist'),

  DEMO_USER: {
    email: 'demo@sweety.app',
    password: 'Password123!',
    name: 'Demo Patient'
  },

  THEMES: {
    rose: {
      id: 'rose',
      name: 'Warm Clinical Health',
      badge: 'Primary',
      primary: '#ad2737',
      primaryContainer: '#cf414d',
      surface: '#fff8f7',
      outlineVariant: '#e0bfbe',
      onSurface: '#26181a'
    },
    green: {
      id: 'green',
      name: 'Clinical Sage Health',
      badge: 'Metabolic',
      primary: '#2d8a70',
      primaryContainer: '#248369',
      surface: '#e9fef3',
      outlineVariant: '#bfc9c2',
      onSurface: '#161d19'
    },
    blue: {
      id: 'blue',
      name: 'Clinical Cerulean',
      badge: 'Cardio',
      primary: '#0284c7',
      primaryContainer: '#007bb9',
      surface: '#faf8ff',
      outlineVariant: '#c1c7cf',
      onSurface: '#181c20'
    },
    purple: {
      id: 'purple',
      name: 'Clinical Lilac Health',
      badge: 'Endocrine',
      primary: '#7c3aed',
      primaryContainer: '#7c3aed',
      surface: '#f9f9ff',
      outlineVariant: '#ccc3cd',
      onSurface: '#1d1a1f'
    }
  },

  CLINICAL_TARGETS: {
    HYPO_THRESHOLD: 70,
    ELEVATED_THRESHOLD: 140,
    MIN_ALLOWED: 40,
    MAX_ALLOWED: 600,
    MAX_DAILY_READINGS: 4
  },

  SLOTS: [
    'Morning (fasting)',
    'After breakfast',
    'After lunch',
    'After dinner'
  ]
};
