const Skill = require('../models/Skill.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get all approved skills
// @route   GET /api/skills
// @access  Private
const getAllSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ isApproved: true }).sort({ category: 1, name: 1 });
  sendSuccess(res, 200, 'Skills fetched', { skills });
});

// @desc    Search skills by name
// @route   GET /api/skills/search?q=
// @access  Private
const searchSkills = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return sendSuccess(res, 200, 'Skills fetched', { skills: [] });

  const skills = await Skill.find({
    name: { $regex: q, $options: 'i' },
    isApproved: true,
  }).limit(10);

  sendSuccess(res, 200, 'Skills fetched', { skills });
});

// @desc    Suggest a new skill
// @route   POST /api/skills/suggest
// @access  Private
const suggestSkill = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const existing = await Skill.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
  if (existing) {
    // Return existing skill instead of error
    return sendSuccess(res, 200, 'Skill already exists', { skill: existing });
  }

  const skill = await Skill.create({ name, category: category || 'Other', isApproved: false });
  sendSuccess(res, 201, 'Skill suggestion submitted', { skill });
});

module.exports = { getAllSkills, searchSkills, suggestSkill };
