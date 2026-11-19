const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * POST /api/upload/avatar
 * Accepts base64 encoded image or raw buffer payload
 * Uploads to Supabase Storage bucket 'avatars' and returns public URL
 */
router.post('/avatar', async (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required (base64 string).' });
    }

    // Parse base64 header and extract content type & buffer
    let mimeType = 'image/png';
    let base64Data = image;

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    // Determine extension
    let ext = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('svg')) ext = 'svg';

    const buffer = Buffer.from(base64Data, 'base64');
    const safeFilename = `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // Upload to Supabase 'avatars' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(safeFilename, buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return res.status(500).json({ 
        error: 'Failed to upload image to Supabase Storage.',
        details: uploadError.message 
      });
    }

    // Retrieve public URL
    const { data: publicData } = supabase.storage
      .from('avatars')
      .getPublicUrl(safeFilename);

    const publicUrl = publicData?.publicUrl;

    // Optional: If user is logged in and header has Authorization, optionally update users table if column exists
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/authMiddleware');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded?.id) {
          await supabase
            .from('users')
            .update({ avatar_url: publicUrl })
            .eq('id', decoded.id);
        }
      } catch (err) {
        // Non-fatal if column doesn't exist yet or token invalid
        console.log('Skipping db user avatar_url sync:', err.message);
      }
    }

    return res.status(200).json({
      message: 'Avatar uploaded successfully.',
      publicUrl,
      filename: safeFilename
    });
  } catch (err) {
    console.error('Avatar upload exception:', err);
    return res.status(500).json({ error: 'Server error during avatar upload.', details: err.message });
  }
});

module.exports = router;
