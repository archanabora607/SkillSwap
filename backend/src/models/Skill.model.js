const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Skill name is required'], unique: true, trim: true },
    category: {
      type: String,
      enum: ['Programming', 'Design', 'Data Science', 'Music', 'Language', 'Finance', 'Marketing', 'Other'],
      default: 'Other',
    },
    description: { type: String, default: '' },
    isApproved: { type: Boolean, default: true }, // false for user-suggested skills
  },
  { timestamps: true }
);

skillSchema.index({ category: 1 });

module.exports = mongoose.model('Skill', skillSchema);
