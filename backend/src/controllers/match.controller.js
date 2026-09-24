const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const matchService = require('../services/match.service');

// @desc    Get ranked matches for current user
// @route   GET /api/matches
// @access  Private
const getMatches = asyncHandler(async (req, res) => {
  const { minScore = 0, minMatch, college, category, search, skillLevel, availability, page = 1, limit = 12 } = req.query;
  const threshold = Number(minScore || minMatch || 0);

  const currentUser = await User.findById(req.user._id)
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill');

  if (!currentUser) {
    return sendSuccess(res, 200, 'Matches fetched', { matches: [], pagination: { total: 0, page: 1, pages: 0 } });
  }

  // Build filter for candidates
  const filter = { _id: { $ne: req.user._id } };
  if (college) filter.college = { $regex: college, $options: 'i' };

  let allUsers = await User.find(filter)
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill')
    .select('-password');

  // Filter by category if requested
  if (category) {
    const catLower = category.toLowerCase();
    allUsers = allUsers.filter((u) => {
      const teachCat = u.skillsToTeach.some((s) => s.skill?.category?.toLowerCase() === catLower);
      const learnCat = u.skillsToLearn.some((s) => s.skill?.category?.toLowerCase() === catLower);
      return teachCat || learnCat;
    });
  }

  // Filter by search query if requested
  if (search) {
    const searchLower = search.toLowerCase().trim();
    allUsers = allUsers.filter((u) => {
      const nameMatch = u.name?.toLowerCase().includes(searchLower);
      const teachMatch = u.skillsToTeach.some((s) => s.skill?.name?.toLowerCase().includes(searchLower));
      const learnMatch = u.skillsToLearn.some((s) => s.skill?.name?.toLowerCase().includes(searchLower));
      return nameMatch || teachMatch || learnMatch;
    });
  }

  // Score each user
  let scored = allUsers
    .map((candidate) => {
      const result = matchService.calculateMatch(currentUser, candidate);
      return { user: candidate, ...result };
    })
    .filter((m) => m.matchPercentage >= threshold)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Filter by skill level if requested
  if (skillLevel) {
    scored = scored.filter((m) =>
      m.user.skillsToTeach.some((s) => s.level === skillLevel)
    );
  }

  // Filter by availability if requested
  if (availability) {
    scored = scored.filter((m) =>
      m.user.availability.some((a) => a.day === availability)
    );
  }

  const total = scored.length;
  const paginated = scored.slice((page - 1) * limit, page * limit);

  sendSuccess(res, 200, 'Matches fetched', {
    matches: paginated,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) || 1 },
  });
});

// @desc    Get match score with specific user
// @route   GET /api/matches/:userId
// @access  Private
const getMatchWithUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id)
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill');

  const targetUser = await User.findById(req.params.userId)
    .populate('skillsToTeach.skill')
    .populate('skillsToLearn.skill')
    .select('-password');

  if (!targetUser) {
    return sendSuccess(res, 404, 'User not found');
  }

  const result = matchService.calculateMatch(currentUser, targetUser);

  sendSuccess(res, 200, 'Match score calculated', { ...result, user: targetUser });
});

module.exports = { getMatches, getMatchWithUser };
