const express = require('express');
const router = express.Router();
const { getConversations, getMessages } = require('../controllers/conversation.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getConversations);
router.get('/:id/messages', protect, getMessages);

module.exports = router;
