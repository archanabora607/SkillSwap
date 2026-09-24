const express = require('express');
const router = express.Router();
const { scheduleSession, getMySessions, getSessionById, completeSession, cancelSession } = require('../controllers/session.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, scheduleSession);
router.get('/', protect, getMySessions);
router.get('/:id', protect, getSessionById);
router.put('/:id/complete', protect, completeSession);
router.put('/:id/cancel', protect, cancelSession);

module.exports = router;
