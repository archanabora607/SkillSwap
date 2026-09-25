const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Skill = require('../models/Skill.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Helper to ensure each skill is resolved to a valid MongoDB ObjectId
const processSkillEntries = async (skillEntries) => {
  if (!Array.isArray(skillEntries)) return [];
  const processed = [];

  for (const item of skillEntries) {
    let rawSkill = item.skill || item._id || item;
    let skillDoc = null;

    if (rawSkill && mongoose.Types.ObjectId.isValid(rawSkill)) {
      skillDoc = await Skill.findById(rawSkill);
    }

    // If not found by ObjectId, search by name
    if (!skillDoc) {
      const searchName = item.name || (typeof rawSkill === 'string' ? rawSkill.replace('sk_', '') : 'General Skill');
      skillDoc = await Skill.findOne({ name: { $regex: `^${searchName}$`, $options: 'i' } });
    }

    // If still not found, create a new approved Skill document dynamically
    if (!skillDoc) {
      const skillName = item.name || (typeof rawSkill === 'string' ? rawSkill : 'General Skill');
      skillDoc = await Skill.create({
        name: skillName,
        category: item.category || 'Other',
        isApproved: true,
      });
    }

    processed.push({
      skill: skillDoc._id,
      level: item.level || 'intermediate',
      priority: item.priority || 'medium',
    });
  }

  return processed;
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

  const processedTeach = await processSkillEntries(skillsToTeach);
  const processedLearn = await processSkillEntries(skillsToLearn);

  const user = await User.create({
    name,
    email,
    password,
    college: college || '',
    department: department || '',
    year: year ? Number(year) : 1,
    bio: bio || '',
    skillsToTeach: processedTeach,
    skillsToLearn: processedLearn,
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
