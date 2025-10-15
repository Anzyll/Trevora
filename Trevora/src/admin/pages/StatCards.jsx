import React from 'react';

const StatsCards = ({ totalRevenue, totalUsers, totalProducts, totalOrders }) => {
  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
     
    },
    {
      title: 'Total Users',
      value: totalUsers.toString(),
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;