const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const emailService = require('../services/emailService');

const register = async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    const insertPayload = {
      name: name.trim(),
      email: cleanEmail,
      password_hash: passwordHash
    };

    if (avatarUrl) {
      insertPayload.avatar_url = avatarUrl;
    }

    let { data: user, error: insertError } = await supabase
      .from('users')
      .insert(insertPayload)
      .select('id, name, email, created_at')
      .single();

    if (insertError && insertError.message && insertError.message.includes('avatar_url')) {
      // If column does not exist yet, retry without avatar_url
      delete insertPayload.avatar_url;
      const retry = await supabase
        .from('users')
        .insert(insertPayload)
        .select('id, name, email, created_at')
        .single();
      user = retry.data;
      insertError = retry.error;
    }

    if (insertError) {
      throw insertError;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send Welcome Email asynchronously via SMTP
    emailService.sendWelcomeEmail({
      email: cleanEmail,
      name: user.name,
      mrn: req.body.mrn
    }).catch(err => console.warn('Welcome email dispatch error:', err.message));

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        ...user,
        avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ad2737&color=fff`
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id, name, email, password_hash')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (findError || !user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
};

const getMe = async (req, res) => {
  try {
    let { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, avatar_url, created_at')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error && error.message && error.message.includes('avatar_url')) {
      const retry = await supabase
        .from('users')
        .select('id, name, email, created_at')
        .eq('id', req.user.id)
        .maybeSingle();
      user = retry.data;
      error = retry.error;
    }

    if (error || !user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ 
      user: {
        ...user,
        avatarUrl: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ad2737&color=fff`
      } 
    });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ error: 'Internal server error fetching user.' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    // PostgreSQL ON DELETE CASCADE will automatically delete all readings for this user
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) throw error;
    return res.json({ message: 'Account and telemetry data deleted successfully.' });
  } catch (err) {
    console.error('Delete account error:', err);
    return res.status(500).json({ error: 'Internal server error deleting account.' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { email, name, avatarUrl } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google authentication.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name && name.trim()) || cleanEmail.split('@')[0];

    // Check if user already exists
    let { data: user } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!user) {
      // Auto-register Google user with random bcrypt hash
      const randomPass = Math.random().toString(36).slice(-10) + 'Pass1!';
      const passwordHash = await bcrypt.hash(randomPass, 10);

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          name: cleanName,
          email: cleanEmail,
          password_hash: passwordHash
        })
        .select('id, name, email, created_at')
        .single();

      if (insertError) throw insertError;
      user = newUser;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Google authentication successful.',
      token,
      user: {
        ...user,
        avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=ad2737&color=fff`
      }
    });
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(500).json({ error: 'Internal server error during Google auth.' });
  }
};

/**
 * Request passwordless magic login code sent to email via SMTP
 */
const requestEmailCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await emailService.generateAndSendMagicCode({ email: cleanEmail });

    return res.json({
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      email: cleanEmail,
      simulated: result.simulated || false
    });
  } catch (err) {
    console.error('Request email code error:', err);
    return res.status(500).json({ error: 'Failed to dispatch email verification code.' });
  }
};

/**
 * Verify email magic code and log in (or auto-register if new patient)
 */
const verifyEmailCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const verification = emailService.verifyMagicCode(cleanEmail, code);

    if (!verification.valid) {
      return res.status(400).json({ error: verification.error });
    }

    // Check if user exists, else auto-register
    let { data: user } = await supabase
      .from('users')
      .select('id, name, email, avatar_url, created_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!user) {
      const cleanName = cleanEmail.split('@')[0];
      const randomPass = Math.random().toString(36).slice(-10) + 'Pass1!';
      const passwordHash = await bcrypt.hash(randomPass, 10);

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          name: cleanName,
          email: cleanEmail,
          password_hash: passwordHash
        })
        .select('id, name, email, created_at')
        .single();

      if (insertError) throw insertError;
      user = newUser;

      // Welcome email
      emailService.sendWelcomeEmail({
        email: cleanEmail,
        name: cleanName
      }).catch(err => console.warn('Welcome email error:', err.message));
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Email code verified. Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ad2737&color=fff`
      }
    });
  } catch (err) {
    console.error('Verify email code error:', err);
    return res.status(500).json({ error: 'Failed to verify login code.' });
  }
};

/**
 * Apple ID Sign In
 */
const appleAuth = async (req, res) => {
  try {
    const { email, name, appleUserId } = req.body;
    if (!email && !appleUserId) {
      return res.status(400).json({ error: 'Apple ID credentials are required.' });
    }

    const cleanEmail = (email || `${appleUserId}@privaterelay.appleid.com`).trim().toLowerCase();
    const cleanName = (name && name.trim()) || 'Apple ID Patient';

    let { data: user } = await supabase
      .from('users')
      .select('id, name, email, avatar_url, created_at')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!user) {
      const randomPass = Math.random().toString(36).slice(-10) + 'Pass1!';
      const passwordHash = await bcrypt.hash(randomPass, 10);

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          name: cleanName,
          email: cleanEmail,
          password_hash: passwordHash
        })
        .select('id, name, email, created_at')
        .single();

      if (insertError) throw insertError;
      user = newUser;

      emailService.sendWelcomeEmail({
        email: cleanEmail,
        name: cleanName
      }).catch(err => console.warn('Welcome email error:', err.message));
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Apple ID authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ad2737&color=fff`
      }
    });
  } catch (err) {
    console.error('Apple auth error:', err);
    return res.status(500).json({ error: 'Internal server error during Apple auth.' });
  }
};

/**
 * Update Profile & Dispatch Confirmation Email
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatarUrl } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (avatarUrl) updates.avatar_url = avatarUrl;

    if (Object.keys(updates).length > 0) {
      await supabase.from('users').update(updates).eq('id', userId);
    }

    // Trigger confirmation email
    emailService.sendProfileUpdatedEmail({
      email: req.user.email,
      name: name || req.user.name,
      changes: 'Demographics, Biometrics & Clinical Parameters'
    }).catch(err => console.warn('Profile update email error:', err.message));

    return res.json({
      message: 'Profile updated and security confirmation email dispatched.',
      user: {
        id: userId,
        name: name || req.user.name,
        email: req.user.email,
        avatarUrl
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
};

/**
 * Trigger Daily Schedule Timeline Email
 */
const sendDailyTimelineEmail = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.body?.email;
    const userName = req.user?.name || req.body?.name || 'Patient';

    if (!userEmail) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const result = await emailService.sendDailyReminderEmail({
      email: userEmail,
      name: userName
    });

    return res.json({
      message: `Daily glycemic schedule dispatched to ${userEmail} via SMTP.`,
      result
    });
  } catch (err) {
    console.error('Send timeline email error:', err);
    return res.status(500).json({ error: 'Failed to dispatch daily timeline email.' });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  appleAuth,
  requestEmailCode,
  verifyEmailCode,
  updateProfile,
  sendDailyTimelineEmail,
  getMe,
  deleteAccount
};
