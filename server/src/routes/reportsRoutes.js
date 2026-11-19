const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.get('/', getReports);

module.exports = router;
