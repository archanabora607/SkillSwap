const User = require('../models/User.model');
const Review = require('../models/Review.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get all users (paginated, filterable)
// @route   GET /api/users
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  const { college, search, page = 1, limit = 20 } = req.query;
  const filter = { _id: { $ne: req.user._id } };

  if (college) filter.college = { $regex: college, $options: 'i' };
  if (search) filter.name = { $regex: search, $options: 'i' };

  const users = await User.find(filter)
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill')
    .select('-password')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  sendSuccess(res, 200, 'Users fetched', {
    users,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

// @desc    Get single user profile
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill')
    .select('-password');

  if (!user) return sendError(res, 404, 'User not found.');

  sendSuccess(res, 200, 'User fetched', { user });
});

// @desc    Update own profile
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  if (req.params.id !== req.user._id.toString()) {
    return sendError(res, 403, 'You can only update your own profile.');
  }

  const allowedFields = ['name', 'college', 'department', 'year', 'bio', 'skillsToTeach', 'skillsToLearn', 'availability', 'interests'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill')
    .select('-password');

  sendSuccess(res, 200, 'Profile updated successfully', { user });
});

// @desc    Get reviews for a user
// @route   GET /api/users/:id/reviews
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewee: req.params.id })
    .populate('reviewer', 'name')
    .populate('session', 'skill scheduledAt')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Reviews fetched', { reviews });
});

module.exports = { getAllUsers, getUserById, updateUser, getUserReviews };
