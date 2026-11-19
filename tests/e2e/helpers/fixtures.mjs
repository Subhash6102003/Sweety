export const CLINICAL_FIXTURES = {
  // Target range boundaries per ADA 2024 standards
  TARGET_MIN: 70,
  TARGET_MAX: 140,
  ABSOLUTE_MIN: 40,
  ABSOLUTE_MAX: 600,

  // Full-day 4-slot telemetry sets
  WELL_CONTROLLED_DAY: [
    { slot: 'Morning (fasting)', value: 95 },
    { slot: 'After breakfast', value: 128 },
    { slot: 'After lunch', value: 132 },
    { slot: 'After dinner', value: 118 }
  ],

  EXCURSION_DAY: [
    { slot: 'Morning (fasting)', value: 95 },
    { slot: 'After breakfast', value: 132 },
    { slot: 'After lunch', value: 162 }, // Elevated > 140
    { slot: 'After dinner', value: 120 }
  ],

  HYPO_DAY: [
    { slot: 'Morning (fasting)', value: 62 }, // Hypoglycemia < 70
    { slot: 'After breakfast', value: 110 },
    { slot: 'After lunch', value: 135 },
    { slot: 'After dinner', value: 105 }
  ],

  // Clinical reports baseline values
  CONSENSUS_METRICS: {
    meanGlucose: 124,
    gmi: 5.9,
    cv: 16.2,
    cgmActiveTime: 99.4,
    inTargetPercent: 88,
    elevatedPercent: 12,
    lowPercent: 0,
    attestationDoctor: 'Dr. Robert Miller',
    doctorTitle: 'Board Certified Endocrinologist & Diabetologist'
  }
};

/**
 * Generates an ISO formatted date string YYYY-MM-DD
 */
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

export function getPastDateStr(daysAgo = 1) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDate(d);
}

export function getFutureDateStr(daysAhead = 1) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return formatDate(d);
}

export function generateUniqueTestEmail() {
  const rand = Math.random().toString(36).substring(2, 8);
  const ts = Date.now().toString().slice(-6);
  return `test_patient_${ts}_${rand}@sweety.test`;
}
