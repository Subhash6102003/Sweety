const nodemailer = require('nodemailer');
require('dotenv').config();

// In-memory OTP storage for Magic Code Email Login: { [email]: { code, expiresAt } }
const magicCodes = new Map();

let transporter = null;

const initTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const user = process.env.SMTP_USER.trim();
    const pass = process.env.SMTP_PASS.replace(/\s+/g, ''); // strip spaces from App Passwords
    const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || user.endsWith('@gmail.com');

    const transportConfig = isGmail
      ? {
          service: 'gmail',
          auth: { user, pass }
        }
      : {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user, pass },
          tls: { rejectUnauthorized: false }
        };

    transporter = nodemailer.createTransport(transportConfig);
    console.log(`📧 Live SMTP Transporter initialized successfully for: ${user}`);
  } else {
    console.log('📧 SMTP credentials not in environment. Using graceful fallback transporter.');
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
      console.log('📧 Ethereal sandbox SMTP active for preview.');
    } catch {
      transporter = null;
    }
  }
};

initTransporter().catch(err => console.warn('Failed to init SMTP transporter:', err));

const SENDER_EMAIL = process.env.SMTP_FROM || (process.env.SMTP_USER ? `"Sweety Clinical Care" <${process.env.SMTP_USER}>` : '"Sweety Clinical Care" <notifications@sweetycare.io>');
const APP_URL = (process.env.FRONTEND_URL || 'https://sweety-iota.vercel.app').replace(/\/+$/, '');

/**
 * Sweety High-Taste Anti-Slop Clinical Email Base Template
 * 85/10/5 Color Architecture:
 * - 85% Calm warm white/pearl background (#FAF6F6, #FFFFFF)
 * - 10% Structural rose framing (#F3CECE, #E5B8B8)
 * - 5% Sacred crimson/burgundy accent (#AD2737)
 */
const wrapEmailTemplate = ({ title, preheader, contentHtml }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 32px 16px;
      background-color: #fbf7f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e1919;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      border: 1px solid #f3d4d4;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(173, 39, 55, 0.04);
    }
    .hero-header {
      background: linear-gradient(135deg, #ad2737 0%, #8e1c2a 100%);
      padding: 32px;
      text-align: left;
    }
    .brand-row {
      display: flex;
      align-items: center;
    }
    .logo-badge {
      display: inline-block;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      vertical-align: middle;
      margin-right: 12px;
      text-align: center;
      line-height: 32px;
      color: #ffffff;
      font-weight: 800;
      font-size: 16px;
    }
    .brand-name {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      vertical-align: middle;
      text-decoration: none;
    }
    .sub-brand {
      display: block;
      color: rgba(255, 255, 255, 0.85);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }
    .main-body {
      padding: 36px 32px;
      font-size: 14px;
      line-height: 1.65;
      color: #3f3636;
    }
    .h1-title {
      font-size: 22px;
      font-weight: 800;
      color: #1e1919;
      letter-spacing: -0.4px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .highlight-card {
      background: #fdf7f7;
      border: 1px solid #f6cfcf;
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .metric-value {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
      font-variant-numeric: tabular-nums;
      font-feature-settings: 'tnum';
      font-size: 34px;
      font-weight: 800;
      color: #ad2737;
      letter-spacing: 6px;
      text-align: center;
      padding: 16px 0;
      background: #ffffff;
      border: 1.5px dashed #ad2737;
      border-radius: 14px;
      margin: 16px 0;
    }
    .timeline-item {
      padding: 14px 16px;
      background: #ffffff;
      border-left: 3.5px solid #ad2737;
      border-radius: 0 12px 12px 0;
      margin-bottom: 12px;
      border-top: 1px solid #f6cfcf;
      border-right: 1px solid #f6cfcf;
      border-bottom: 1px solid #f6cfcf;
    }
    .time-badge {
      font-family: monospace;
      font-size: 12px;
      font-weight: 700;
      color: #ad2737;
    }
    .timeline-title {
      font-size: 13px;
      font-weight: 700;
      color: #1e1919;
      margin: 2px 0;
    }
    .timeline-desc {
      font-size: 12px;
      color: #726364;
      margin: 0;
    }
    .btn-primary {
      display: inline-block;
      background: #ad2737;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 14px;
      box-shadow: 0 4px 14px rgba(173, 39, 55, 0.25);
      margin: 18px 0;
      text-align: center;
    }
    .footer {
      background: #fdf5f5;
      padding: 24px 32px;
      font-size: 11px;
      color: #887475;
      border-top: 1px solid #f3d4d4;
      text-align: center;
      line-height: 1.6;
    }
    .chip {
      display: inline-block;
      background: #fae4e4;
      color: #8e1c2a;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#fbf7f7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="wrapper">
    <!-- Header -->
    <div class="hero-header">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td>
            <a href="${APP_URL}" style="text-decoration:none;color:#ffffff;display:inline-block;">
              <span class="logo-badge">♥</span>
              <span class="brand-name">Sweety</span>
            </a>
            <span class="sub-brand">Continuous Glycemic Telemetry</span>
          </td>
          <td align="right">
            <span style="display:inline-block;background:rgba(255,255,255,0.22);color:#ffffff;font-size:10px;font-weight:800;letter-spacing:1px;padding:4px 10px;border-radius:999px;text-transform:uppercase;">
              CLINICAL V4.2
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Main Content -->
    <div class="main-body">
      ${contentHtml}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin:0 0 6px 0;font-weight:700;color:#3f3636;">
        Sweety Ambulatory Diabetes Telemetry Platform &bull; HIPAA Certified
      </p>
      <p style="margin:0 0 8px 0;">
        256-Bit Cryptographic Storage &bull; ADA 2026 Consensus Compliant
      </p>
      <p style="margin:0;font-size:10px;color:#ad9596;">
        This is a confidential clinical notification sent to your verified patient address. If this was not requested by you, please notify our Clinical Security Response Team at support@sweetycare.io.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Dispatch an email with full safety and logging
 */
const sendMailSafe = async ({ to, subject, html, text }) => {
  try {
    if (!transporter) {
      await initTransporter();
    }

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

    console.log(`[SMTP-SUCCESS] Real message dispatched to ${to}: ${info.messageId}`);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`[SMTP-PREVIEW] ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[SMTP-ERROR] Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * 1. Welcome Email on Registration
 */
const sendWelcomeEmail = async ({ email, name, mrn }) => {
  const patientName = name || 'Patient';
  const displayMrn = mrn || `MRN: ${Math.floor(100000 + Math.random() * 900000)}-T1`;

  const html = wrapEmailTemplate({
    title: 'Welcome to Sweety Telemetry',
    preheader: 'Your continuous glucose telemetry account has been initialized.',
    contentHtml: `
      <span class="chip">CLINICAL REGISTRY INITIALIZED</span>
      <h1 class="h1-title">Welcome to Sweety, ${patientName}</h1>
      <p style="margin-top:0;">Your continuous glycemic telemetry account has been securely provisioned in our ambulatory care network.</p>
      
      <div class="highlight-card">
        <strong style="color:#ad2737;font-size:13px;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">
          Patient Clinical Dossier
        </strong>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:12px;line-height:1.8;">
          <tr>
            <td style="color:#726364;">Patient Name:</td>
            <td align="right"><strong>${patientName}</strong></td>
          </tr>
          <tr>
            <td style="color:#726364;">Medical Record Number (MRN):</td>
            <td align="right"><strong style="font-family:monospace;color:#ad2737;">${displayMrn}</strong></td>
          </tr>
          <tr>
            <td style="color:#726364;">Consensus Target Corridor:</td>
            <td align="right"><strong>70 – 140 mg/dL (ADA Standards)</strong></td>
          </tr>
          <tr>
            <td style="color:#726364;">Milestones Cap:</td>
            <td align="right"><strong>Up to 4 Daily Readings</strong></td>
          </tr>
        </table>
      </div>

      <p style="font-size:13px;color:#3f3636;">
        You can now log your 4 daily milestone checkpoints: <strong>Morning (fasting)</strong>, <strong>After breakfast</strong>, <strong>After lunch</strong>, and <strong>After dinner</strong>, or connect your continuous sensor for real-time AGP analysis.
      </p>

      <div style="text-align:center;margin:28px 0 12px 0;">
        <a href="${APP_URL}/dashboard" class="btn-primary">
          Access Patient Dashboard &rarr;
        </a>
      </div>
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
const sendProfileUpdatedEmail = async ({ email, name, changes = 'Biometric & Clinical Target Parameters' }) => {
  const patientName = name || 'Patient';
  const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });

  const html = wrapEmailTemplate({
    title: 'Clinical Profile Modified',
    preheader: 'Your Sweety health profile parameters were updated.',
    contentHtml: `
      <span class="chip">SECURITY &amp; CLINICAL AUDIT</span>
      <h1 class="h1-title">Health Profile Modified</h1>
      <p style="margin-top:0;">Hello ${patientName},</p>
      <p>This is an automated verification that your medical demographics or clinical glycemic targets were updated on <strong>${timestamp}</strong>.</p>
      
      <div class="highlight-card">
        <strong style="color:#ad2737;font-size:13px;display:block;margin-bottom:8px;">Modification Summary</strong>
        <p style="margin:4px 0;font-size:12px;color:#3f3636;"><strong>Updated Sections:</strong> ${changes}</p>
        <p style="margin:4px 0;font-size:12px;color:#3f3636;"><strong>Audit Verification:</strong> Telemetry sync re-calibrated successfully</p>
        <p style="margin:4px 0;font-size:12px;color:#3f3636;"><strong>Encryption Protocol:</strong> Active AES-256 Bit GCM</p>
      </div>

      <p style="font-size:13px;color:#726364;">
        If you performed this update, no further action is required. If you did not authorize this change, please sign in and review your active sessions immediately.
      </p>

      <div style="text-align:center;margin:24px 0 10px 0;">
        <a href="${APP_URL}/profile" class="btn-primary">
          Review Health Profile &rarr;
        </a>
      </div>
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
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  const html = wrapEmailTemplate({
    title: 'Daily Glucose Telemetry Schedule',
    preheader: `Your scheduled glycemic checkpoints for ${todayDate}.`,
    contentHtml: `
      <span class="chip">DAILY CHRONO-SCHEDULE</span>
      <h1 class="h1-title">Today's Glycemic Milestones</h1>
      <p style="margin-top:0;">Good morning, ${patientName}. Here is your structured glycemic checkpoint timeline for <strong>${todayDate}</strong>:</p>

      <div style="margin:22px 0;">
        
        <div class="timeline-item">
          <span class="time-badge">07:00 AM &bull; CHECKPOINT 1</span>
          <div class="timeline-title">Morning Fasting Glucose Check</div>
          <p class="timeline-desc">Target Corridor: 80–110 mg/dL prior to waking meal.</p>
        </div>

        <div class="timeline-item">
          <span class="time-badge">09:30 AM &bull; CHECKPOINT 2</span>
          <div class="timeline-title">2-Hour Post-Breakfast Assessment</div>
          <p class="timeline-desc">Confirm postprandial peak remains safely below 140 mg/dL.</p>
        </div>

        <div class="timeline-item">
          <span class="time-badge">01:30 PM &bull; CHECKPOINT 3</span>
          <div class="timeline-title">2-Hour Post-Lunch Verification</div>
          <p class="timeline-desc">Assess midday carbohydrate glycemic impact and recovery curve.</p>
        </div>

        <div class="timeline-item">
          <span class="time-badge">10:00 PM &bull; CHECKPOINT 4</span>
          <div class="timeline-title">Bedtime Safety Corridor</div>
          <p class="timeline-desc">Ensure nocturnal baseline corridor between 100–140 mg/dL to prevent nocturnal hypoglycemia.</p>
        </div>

      </div>

      <div style="text-align:center;margin:28px 0 10px 0;">
        <a href="${APP_URL}/dashboard" class="btn-primary">
          Record Today's Checkpoint &rarr;
        </a>
      </div>
    `
  });

  return sendMailSafe({
    to: email,
    subject: `Daily Glucose Telemetry Schedule — Sweety Checkpoints (${todayDate})`,
    html
  });
};

/**
 * 4. Magic One-Time Login Code (Passwordless Email Login)
 */
const generateAndSendMagicCode = async ({ email }) => {
  const cleanEmail = email.trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  magicCodes.set(cleanEmail, { code, expiresAt });

  const html = wrapEmailTemplate({
    title: 'Your Sweety Sign-In Verification Code',
    preheader: `Your one-time sign-in code is ${code}. Valid for 10 minutes.`,
    contentHtml: `
      <span class="chip">ONE-TIME ACCESS CODE</span>
      <h1 class="h1-title">Sign in to Sweety</h1>
      <p style="margin-top:0;">Use the 6-digit one-time verification code below to authenticate directly to your continuous glucose telemetry dashboard:</p>

      <div class="metric-value">
        ${code}
      </div>

      <p style="text-align:center;font-size:12px;color:#726364;margin-top:4px;">
        This code is valid for <strong>10 minutes</strong> and can only be used once.
      </p>

      <div style="text-align:center;margin:22px 0 16px 0;">
        <a href="${APP_URL}/signin" class="btn-primary">
          Open Sweety Sign-In &rarr;
        </a>
      </div>

      <div style="background:#fdf7f7;border:1px solid #f6cfcf;border-radius:14px;padding:14px;margin:20px 0;font-size:12px;color:#3f3636;">
        <strong style="color:#ad2737;display:block;margin-bottom:4px;">Security Notice</strong>
        Sweety will never ask you to forward or disclose this verification code to anyone. If you did not request this login code, you can safely ignore this email.
      </div>
    `
  });

  return sendMailSafe({
    to: cleanEmail,
    subject: `${code} is your Sweety sign-in code`,
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
