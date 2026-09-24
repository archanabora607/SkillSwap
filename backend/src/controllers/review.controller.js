const Review = require('../models/Review.model');
const User = require('../models/User.model');
const Session = require('../models/Session.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const notificationService = require('../services/notification.service');

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private
const submitReview = asyncHandler(async (req, res) => {
  const { sessionId, revieweeId, rating, categories, comment } = req.body;

  // Ensure session is completed
  const session = await Session.findById(sessionId);
  if (!session) return sendError(res, 404, 'Session not found.');
  if (session.status !== 'completed') return sendError(res, 400, 'Can only review completed sessions.');

  // Ensure reviewer was a participant
  const isParticipant =
    session.teacher.toString() === req.user._id.toString() ||
    session.learner.toString() === req.user._id.toString();
  if (!isParticipant) return sendError(res, 403, 'You were not part of this session.');

  // Prevent duplicate review
  const existing = await Review.findOne({ session: sessionId, reviewer: req.user._id });
  if (existing) return sendError(res, 400, 'You have already submitted a review for this session.');

  const review = await Review.create({
    session: sessionId,
    reviewer: req.user._id,
    reviewee: revieweeId,
    rating,
    categories,
    comment,
  });

  // Update reviewee's average rating
  const allReviews = await Review.find({ reviewee: revieweeId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await User.findByIdAndUpdate(revieweeId, {
    'rating.average': Math.round(avgRating * 10) / 10,
    'rating.count': allReviews.length,
  });

  // Notify reviewee
  await notificationService.createAndEmit(req.io, {
    recipient: revieweeId,
    type: 'new_review',
    title: 'You received a new review!',
    body: `${req.user.name} gave you a ${rating}-star rating.`,
    data: { reviewId: review._id, sessionId },
  });

  sendSuccess(res, 201, 'Review submitted successfully', { review });
});

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.userId })
    .populate('reviewer', 'name')
    .populate({ path: 'session', populate: { path: 'skill', select: 'name' } })
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Reviews fetched', { reviews });
});

module.exports = { submitReview, getUserReviews };
