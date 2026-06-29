import React, { useState } from 'react';
import axios from 'axios';
import api from "../config/axios";

const ShoppingList = ({ recipeIds }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const generateList = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/shopping/generate', { recipeIds });
      setItems(response.data);
    } catch (error) {
      console.error('Error generating shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shopping List</h2>
        <button
          onClick={generateList}
          className="btn-primary"
          disabled={loading || recipeIds.length === 0}
        >
          {loading ? 'Generating...' : 'Generate List'}
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={checkedItems[index] || false}
                onChange={() => toggleItem(index)}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <span className={checkedItems[index] ? 'line-through text-gray-400' : ''}>
                <span className="font-medium">{item.quantity}</span> {item.item}
              </span>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => {
              setItems([]);
              setCheckedItems({});
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear List
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;