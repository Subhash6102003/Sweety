const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/apple', appleAuth);
router.post('/email/request-code', requestEmailCode);
router.post('/email/verify-code', verifyEmailCode);
router.put('/profile', verifyToken, updateProfile);
router.post('/daily-timeline', sendDailyTimelineEmail);
router.get('/me', verifyToken, getMe);
router.delete('/me', verifyToken, deleteAccount);

module.exports = router;
