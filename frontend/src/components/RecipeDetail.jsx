import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaClock, FaUser, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import api from "../config/axios";
import API_URL from "../config/api";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/api/recipes/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const handleRating = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/recipes/${id}/rate`, { rating, comment, user });
      fetchRecipe();
      setRating(0);
      setComment('');
      setUser('');
    } catch (error) {
      console.error('Error rating recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft />
        <span>Back to Recipes</span>
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 bg-gray-200">
          {recipe.image ? (
            <img
              src={`${API_URL}//uploads/${recipe.image}`}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-purple-500">
              <span className="text-white text-6xl">🍳</span>
            </div>
          )}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Link
              to={`/edit/${recipe._id}`}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-50"
            >
              <FaEdit className="text-blue-600" />
            </Link>
            <button
              onClick={handleDelete}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-red-50"
            >
              <FaTrash className="text-red-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {recipe.cuisine}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {recipe.difficulty}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400 text-2xl" />
              <span className="text-2xl font-bold">{recipe.averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({recipe.ratings?.length || 0} reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>

          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-600" />
              <span>Prep: {recipe.prepTime}min</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-blue-600" />
              <span>Cook: {recipe.cookTime}min</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUser className="text-blue-600" />
              <span>Serves: {recipe.servings}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h2 className="text-xl font-bold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-xl font-bold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="font-bold text-blue-600 mr-3">{index + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Rating Section */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-bold mb-4">Rate this Recipe</h2>
            <form onSubmit={handleRating} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl focus:outline-none"
                    >
                      <FaStar
                        className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Rating
              </button>
            </form>

            {/* Reviews */}
            {recipe.ratings && recipe.ratings.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Reviews</h3>
                <div className="space-y-3">
                  {recipe.ratings.map((r, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold">{r.user}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(r.date).toLocaleDateString()}
                        </span>
                      </div>
                      {r.comment && <p className="text-gray-600 mt-1">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;