const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  cuisine: {
    type: String,
    required: true,
    enum: ['Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'French', 'Thai', 'American', 'Mediterranean', 'Other']
  },
  prepTime: {
    type: Number, // in minutes
    required: true
  },
  cookTime: {
    type: Number, // in minutes
    required: true
  },
  servings: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  image: {
    type: String,
    default: 'default-recipe.jpg'
  },
  ratings: [{
    user: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating before saving
recipeSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = total / this.ratings.length;
  }
  next();
});
// Add at the bottom of the recipe schema
recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);