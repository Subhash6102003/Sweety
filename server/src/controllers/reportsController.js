const { supabase } = require('../config/supabase');

const SLOT_ORDER = {
  'Morning (fasting)': 1,
  'After breakfast': 2,
  'After lunch': 3,
  'After dinner': 4
};

const calculateMetrics = (rows = []) => {
  if (!rows || rows.length === 0) {
    return {
      count: 0,
      lowest: null,
      highest: null,
      average: null
    };
  }

  const values = rows.map(r => r.value);
  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const average = Number((sum / values.length).toFixed(1));

  return {
    count: values.length,
    lowest,
    highest,
    average
  };
};

const formatDateHuman = (dateObj) => {
  return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getReports = async (req, res) => {
  try {
    const userId = req.user.id;
    const selectedDate = req.query.date || new Date().toISOString().split('T')[0];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD.' });
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const currentDate = new Date(year, month - 1, day);

    // 1. Daily Range
    const dailyDateStr = selectedDate;

    // 2. MTD Range: 1st of month to selected date
    const mtdStartDate = new Date(year, month - 1, 1);
    const mtdStartStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const mtdEndStr = selectedDate;

    // 3. Previous Full Month Range
    const prevMonthDate = new Date(year, month - 2, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonthNum = prevMonthDate.getMonth() + 1;
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

    const prevMonthStartStr = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}-01`;
    const prevMonthEndStr = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}-${String(prevMonthLastDay).padStart(2, '0')}`;

    // 4. Trend 30-Day Range
    const trendStartDate = new Date(year, month - 1, day - 30);
    const trendStartStr = trendStartDate.toISOString().split('T')[0];

    // Parallel fetch from Supabase
    const [
      { data: dailyRows, error: dailyErr },
      { data: mtdRows, error: mtdErr },
      { data: prevMonthRows, error: prevErr },
      { data: trendRows, error: trendErr }
    ] = await Promise.all([
      supabase.from('readings').select('*').eq('user_id', userId).eq('reading_date', dailyDateStr),
      supabase.from('readings').select('*').eq('user_id', userId).gte('reading_date', mtdStartStr).lte('reading_date', mtdEndStr),
      supabase.from('readings').select('*').eq('user_id', userId).gte('reading_date', prevMonthStartStr).lte('reading_date', prevMonthEndStr),
      supabase.from('readings').select('*').eq('user_id', userId).gte('reading_date', trendStartStr).lte('reading_date', selectedDate).order('reading_date', { ascending: true })
    ]);

    if (dailyErr || mtdErr || prevErr || trendErr) {
      throw dailyErr || mtdErr || prevErr || trendErr;
    }

    // Sort daily readings by slot sequence
    const sortedDailyReadings = (dailyRows || []).sort(
      (a, b) => (SLOT_ORDER[a.slot] || 5) - (SLOT_ORDER[b.slot] || 5)
    );

    // Sort trend readings chronologically
    const sortedTrend = (trendRows || []).sort((a, b) => {
      if (a.reading_date !== b.reading_date) {
        return a.reading_date.localeCompare(b.reading_date);
      }
      return (SLOT_ORDER[a.slot] || 5) - (SLOT_ORDER[b.slot] || 5);
    });

    // Distribution in MTD readings
    let lowCount = 0;
    let inTargetCount = 0;
    let highCount = 0;

    (mtdRows || []).forEach(r => {
      if (r.value < 70) lowCount++;
      else if (r.value <= 140) inTargetCount++;
      else highCount++;
    });

    return res.json({
      selectedDate,
      daily: {
        ...calculateMetrics(dailyRows),
        range: selectedDate,
        readings: sortedDailyReadings
      },
      mtd: {
        ...calculateMetrics(mtdRows),
        range: `${formatDateHuman(mtdStartDate)} – ${formatDateHuman(currentDate)}`
      },
      previousMonth: {
        ...calculateMetrics(prevMonthRows),
        range: `${formatDateHuman(new Date(prevYear, prevMonthNum - 1, 1))} – ${formatDateHuman(new Date(prevYear, prevMonthNum - 1, prevMonthLastDay))}`
      },
      trend: sortedTrend,
      distribution: {
        low_count: lowCount,
        in_target_count: inTargetCount,
        high_count: highCount
      }
    });
  } catch (err) {
    console.error('getReports error:', err);
    return res.status(500).json({ error: 'Failed to generate reports.' });
  }
};

module.exports = {
  getReports
};
