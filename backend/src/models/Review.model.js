const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true, unique: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    categories: {
      teachingQuality: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      knowledge: { type: Number, min: 1, max: 5 },
      helpfulness: { type: Number, min: 1, max: 5 },
    },
    comment: { type: String, maxlength: 1000, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ session: 1 }, { unique: true });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });

module.exports = mongoose.model('Review', reviewSchema);
