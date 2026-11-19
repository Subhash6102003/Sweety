const { supabase } = require('../config/supabase');

const VALID_SLOTS = [
  'Morning (fasting)',
  'After breakfast',
  'After lunch',
  'After dinner'
];

const SLOT_ORDER = {
  'Morning (fasting)': 1,
  'After breakfast': 2,
  'After lunch': 3,
  'After dinner': 4
};

/**
 * Validates glucose reading inputs against the 5 domain laws.
 */
const validateReadingPayload = async ({ userId, date, slot, value, readingIdToExclude = null }) => {
  // Rule 1: Value is required
  if (value === undefined || value === null || value === '') {
    return { error: 'Please enter a glucose value.', status: 400 };
  }

  // Rule 2: Value must be a whole number between 40 and 600
  const numValue = Number(value);
  if (!Number.isInteger(numValue) || numValue < 40 || numValue > 600) {
    return { error: 'Value must be between 40 and 600 mg/dl.', status: 400 };
  }

  // Slot validity check
  if (!slot || !VALID_SLOTS.includes(slot)) {
    return {
      error: 'Invalid time slot. Must be Morning (fasting), After breakfast, After lunch, or After dinner.',
      status: 400
    };
  }

  // Date format check & Rule 5: Date cannot be in the future
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: 'Invalid date format. Expected YYYY-MM-DD.', status: 400 };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (date > todayStr) {
    return { error: 'Date cannot be in the future.', status: 400 };
  }

  // Query existing readings for this user on this date from Supabase
  const { data: existingRows, error: fetchErr } = await supabase
    .from('readings')
    .select('id, slot')
    .eq('user_id', userId)
    .eq('reading_date', date);

  if (fetchErr) {
    throw fetchErr;
  }

  const filteredRows = readingIdToExclude
    ? (existingRows || []).filter(r => r.id !== readingIdToExclude)
    : (existingRows || []);

  // Rule 4: Maximum 4 readings per day
  if (filteredRows.length >= 4) {
    return { error: 'You can add only 4 readings per day.', status: 400 };
  }

  // Rule 3: Only one reading per slot per day
  const slotConflict = filteredRows.some(r => r.slot === slot);
  if (slotConflict) {
    return { error: `You already have an ${slot} reading for this date.`, status: 400 };
  }

  return { isValid: true, sanitizedValue: numValue };
};

// GET /api/readings
const getReadings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, page, limit } = req.query;

    if (date) {
      const { data: readings, error } = await supabase
        .from('readings')
        .select('id, reading_date, slot, value, created_at, updated_at')
        .eq('user_id', userId)
        .eq('reading_date', date);

      if (error) throw error;

      // Sort by slot order
      const sorted = (readings || []).sort(
        (a, b) => (SLOT_ORDER[a.slot] || 5) - (SLOT_ORDER[b.slot] || 5)
      );

      return res.json({ readings: sorted });
    }

    // Paginated list (bonus feature)
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const { data: list, count, error } = await supabase
      .from('readings')
      .select('id, reading_date, slot, value, created_at, updated_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('reading_date', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    const totalCount = count || 0;

    return res.json({
      readings: list || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum) || 1
      }
    });
  } catch (err) {
    console.error('getReadings error:', err);
    return res.status(500).json({ error: 'Failed to retrieve readings.' });
  }
};

// POST /api/readings
const createReading = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, slot, value } = req.body;

    const validation = await validateReadingPayload({
      userId,
      date,
      slot,
      value
    });

    if (validation.error) {
      return res.status(validation.status).json({ error: validation.error });
    }

    const { data: reading, error: insertError } = await supabase
      .from('readings')
      .insert({
        user_id: userId,
        reading_date: date,
        slot,
        value: validation.sanitizedValue
      })
      .select('id, reading_date, slot, value, created_at, updated_at')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(400).json({ error: `You already have an ${slot} reading for this date.` });
      }
      if (insertError.code === '23514') {
        return res.status(400).json({ error: 'Value must be between 40 and 600 mg/dl.' });
      }
      throw insertError;
    }

    return res.status(201).json({
      message: 'Glucose reading recorded successfully.',
      reading
    });
  } catch (err) {
    console.error('createReading error:', err);
    return res.status(500).json({ error: 'Internal server error saving reading.' });
  }
};

// PUT /api/readings/:id
const updateReading = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { date, slot, value } = req.body;

    // Verify reading exists and belongs to user
    const { data: checkReading, error: findError } = await supabase
      .from('readings')
      .select('id, reading_date, slot, value')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (findError || !checkReading) {
      return res.status(404).json({ error: 'Reading not found.' });
    }

    const targetDate = date || checkReading.reading_date;
    const targetSlot = slot || checkReading.slot;

    const validation = await validateReadingPayload({
      userId,
      date: targetDate,
      slot: targetSlot,
      value,
      readingIdToExclude: id
    });

    if (validation.error) {
      return res.status(validation.status).json({ error: validation.error });
    }

    const { data: updated, error: updateError } = await supabase
      .from('readings')
      .update({
        reading_date: targetDate,
        slot: targetSlot,
        value: validation.sanitizedValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, reading_date, slot, value, created_at, updated_at')
      .single();

    if (updateError) throw updateError;

    return res.json({
      message: 'Glucose reading updated successfully.',
      reading: updated
    });
  } catch (err) {
    console.error('updateReading error:', err);
    return res.status(500).json({ error: 'Internal server error updating reading.' });
  }
};

// DELETE /api/readings/:id
const deleteReading = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error, count } = await supabase
      .from('readings')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    if (count === 0) {
      return res.status(404).json({ error: 'Reading not found or already deleted.' });
    }

    return res.json({ message: 'Reading deleted successfully.' });
  } catch (err) {
    console.error('deleteReading error:', err);
    return res.status(500).json({ error: 'Internal server error deleting reading.' });
  }
};

module.exports = {
  getReadings,
  createReading,
  updateReading,
  deleteReading
};
