const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getMyExchanges,
  getExchangeById,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
  respondToRequest,
} = require('../controllers/exchange.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, sendRequest);
router.get('/', protect, getMyExchanges);
router.get('/:id', protect, getExchangeById);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.put('/:id/cancel', protect, cancelRequest);
router.put('/:id/complete', protect, completeRequest);
router.patch('/:id/respond', protect, respondToRequest);

module.exports = router;
