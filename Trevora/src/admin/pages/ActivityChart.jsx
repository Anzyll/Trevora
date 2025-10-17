import React from 'react';

const ActivityProgressChart = ({ orders }) => {
  // Calculate sales by activity
  const calculateActivityData = () => {
    const activityData = {};
    
    orders
      .filter(order => order.status === 'delivered' || order.status === 'confirmed')
      .forEach(order => {
        order.items.forEach(item => {
          const activity = item.activity || 'Other';
          if (!activityData[activity]) {
            activityData[activity] = {
              sales: 0,
              revenue: 0,
              orders: 0
            };
          }
          activityData[activity].sales += item.quantity;
          activityData[activity].revenue +=(item.price * item.quantity);
          activityData[activity].orders += 1;
        });
      });

    return Object.entries(activityData)
      .map(([activity, data]) => ({
        activity,
        ...data
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const activityData = calculateActivityData();
  const maxRevenue = Math.max(...activityData.map(a => a.revenue), 1);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Performance</h3>
      
      <div className="space-y-6">
        {activityData.map((activity, index) => {
          const progress = (activity.revenue / maxRevenue) * 100;
          
          return (
            <div key={activity.activity} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                
                  <div>
                    <p className="font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-sm text-gray-500">
                      {activity.sales} units • {activity.orders} orders
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">₹{activity.revenue.toLocaleString()}</p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-black h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        
        {activityData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No activity data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityProgressChart;