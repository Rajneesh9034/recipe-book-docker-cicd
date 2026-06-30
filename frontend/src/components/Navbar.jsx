import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaUtensils className="text-2xl text-blue-600" />
            <span className="text-xl font-bold text-gray-800">RecipeBook</span>
          </Link>
          
          <Link to="/add" className="btn-primary flex items-center space-x-2">
            <FaPlus />
            <span>Add Recipe Rajneesh</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;