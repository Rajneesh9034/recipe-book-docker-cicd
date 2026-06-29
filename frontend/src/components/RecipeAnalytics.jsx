import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from "../config/axios";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RecipeAnalytics = ({ recipeId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [recipeId]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/api/analytics/recipe/${recipeId}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return null;

  const chartData = {
    labels: analytics.dailyViews?.slice(-7).map(d => 
      new Date(d.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Daily Views',
        data: analytics.dailyViews?.slice(-7).map(d => d.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Recipe Analytics</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Total Views</p>
          <p className="text-2xl font-bold text-blue-600">{analytics.views || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Saves</p>
          <p className="text-2xl font-bold text-green-600">{analytics.saves || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Shares</p>
          <p className="text-2xl font-bold text-purple-600">{analytics.shares || 0}</p>
        </div>
      </div>

      {analytics.dailyViews?.length > 0 && (
        <div className="h-64">
          <Line 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default RecipeAnalytics;