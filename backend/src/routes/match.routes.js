const express = require('express');
const router = express.Router();
const { getMatches, getMatchWithUser } = require('../controllers/match.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getMatches);
router.get('/recommendations', protect, getMatches);
router.get('/:userId', protect, getMatchWithUser);

module.exports = router;
