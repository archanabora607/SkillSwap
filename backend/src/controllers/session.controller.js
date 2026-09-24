const Session = require('../models/Session.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const notificationService = require('../services/notification.service');

// @desc    Schedule a session
// @route   POST /api/sessions
// @access  Private
const scheduleSession = asyncHandler(async (req, res) => {
  const { exchangeRequestId, teacherId, learnerId, skillId, scheduledAt, duration, meetingLink } = req.body;

  const session = await Session.create({
    exchangeRequest: exchangeRequestId,
    teacher: teacherId,
    learner: learnerId,
    skill: skillId,
    scheduledAt,
    duration: duration || 60,
    meetingLink: meetingLink || '',
  });

  await session.populate([
    { path: 'teacher', select: 'name' },
    { path: 'learner', select: 'name' },
    { path: 'skill' },
  ]);

  // Notify both participants
  const otherId = teacherId === req.user._id.toString() ? learnerId : teacherId;
  await notificationService.createAndEmit(req.io, {
    recipient: otherId,
    type: 'session_scheduled',
    title: 'Session Scheduled!',
    body: `A learning session has been scheduled for ${new Date(scheduledAt).toLocaleDateString()}.`,
    data: { sessionId: session._id },
  });

  sendSuccess(res, 201, 'Session scheduled successfully', { session });
});

// @desc    Get my sessions
// @route   GET /api/sessions
// @access  Private
const getMySessions = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {
    $or: [{ teacher: req.user._id }, { learner: req.user._id }],
  };
  if (status) filter.status = status;

  const sessions = await Session.find(filter)
    .populate('teacher', 'name')
    .populate('learner', 'name')
    .populate('skill')
    .populate('exchangeRequest', 'status')
    .sort({ scheduledAt: 1 });

  sendSuccess(res, 200, 'Sessions fetched', { sessions });
});

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate('teacher', 'name college')
    .populate('learner', 'name college')
    .populate('skill')
    .populate('exchangeRequest');

  if (!session) return sendError(res, 404, 'Session not found.');

  const isParticipant =
    session.teacher._id.toString() === req.user._id.toString() ||
    session.learner._id.toString() === req.user._id.toString();
  if (!isParticipant) return sendError(res, 403, 'Access denied.');

  sendSuccess(res, 200, 'Session fetched', { session });
});

// @desc    Mark session as complete
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return sendError(res, 404, 'Session not found.');
  if (session.status !== 'scheduled') return sendError(res, 400, 'Only scheduled sessions can be completed.');

  session.status = 'completed';
  await session.save();

  // Update both users' completedSessions count
  await User.findByIdAndUpdate(session.teacher, { $inc: { completedSessions: 1 } });
  await User.findByIdAndUpdate(session.learner, { $inc: { completedSessions: 1 } });

  sendSuccess(res, 200, 'Session marked as completed', { session });
});

// @desc    Cancel session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
const cancelSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) return sendError(res, 404, 'Session not found.');
  if (session.status !== 'scheduled') return sendError(res, 400, 'Only scheduled sessions can be cancelled.');

  const isParticipant =
    session.teacher.toString() === req.user._id.toString() ||
    session.learner.toString() === req.user._id.toString();
  if (!isParticipant) return sendError(res, 403, 'Access denied.');

  session.status = 'cancelled';
  session.cancelReason = req.body.reason || '';
  await session.save();

  sendSuccess(res, 200, 'Session cancelled', { session });
});

module.exports = { scheduleSession, getMySessions, getSessionById, completeSession, cancelSession };
