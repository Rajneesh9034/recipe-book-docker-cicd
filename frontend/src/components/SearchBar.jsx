import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ filters, onFilterChange }) => {
  const cuisines = ['All', 'Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'French', 'Thai', 'American', 'Mediterranean', 'Other'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'prepTime', label: 'Quickest Prep' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cuisine Filter */}
        <select
          value={filters.cuisine}
          onChange={(e) => onFilterChange('cuisine', e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cuisines.map(cuisine => (
            <option key={cuisine} value={cuisine === 'All' ? '' : cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={filters.difficulty}
          onChange={(e) => onFilterChange('difficulty', e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty === 'All' ? '' : difficulty}>
              {difficulty}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;