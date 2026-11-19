const express = require('express');
const router = express.Router();
const { register, login, googleAuth, getMe, deleteAccount } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', verifyToken, getMe);
router.delete('/me', verifyToken, deleteAccount);

module.exports = router;
