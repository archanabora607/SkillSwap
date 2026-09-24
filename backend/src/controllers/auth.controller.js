const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, college, department, year, bio, skillsToTeach, skillsToLearn } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return sendError(res, 400, 'An account with this email already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    college: college || '',
    department: department || '',
    year: year ? Number(year) : 1,
    bio: bio || '',
    skillsToTeach: skillsToTeach || [],
    skillsToLearn: skillsToLearn || [],
  });

  const token = generateToken(user._id);

  sendSuccess(res, 201, 'Account created successfully', {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      department: user.department,
      year: user.year,
      bio: user.bio,
      skillsToTeach: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 401, 'Invalid email or password.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return sendError(res, 401, 'Invalid email or password.');
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, 'Login successful', {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      department: user.department,
      year: user.year,
      bio: user.bio,
      rating: user.rating,
      completedSessions: user.completedSessions,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill');

  sendSuccess(res, 200, 'User fetched', { user });
});

module.exports = { register, login, getMe };
