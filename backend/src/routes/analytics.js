const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const auth = require('../middleware/auth');

// Track view
router.post('/track/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params;
    let analytics = await Analytics.findOne({ recipeId });
    
    if (!analytics) {
      analytics = new Analytics({ recipeId });
    }

    analytics.views += 1;
    analytics.lastViewed = new Date();
    
    // Add daily view
    const today = new Date().setHours(0, 0, 0, 0);
    const dailyView = analytics.dailyViews.find(
      d => new Date(d.date).setHours(0, 0, 0, 0) === today
    );
    
    if (dailyView) {
      dailyView.count += 1;
    } else {
      analytics.dailyViews.push({ date: new Date(), count: 1 });
    }

    await analytics.save();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get analytics for a recipe
router.get('/recipe/:recipeId', auth, async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ recipeId: req.params.recipeId });
    res.json(analytics || { views: 0, saves: 0, shares: 0 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get popular recipes
router.get('/popular', async (req, res) => {
  try {
    const popular = await Analytics.aggregate([
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'recipes',
          localField: 'recipeId',
          foreignField: '_id',
          as: 'recipe'
        }
      },
      { $unwind: '$recipe' }
    ]);
    res.json(popular);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
