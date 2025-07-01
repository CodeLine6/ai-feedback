const express = require('express');
const { createFeedback, getFeedbackHistory } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', validateFeedback, createFeedback);
router.get('/history', getFeedbackHistory);

module.exports = router;