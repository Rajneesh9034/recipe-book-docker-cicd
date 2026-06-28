const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  saves: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  dailyViews: [{
    date: Date,
    count: Number
  }],
  lastViewed: Date
});

module.exports = mongoose.model('Analytics', analyticsSchema);