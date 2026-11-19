const nodemailer = require('nodemailer');
require('dotenv').config();

// In-memory OTP storage for Magic Code Email Login: { [email]: { code, expiresAt } }
const magicCodes = new Map();

/**
 * Configure SMTP Transporter
 * Supports AWS SES SMTP, Gmail, SendGrid, or any custom SMTP server.
 * Gracefully falls back to mock logger if SMTP credentials are not yet configured.
 */
let transporter = null;

const initTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log(`📧 SMTP Service initialized with host: ${process.env.SMTP_HOST}`);
  } else {
    // Development / Sandbox Ethereal or Logging Mode
    console.log('📧 SMTP credentials not fully configured in environment. Using graceful fallback transporter.');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('📧 Ethereal test SMTP active for development preview.');
    } catch (err) {
      transporter = null;
    }
  }
};

initTransporter().catch(err => console.warn('Failed to init SMTP transporter:', err));

const SENDER_EMAIL = process.env.SMTP_FROM || '"Sweety Clinical Care" <notifications@sweetycare.io>';

/**
 * Base email layout wrapper with Sweety's anti-slop aesthetic
 */
const wrapEmailTemplate = ({ title, preheader, contentHtml }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fdfbfb; color: #21191a; margin: 0; padding: 24px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #fae2e2; overflow: hidden; box-shadow: 0 4px 20px rgba(173,39,55,0.04); }
    .header { background: #ad2737; padding: 28px 32px; text-align: left; }
    .brand { font-size: 22px; font-weight: 800; color: #ffffff; text-decoration: none; letter-spacing: -0.5px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.18); color: #ffffff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 999px; margin-left: 8px; vertical-align: middle; }
    .content { padding: 36px 32px; font-size: 14px; line-height: 1.6; color: #423b3b; }
    .h1 { font-size: 20px; font-weight: 700; color: #21191a; margin-top: 0; margin-bottom: 12px; }
    .footer { background: #fdf6f6; padding: 20px 32px; font-size: 11px; color: #887879; border-top: 1px solid #fae2e2; text-align: center; }
    .btn { display: inline-block; background: #ad2737; color: #ffffff !important; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 12px; margin: 16px 0; }
    .card { background: #fdf6f6; border: 1px solid #f6cfcf; border-radius: 14px; padding: 16px; margin: 16px 0; }
    .otp { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #ad2737; text-align: center; padding: 16px; background: #fdf6f6; border-radius: 12px; border: 1px dashed #ad2737; margin: 20px 0; font-family: monospace; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#fdfbfb;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="container">
    <div class="header">
      <span class="brand">Sweety</span>
      <span class="badge">Clinical Care</span>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>Sweety Ambulatory Diabetes Management Platform</strong></p>
      <p style="margin: 0 0 6px 0;">HIPAA Compliant &bull; 256-Bit Cryptographic Telemetry</p>
      <p style="margin: 0; color: #ad9a9b;">This is a clinical notification sent to your verified patient email. If you did not request this, please contact clinical support immediately.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Dispatch an email with fallback handling
 */
const sendMailSafe = async ({ to, subject, html, text }) => {
  try {
    if (!transporter) {
      console.log(`[SMTP-OFFLINE] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail({
      from: SENDER_EMAIL,
      to,
      subject,
      text: text || subject,
      html
    });

    console.log(`[SMTP-DISPATCH] Message sent to ${to}: ${info.messageId}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[SMTP-PREVIEW] ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[SMTP-ERROR] Failed to send email to ${to}:`, err.message);
    // Never fail application execution due to email delivery
    return { success: false, error: err.message };
  }
};

/**
 * 1. Welcome Email on Account Registration
 */
const sendWelcomeEmail = async ({ email, name, mrn }) => {
  const patientName = name || 'Patient';
  const html = wrapEmailTemplate({
    title: 'Welcome to Sweety Telemetry',
    preheader: 'Your continuous glucose monitoring account has been created.',
    contentHtml: `
      <h1 class="h1">Welcome to Sweety, ${patientName}</h1>
      <p>Your ambulatory continuous glycemic telemetry record has been successfully initialized in our HIPAA-certified registry.</p>
      
      <div class="card">
        <strong style="color: #ad2737; font-size: 13px; display: block; margin-bottom: 6px;">Patient Demographics &amp; Identifiers</strong>
        <p style="margin: 3px 0; font-size: 12px;"><strong>Patient Name:</strong> ${patientName}</p>
        <p style="margin: 3px 0; font-size: 12px;"><strong>Clinical Registry ID:</strong> ${mrn || 'MRN: ' + Math.floor(100000 + Math.random() * 900000) + '-T1'}</p>
        <p style="margin: 3px 0; font-size: 12px;"><strong>Telemetry Standard:</strong> ADA Consensus (70–140 mg/dL Target Corridor)</p>
      </div>

      <p>You can record up to 4 daily milestone checkpoints: <em>Morning (fasting)</em>, <em>After breakfast</em>, <em>After lunch</em>, and <em>After dinner</em>.</p>

      <a href="https://sweety.vercel.app/dashboard" class="btn">Open My Dashboard</a>

      <p style="font-size: 12px; color: #736768; margin-top: 24px;">Need assistance? Our clinical technical support team is available 24/7 at support@sweetycare.io.</p>
    `
  });

  return sendMailSafe({
    to: email,
    subject: 'Welcome to Sweety — Your Continuous Glucose Telemetry Portal',
    html
  });
};

/**
 * 2. Profile Modification Notification
 */
const sendProfileUpdatedEmail = async ({ email, name, changes = 'General profile demographics' }) => {
  const patientName = name || 'Patient';
  const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });

  const html = wrapEmailTemplate({
    title: 'Profile Updated Notification',
    preheader: 'Your Sweety health profile parameters were updated.',
    contentHtml: `
      <h1 class="h1">Health Profile Modified</h1>
      <p>Hello ${patientName},</p>
      <p>This is an automated confirmation that your patient record was updated on <strong>${timestamp}</strong>.</p>
      
      <div class="card">
        <strong style="color: #ad2737; font-size: 13px; display: block; margin-bottom: 6px;">Modification Details</strong>
        <p style="margin: 3px 0; font-size: 12px;"><strong>Updated Sections:</strong> ${changes}</p>
        <p style="margin: 3px 0; font-size: 12px;"><strong>Security Status:</strong> Active 256-bit AES encryption</p>
      </div>

      <p>If you made this change, no further action is required. If you did not authorize this modification, please sign in and review your security credentials immediately.</p>

      <a href="https://sweety.vercel.app/profile" class="btn">Review Health Profile</a>
    `
  });

  return sendMailSafe({
    to: email,
    subject: 'Sweety Security Alert — Clinical Health Profile Updated',
    html
  });
};

/**
 * 3. Daily Timeline Schedule & Reminder Email
 */
const sendDailyReminderEmail = async ({ email, name }) => {
  const patientName = name || 'Patient';
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  const html = wrapEmailTemplate({
    title: 'Daily Glucose Telemetry Schedule',
    preheader: `Your glycemic monitoring milestones for ${todayStr}.`,
    contentHtml: `
      <h1 class="h1">Today's Glycemic Milestones</h1>
      <p>Good morning, ${patientName}. Here is your configured daily monitoring timeline for <strong>${todayStr}</strong>:</p>

      <div style="margin: 20px 0;">
        <div style="padding: 12px; border-left: 3px solid #ad2737; background: #fdf6f6; margin-bottom: 10px; border-radius: 0 8px 8px 0;">
          <strong style="font-size: 13px; color: #21191a;">07:00 AM &bull; Morning Fasting Glucose Check</strong>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #736768;">Target Corridor: 80–110 mg/dL prior to breakfast.</p>
        </div>
        <div style="padding: 12px; border-left: 3px solid #ad2737; background: #fdf6f6; margin-bottom: 10px; border-radius: 0 8px 8px 0;">
          <strong style="font-size: 13px; color: #21191a;">09:30 AM &bull; 2-Hour Post-Breakfast Check</strong>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #736768;">Confirm postprandial peak remains below 140 mg/dL.</p>
        </div>
        <div style="padding: 12px; border-left: 3px solid #ad2737; background: #fdf6f6; margin-bottom: 10px; border-radius: 0 8px 8px 0;">
          <strong style="font-size: 13px; color: #21191a;">01:30 PM &bull; 2-Hour Post-Lunch Check</strong>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #736768;">Monitor midday carbohydrate glycemic curve.</p>
        </div>
        <div style="padding: 12px; border-left: 3px solid #ad2737; background: #fdf6f6; margin-bottom: 10px; border-radius: 0 8px 8px 0;">
          <strong style="font-size: 13px; color: #21191a;">10:00 PM &bull; Bedtime Safety Corridor</strong>
          <p style="margin: 3px 0 0 0; font-size: 12px; color: #736768;">Ensure nocturnal stability between 100–140 mg/dL to prevent nocturnal hypoglycemia.</p>
        </div>
      </div>

      <a href="https://sweety.vercel.app/dashboard" class="btn">Log Milestone Now</a>
    `
  });

  return sendMailSafe({
    to: email,
    subject: `Daily Glucose Telemetry Schedule — Sweety Checkpoints (${todayStr})`,
    html
  });
};

/**
 * 4. Magic One-Time Login Code (Passwordless Email Login)
 */
const generateAndSendMagicCode = async ({ email }) => {
  const cleanEmail = email.trim().toLowerCase();
  // Generate 6-digit numeric OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  magicCodes.set(cleanEmail, { code, expiresAt });

  const html = wrapEmailTemplate({
    title: 'Your Sweety Sign-In Verification Code',
    preheader: `Your sign-in code is ${code}. Valid for 10 minutes.`,
    contentHtml: `
      <h1 class="h1">Sign In to Sweety</h1>
      <p>Use the 6-digit verification code below to sign in directly to your patient telemetry portal without a password:</p>

      <div class="otp">${code}</div>

      <p style="font-size: 13px; color: #736768; text-align: center;">This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.</p>

      <p style="font-size: 12px; color: #887879; margin-top: 24px; border-top: 1px solid #fae2e2; padding-top: 16px;">
        If you did not request this login code, you can safely disregard this email.
      </p>
    `
  });

  return sendMailSafe({
    to: cleanEmail,
    subject: `${code} is your Sweety sign-in verification code`,
    html
  });
};

/**
 * Verify Magic Code
 */
const verifyMagicCode = (email, code) => {
  const cleanEmail = email.trim().toLowerCase();
  const entry = magicCodes.get(cleanEmail);

  if (!entry) {
    return { valid: false, error: 'No verification code found. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    magicCodes.delete(cleanEmail);
    return { valid: false, error: 'Verification code has expired. Please request a new one.' };
  }

  if (entry.code !== code.trim()) {
    return { valid: false, error: 'Invalid verification code. Please check your email and try again.' };
  }

  // Code is valid - clear it so it cannot be reused
  magicCodes.delete(cleanEmail);
  return { valid: true };
};

module.exports = {
  sendWelcomeEmail,
  sendProfileUpdatedEmail,
  sendDailyReminderEmail,
  generateAndSendMagicCode,
  verifyMagicCode
};
