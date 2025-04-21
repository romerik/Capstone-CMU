// src/components/StatCard.jsx
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color, percentage }) => {
  const isPositive = percentage >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-coffee-latte transition-transform hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} text-white mr-4`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-600">{title}</h3>
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
          <span>{Math.abs(percentage)}%</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-coffee-dark">{value}</div>
      <div className="text-xs text-gray-500 mt-1">
        {isPositive ? 'Increased' : 'Decreased'} compared to previous period
      </div>
    </div>
  );
};

export default StatCard;