const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

// Generate shopping list from selected recipes
router.post('/generate', auth, async (req, res) => {
  try {
    const { recipeIds } = req.body;
    const recipes = await Recipe.find({ _id: { $in: recipeIds } });
    
    // Combine and organize ingredients
    const ingredientMap = new Map();
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        // Parse quantity and item (simple parsing)
        const [quantity, ...itemParts] = ingredient.split(' ');
        const item = itemParts.join(' ');
        
        if (ingredientMap.has(item)) {
          // Simple aggregation - you can make this smarter
          const existing = ingredientMap.get(item);
          ingredientMap.set(item, {
            item,
            quantity: existing.quantity + ' + ' + quantity
          });
        } else {
          ingredientMap.set(item, {
            item,
            quantity
          });
        }
      });
    });

    const shoppingList = Array.from(ingredientMap.values());
    res.json(shoppingList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;