const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderSkillsOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    receiverSkillsWanted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    message: { type: String, maxlength: 500, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    matchScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

exchangeRequestSchema.index({ sender: 1 });
exchangeRequestSchema.index({ receiver: 1 });
exchangeRequestSchema.index({ status: 1 });

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
