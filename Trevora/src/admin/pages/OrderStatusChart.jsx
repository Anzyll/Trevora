
import React from "react";
const OrderStatusChart = ({ orders }) => {
  const statusData = {
    Processing: orders.filter(order => order.status === 'Processing').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  };

  const totalOrders = orders.length;
  const completedOrders = statusData.delivered;

  const ProgressRing = ({ percentage, color, label, value, description }) => {
    const radius = 36;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="text-center">
        <div className="relative inline-block mb-3">
          <svg width="84" height="84" className="transform -rotate-90">
            <circle
              cx="42"
              cy="42"
              r={radius}
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx="42"
              cy="42"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{percentage}%</div>
            </div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm mb-1">{label}</div>
          <div className="text-gray-500 text-xs">{description}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order Status</h3>
          <p className="text-gray-500 text-sm mt-1">Distribution overview</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
          <div className="text-gray-500 text-sm">Total Orders</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ProgressRing
          percentage={totalOrders > 0 ? ((statusData.Processing / totalOrders) * 100).toFixed(1) : 0}
          color="#F59E0B"
          label="Processing"
          value={statusData.Processing}
          description="In progress"
        />
        <ProgressRing
          percentage={totalOrders > 0 ? ((statusData.shipped / totalOrders) * 100).toFixed(1) : 0}
          color="#3B82F6"
          label="Shipped"
          value={statusData.shipped}
          description="On the way"
        />
        <ProgressRing
          percentage={totalOrders > 0 ? ((statusData.delivered / totalOrders) * 100).toFixed(1) : 0}
          color="#10B981"
          label="Delivered"
          value={statusData.delivered}
          description="Completed"
        />
        <ProgressRing
          percentage={totalOrders > 0 ? ((statusData.cancelled / totalOrders) * 100).toFixed(1) : 0}
          color="#EF4444"
          label="Cancelled"
          value={statusData.cancelled}
          description="Returned"
        />
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{completedOrders}</div>
            <div className="text-gray-600 text-sm">Successful</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-gray-600 text-sm">Success Rate</div>
          </div>
        </div>
      </div>

      {totalOrders === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-gray-900 font-medium mb-1">No orders yet</p>
          <p className="text-gray-500 text-sm">Status overview will appear here</p>
        </div>
      )}
    </div>
  );
};

export default OrderStatusChart;