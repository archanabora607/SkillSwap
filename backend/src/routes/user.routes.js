const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, getUserReviews } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.get('/:id/reviews', protect, getUserReviews);

module.exports = router;
