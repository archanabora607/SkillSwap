const ExchangeRequest = require('../models/ExchangeRequest.model');
const Conversation = require('../models/Conversation.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const notificationService = require('../services/notification.service');

// @desc    Send an exchange request
// @route   POST /api/exchanges (or /api/requests)
// @access  Private
const sendRequest = asyncHandler(async (req, res) => {
  const { receiverId, offeredSkill, requestedSkill, senderSkillsOffered, receiverSkillsWanted, message, matchScore } = req.body;

  if (!receiverId) {
    return sendError(res, 400, 'Receiver ID is required.');
  }

  if (receiverId === req.user._id.toString()) {
    return sendError(res, 400, 'You cannot send a request to yourself.');
  }

  // Normalize offered/requested skill IDs
  let offered = senderSkillsOffered || (offeredSkill ? [offeredSkill] : []);
  let wanted = receiverSkillsWanted || (requestedSkill ? [requestedSkill] : []);

  if (!Array.isArray(offered)) offered = [offered];
  if (!Array.isArray(wanted)) wanted = [wanted];

  if (offered.length === 0 || wanted.length === 0) {
    return sendError(res, 400, 'Please select both an offered skill and a requested skill.');
  }

  // Fetch receiver user
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return sendError(res, 404, 'Recipient user not found.');
  }

  // Check if active (pending/accepted) request already exists
  const existing = await ExchangeRequest.findOne({
    $or: [
      { sender: req.user._id, receiver: receiverId },
      { sender: receiverId, receiver: req.user._id },
    ],
    status: { $in: ['pending', 'accepted'] },
  });

  if (existing) {
    return sendError(res, 400, 'An active exchange request already exists between you and this user.');
  }

  const exchange = await ExchangeRequest.create({
    sender: req.user._id,
    receiver: receiverId,
    senderSkillsOffered: offered,
    receiverSkillsWanted: wanted,
    message: message || '',
    matchScore: matchScore || 0,
    status: 'pending',
  });

  await exchange.populate([
    { path: 'sender', select: 'name email college department avatar' },
    { path: 'receiver', select: 'name email college department avatar' },
    { path: 'senderSkillsOffered' },
    { path: 'receiverSkillsWanted' },
  ]);

  // Create notification for receiver
  if (req.io) {
    await notificationService.createAndEmit(req.io, {
      recipient: receiverId,
      type: 'exchange_request',
      title: 'New Skill Exchange Request',
      body: `${req.user.name} wants to exchange skills with you!`,
      data: { exchangeId: exchange._id, senderId: req.user._id },
    });
  }

  sendSuccess(res, 201, 'Exchange request sent successfully', { exchange });
});

// @desc    Get my exchanges
// @route   GET /api/exchanges
// @access  Private
const getMyExchanges = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  };
  if (status) filter.status = status.toLowerCase();

  const exchanges = await ExchangeRequest.find(filter)
    .populate('sender', 'name college department bio avatar rating')
    .populate('receiver', 'name college department bio avatar rating')
    .populate('senderSkillsOffered')
    .populate('receiverSkillsWanted')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Exchanges fetched', { exchanges });
});

// @desc    Get single exchange
// @route   GET /api/exchanges/:id
// @access  Private
const getExchangeById = asyncHandler(async (req, res) => {
  const exchange = await ExchangeRequest.findById(req.params.id)
    .populate('sender', 'name college department bio avatar rating')
    .populate('receiver', 'name college department bio avatar rating')
    .populate('senderSkillsOffered')
    .populate('receiverSkillsWanted');

  if (!exchange) return sendError(res, 404, 'Exchange request not found.');

  const isParticipant =
    exchange.sender._id.toString() === req.user._id.toString() ||
    exchange.receiver._id.toString() === req.user._id.toString();
  if (!isParticipant) return sendError(res, 403, 'Access denied.');

  sendSuccess(res, 200, 'Exchange fetched', { exchange });
});

// @desc    Accept exchange request
// @route   PUT /api/exchanges/:id/accept
// @access  Private
const acceptRequest = asyncHandler(async (req, res) => {
  const exchange = await ExchangeRequest.findById(req.params.id);
  if (!exchange) return sendError(res, 404, 'Exchange request not found.');
  if (exchange.receiver.toString() !== req.user._id.toString()) return sendError(res, 403, 'Only the receiver can accept.');
  if (exchange.status !== 'pending') return sendError(res, 400, `Cannot accept a ${exchange.status} request.`);

  exchange.status = 'accepted';
  await exchange.save();

  // Find or Create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [exchange.sender, exchange.receiver] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [exchange.sender, exchange.receiver],
      exchangeRequest: exchange._id,
      unreadCount: { [exchange.sender.toString()]: 0, [exchange.receiver.toString()]: 0 },
    });
  }

  // Notify sender
  if (req.io) {
    await notificationService.createAndEmit(req.io, {
      recipient: exchange.sender,
      type: 'request_accepted',
      title: 'Exchange Request Accepted! 🎉',
      body: `${req.user.name} accepted your skill exchange request.`,
      data: { exchangeId: exchange._id, conversationId: conversation._id },
    });
  }

  sendSuccess(res, 200, 'Request accepted', { exchange, conversation });
});

// @desc    Reject exchange request
// @route   PUT /api/exchanges/:id/reject
// @access  Private
const rejectRequest = asyncHandler(async (req, res) => {
  const exchange = await ExchangeRequest.findById(req.params.id);
  if (!exchange) return sendError(res, 404, 'Exchange request not found.');
  if (exchange.receiver.toString() !== req.user._id.toString()) return sendError(res, 403, 'Only the receiver can reject.');
  if (exchange.status !== 'pending') return sendError(res, 400, `Cannot reject a ${exchange.status} request.`);

  exchange.status = 'rejected';
  await exchange.save();

  if (req.io) {
    await notificationService.createAndEmit(req.io, {
      recipient: exchange.sender,
      type: 'request_rejected',
      title: 'Exchange Request Not Accepted',
      body: `${req.user.name} declined your skill exchange request.`,
      data: { exchangeId: exchange._id },
    });
  }

  sendSuccess(res, 200, 'Request rejected', { exchange });
});

// @desc    Cancel exchange request
// @route   PUT /api/exchanges/:id/cancel
// @access  Private
const cancelRequest = asyncHandler(async (req, res) => {
  const exchange = await ExchangeRequest.findById(req.params.id);
  if (!exchange) return sendError(res, 404, 'Exchange request not found.');
  if (exchange.sender.toString() !== req.user._id.toString()) return sendError(res, 403, 'Only the sender can cancel.');
  if (exchange.status !== 'pending') return sendError(res, 400, 'Only pending requests can be cancelled.');

  exchange.status = 'cancelled';
  await exchange.save();
  sendSuccess(res, 200, 'Request cancelled', { exchange });
});

// @desc    Mark exchange as completed
// @route   PUT /api/exchanges/:id/complete
// @access  Private
const completeRequest = asyncHandler(async (req, res) => {
  const exchange = await ExchangeRequest.findById(req.params.id);
  if (!exchange) return sendError(res, 404, 'Exchange request not found.');

  const isParticipant =
    exchange.sender.toString() === req.user._id.toString() ||
    exchange.receiver.toString() === req.user._id.toString();
  if (!isParticipant) return sendError(res, 403, 'Access denied.');
  if (exchange.status !== 'accepted') return sendError(res, 400, 'Only accepted exchanges can be completed.');

  exchange.status = 'completed';
  await exchange.save();
  sendSuccess(res, 200, 'Exchange marked as completed', { exchange });
});

// @desc    Unified respond handler (PATCH /:id/respond)
// @route   PATCH /api/exchanges/:id/respond or /api/requests/:id/respond
// @access  Private
const respondToRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const targetStatus = (status || '').toLowerCase();

  if (targetStatus === 'accepted') {
    return acceptRequest(req, res);
  } else if (targetStatus === 'rejected') {
    return rejectRequest(req, res);
  } else if (targetStatus === 'cancelled') {
    return cancelRequest(req, res);
  } else {
    return sendError(res, 400, `Invalid status: ${status}`);
  }
});

module.exports = {
  sendRequest,
  getMyExchanges,
  getExchangeById,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
  respondToRequest,
};
