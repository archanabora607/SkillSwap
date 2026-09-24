const Conversation = require('../models/Conversation.model');
const Message = require('../models/Message.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get all conversations for current user
// @route   GET /api/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name isOnline lastSeen')
    .populate('lastMessage')
    .populate('exchangeRequest', 'status')
    .sort({ updatedAt: -1 });

  sendSuccess(res, 200, 'Conversations fetched', { conversations });
});

// @desc    Get messages in a conversation (paginated)
// @route   GET /api/conversations/:id/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return sendError(res, 404, 'Conversation not found.');

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === req.user._id.toString()
  );
  if (!isParticipant) return sendError(res, 403, 'Access denied.');

  const messages = await Message.find({ conversation: req.params.id })
    .populate('sender', 'name')
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  // Reset unread count for this user
  conversation.unreadCount.set(req.user._id.toString(), 0);
  await conversation.save();

  sendSuccess(res, 200, 'Messages fetched', { messages: messages.reverse() });
});

module.exports = { getConversations, getMessages };
