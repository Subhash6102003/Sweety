const express = require('express');
const router = express.Router();
const {
  getReadings,
  createReading,
  updateReading,
  deleteReading
} = require('../controllers/readingsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', getReadings);
router.post('/', createReading);
router.put('/:id', updateReading);
router.delete('/:id', deleteReading);

module.exports = router;
