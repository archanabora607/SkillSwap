const express = require('express');
const router = express.Router();
const { getAllSkills, searchSkills, suggestSkill } = require('../controllers/skill.controller');
const { protect } = require('../middleware/auth.middleware');

// Make skill listing public so register page can load skills
router.get('/', getAllSkills);
router.get('/search', searchSkills);
router.post('/suggest', protect, suggestSkill);

module.exports = router;
