const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    exchangeRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'ExchangeRequest', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
    scheduledAt: { type: Date, required: [true, 'Session date/time is required'] },
    duration: { type: Number, default: 60 }, // in minutes
    meetingLink: { type: String, default: '' },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    cancelReason: { type: String, default: '' },
  },
  { timestamps: true }
);

sessionSchema.index({ teacher: 1 });
sessionSchema.index({ learner: 1 });
sessionSchema.index({ scheduledAt: 1 });
sessionSchema.index({ status: 1 });

module.exports = mongoose.model('Session', sessionSchema);
