const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  progress: { type: Number, default: 0 },
  isRecurring: { type: Boolean, default: false },
});

const Goal = mongoose.model('Goal', goalSchema);

// Create Goal
async function createGoal(userId, goalData) {
  const goal = new Goal({ userId, ...goalData });
  await goal.save();
  return goal;
}

// Get Goals
async function getGoals(userId) {
  return await Goal.find({ userId });
}

module.exports = { createGoal, getGoals };
