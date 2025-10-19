import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopProductsChart = ({ orders }) => {
  const productSales = {};

  orders
    .filter((order) => order.status === "delivered")
    .forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            name: item.title.length > 25 ? item.title.substring(0, 25) + "..." : item.title,
            sales: 0,
            revenue: item.price * item.quantity,
            fullName: item.title
          };
        }
        productSales[item.id].sales += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });
     
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-semibold text-sm">{data.fullName}</p>
          <p className="text-gray-300 text-sm">Units Sold: <span className="text-white">{data.sales}</span></p>
          <p className="text-gray-300 text-sm">Revenue: <span className="text-white">₹{data.revenue.toLocaleString()}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Top Selling Products</h3>
          <p className="text-gray-500 mt-1">By units sold</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-lg font-bold text-gray-900">{topProducts.length}</p>
        </div>
      </div>
      
      <div className="h-80">
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
              <XAxis 
                type="number" 
                fontSize={12} 
                tick={{ fill: "#666" }}
                tickFormatter={(value) => value}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={90}
                fontSize={12}
                tick={{ fill: "#666" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sales" 
                fill="#000000" 
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">📦</span>
            </div>
            <p>No sales data yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsChart;