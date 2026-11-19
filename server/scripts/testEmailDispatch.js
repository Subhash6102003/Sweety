require('dotenv').config();
const { 
  sendWelcomeEmail, 
  generateAndSendMagicCode, 
  sendDailyReminderEmail 
} = require('../src/services/emailService');

const targetEmail = process.argv[2] || 'subhashmaurya6102003@gmail.com';

async function run() {
  console.log(`🚀 Dispatching Onboarding & Verification emails to: ${targetEmail}`);
  
  // 1. Onboarding Email
  console.log('Sending Onboarding Welcome email...');
  const welcomeRes = await sendWelcomeEmail({
    email: targetEmail,
    name: 'Subhash Maurya',
    mrn: 'MRN: SW-884920-T1'
  });
  console.log('Onboarding Email Result:', welcomeRes);

  // 2. SMTP Landing / Verification Code Email
  console.log('Sending SMTP Landing / Magic Code email...');
  const codeRes = await generateAndSendMagicCode({
    email: targetEmail
  });
  console.log('SMTP Landing / Magic Code Result:', codeRes);

  // 3. Daily Timeline Chrono-Schedule Email
  console.log('Sending Daily Glycemic Timeline Schedule email...');
  const timelineRes = await sendDailyReminderEmail({
    email: targetEmail,
    name: 'Subhash Maurya'
  });
  console.log('Daily Timeline Result:', timelineRes);
  
  console.log('🏁 All emails dispatched successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Dispatch error:', err);
  process.exit(1);
});
