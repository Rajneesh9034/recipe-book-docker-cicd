import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import api from "../config/axios";
import API_URL from "../config/api";
const RecipeCard = ({ recipe, onDelete }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'text-green-600 bg-green-100',
      Medium: 'text-yellow-600 bg-yellow-100',
      Hard: 'text-red-600 bg-red-100'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="card overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {recipe.image ? (
          <img 
            src={`${API_URL}/uploads/${recipe.image}`} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-purple-500">
            <span className="text-white text-4xl">🍳</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex space-x-2">
          <Link 
            to={`/edit/${recipe._id}`}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50"
          >
            <FaEdit className="text-blue-600" />
          </Link>
          <button
            onClick={() => onDelete(recipe._id)}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50"
          >
            <FaTrash className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/recipe/${recipe._id}`}>
          <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {recipe.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {recipe.cuisine}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FaClock className="text-xs" />
              <span>{recipe.prepTime + recipe.cookTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaUser className="text-xs" />
              <span>{recipe.servings}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-semibold">
              {recipe.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">
              ({recipe.ratings?.length || 0})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;