import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const OrderStatusChart = ({ orders }) => {
  const orderStatusData = [
    { name: 'Confirmed', value: orders.filter(order => order.status === 'confirmed').length },
    { name: 'Cancelled', value: orders.filter(order => order.status === 'cancelled').length },
     { name: 'Delivered', value: orders.filter(order => order.status === 'delivered').length },
  ];

  const COLORS = ['#899499','#D3D3D3', '#000000',];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderStatusChart;