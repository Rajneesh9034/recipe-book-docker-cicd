const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// GET all recipes with filters
router.get('/', async (req, res) => {
  try {
    const { cuisine, difficulty, search, sort } = req.query;
    let query = {};

    // Filters
    if (cuisine) query.cuisine = cuisine;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = {};
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'rating') sortOption = { averageRating: -1 };
    else if (sort === 'prepTime') sortOption = { prepTime: 1 };

    const recipes = await Recipe.find(query).sort(sortOption);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create recipe with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const recipeData = JSON.parse(req.body.recipe);
    const recipe = new Recipe(recipeData);
    
    if (req.file) {
      recipe.image = req.file.filename;
    }
    
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT update recipe
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipeData = JSON.parse(req.body.recipe);
    
    // Update fields
    Object.assign(recipe, recipeData);
    
    // Handle image update
    if (req.file) {
      // Delete old image
      if (recipe.image && recipe.image !== 'default-recipe.jpg') {
        const oldImagePath = path.join('uploads', recipe.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      recipe.image = req.file.filename;
    }
    
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Delete image
    if (recipe.image && recipe.image !== 'default-recipe.jpg') {
      const imagePath = path.join('uploads', recipe.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST rate recipe
router.post('/:id/rate', async (req, res) => {
  try {
    const { rating, comment, user } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    recipe.ratings.push({ rating, comment, user });
    await recipe.save();
    
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET cuisines list
router.get('/cuisines/list', async (req, res) => {
  try {
    const cuisines = await Recipe.distinct('cuisine');
    res.json(cuisines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;