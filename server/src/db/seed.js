const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');

async function seed() {
  console.log('🌱 Starting Sweety Database Seed to Supabase...');

  try {
    const demoEmail = 'demo@sweety.app';
    const demoPassword = 'Password123!';
    const passwordHash = await bcrypt.hash(demoPassword, 10);

    // 1. Create or get demo user
    let user;
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', demoEmail)
      .maybeSingle();

    if (existingUser) {
      console.log(`👤 Found existing demo user: ${existingUser.email} (ID: ${existingUser.id})`);
      user = existingUser;
      await supabase.from('users').update({ name: 'Elena Vance' }).eq('id', user.id);
    } else {
      const { data: newUser, error: createErr } = await supabase
        .from('users')
        .insert({
          name: 'Elena Vance',
          email: demoEmail,
          password_hash: passwordHash
        })
        .select()
        .single();

      if (createErr) throw createErr;
      user = newUser;
      console.log(`👤 Created Demo User: ${user.email} (ID: ${user.id})`);
    }

    // 2. Clear old demo user readings to ensure fresh deterministic seed
    console.log('🧹 Clearing previous demo readings...');
    await supabase.from('readings').delete().eq('user_id', user.id);

    // 3. Generate 45 days of realistic glucose readings up to today
    const slots = [
      'Morning (fasting)',
      'After breakfast',
      'After lunch',
      'After dinner'
    ];

    const today = new Date();
    const rowsToInsert = [];

    for (let dayOffset = 45; dayOffset >= 0; dayOffset--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - dayOffset);
      const dateStr = targetDate.toISOString().split('T')[0];

      // On some days, simulate missing slots to showcase realistic variations & empty states
      let slotsToLog = [...slots];
      if (dayOffset === 0) {
        // Today: log all 4 slots to match Stitch KPI of 125.5 mg/dL and 4/4 sync
        slotsToLog = [...slots];
      } else if (dayOffset % 6 === 0) {
        slotsToLog = slotsToLog.slice(0, 3); // skipped dinner
      } else if (dayOffset % 8 === 0) {
        slotsToLog = [slots[0], slots[2]]; // only fasting and lunch
      }

      for (const slot of slotsToLog) {
        let baseValue = 100;
        if (dayOffset === 0) {
          if (slot === 'Morning (fasting)') baseValue = 98;
          else if (slot === 'After breakfast') baseValue = 128;
          else if (slot === 'After lunch') baseValue = 158; // Post-lunch spike
          else if (slot === 'After dinner') baseValue = 118;
        } else if (slot === 'Morning (fasting)') {
          baseValue = 85 + Math.floor(Math.random() * 25); // 85 - 110 mg/dL (fasting)
        } else if (slot === 'After breakfast') {
          baseValue = 110 + Math.floor(Math.random() * 38); // 110 - 148 mg/dL
        } else if (slot === 'After lunch') {
          baseValue = 115 + Math.floor(Math.random() * 35); // 115 - 150 mg/dL
        } else if (slot === 'After dinner') {
          baseValue = 118 + Math.floor(Math.random() * 42); // 118 - 160 mg/dL
        }

        // Occasional outlier only for historical days
        if (dayOffset > 0) {
          if (Math.random() < 0.05) {
            baseValue = 185 + Math.floor(Math.random() * 35); // Post-meal spike
          } else if (Math.random() < 0.03) {
            baseValue = 64 + Math.floor(Math.random() * 5); // Low dip
          }
        }

        rowsToInsert.push({
          user_id: user.id,
          reading_date: dateStr,
          slot,
          value: baseValue
        });
      }
    }

    console.log(`📦 Inserting ${rowsToInsert.length} readings into Supabase in batches...`);
    // Insert in batches of 50
    for (let i = 0; i < rowsToInsert.length; i += 50) {
      const batch = rowsToInsert.slice(i, i + 50);
      const { error: batchErr } = await supabase.from('readings').insert(batch);
      if (batchErr) throw batchErr;
    }

    console.log(`✅ Successfully seeded ${rowsToInsert.length} blood glucose readings across 45 days.`);
    console.log('\n🍬 Sweety Demo Credentials Ready on Supabase:');
    console.log(`   Email:    ${demoEmail}`);
    console.log(`   Password: ${demoPassword}`);
    console.log('────────────────────────────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
