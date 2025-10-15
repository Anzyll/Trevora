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
            name: item.title,
            sales: 0,
          };
        }
        productSales[item.id].sales += item.quantity;
      });
    });
     
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Selling Products
      </h3>
      <div className="h-80">
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                angle={-40}
                textAnchor="end"
                height={40}
                interval={0}
                fontSize={11}
                tick={{ fill: "#666" }}
              />
              <YAxis fontSize={12} tick={{ fill: "#666" }} />
              <Tooltip />
              <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No sales data yet
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductsChart;

