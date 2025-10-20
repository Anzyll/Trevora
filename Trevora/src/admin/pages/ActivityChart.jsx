

const ActivityProgressChart = ({ orders }) => {
  const calculateActivityData = () => {
    const activityData = {};

    orders
      .filter((order) => order.status === "delivered")
      .forEach((order) => {
        order.items.forEach((item) => {
          const activity = item.activity || "Other";
          if (!activityData[activity]) {
            activityData[activity] = {
              activity,
              sales: 0,
              revenue: 0,
              orders: 0,
              avgOrderValue: 0,
            };
          }
          activityData[activity].sales += item.quantity;
          activityData[activity].revenue += item.price * item.quantity;
          activityData[activity].orders += 1;
        });
      });

    Object.values(activityData).forEach((activity) => {
      activity.avgOrderValue =
        activity.orders > 0 ? activity.revenue / activity.orders : 0;
    });

    return Object.values(activityData).sort((a, b) => b.revenue - a.revenue);
  };

  const activityData = calculateActivityData();
  const totalRevenue = activityData.reduce(
    (sum, activity) => sum + activity.revenue,
    0
  );

  // Generate sparkline data (mock trend data)
  const generateSparkline = (baseValue, volatility = 0.3) => {
    return Array.from({ length: 6 }, (_, i) =>
      Math.max(0, baseValue * (1 + (Math.random() - 0.5) * volatility))
    );
  };

  const Sparkline = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <svg width="60" height="24" className="flex-shrink-0" viewBox="0 0 60 24">
        <path
          d={`M 0 24 ${data
            .map((value, index) => {
              const x = (index / (data.length - 1)) * 60;
              const y = 24 - ((value - min) / range) * 20;
              return `L ${x} ${y}`;
            })
            .join(" ")}`}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={60}
          cy={24 - ((data[data.length - 1] - min) / range) * 20}
          r="1.5"
          fill={color}
        />
      </svg>
    );
  };

  const getGrowthIndicator = (index) => {
    const growth = [12.5, 8.3, 5.7, 3.2, 1.8, 0.5];
    return growth[index] || 0;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `₹${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Activity Performance
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Revenue analytics by category
          </p>
        </div>
        <div className="text-center sm:text-right">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatNumber(totalRevenue)}
          </div>
          <div className="text-gray-500 text-sm">Total Revenue</div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {activityData.map((activity, index) => {
          const percentage =
            totalRevenue > 0
              ? ((activity.revenue / totalRevenue) * 100).toFixed(1)
              : 0;
          const growth = getGrowthIndicator(index);
          const sparklineData = generateSparkline(activity.revenue / 1000);
          const isPositive = growth > 0;

          return (
            <div
              key={activity.activity}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors duration-200 gap-3 sm:gap-4"
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    {percentage}%
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-1 sm:mb-2 gap-1 sm:gap-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {activity.activity}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full w-fit ${
                        isPositive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isPositive ? "↑" : "→"} {growth}%
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      {formatNumber(activity.revenue)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>{activity.orders} orders</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{activity.sales} units</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:space-x-4 sm:space-x-6 w-full sm:w-auto">
                <div className="hidden xs:block">
                  <Sparkline data={sparklineData} color="#000000" />
                </div>

                <div className="text-right min-w-20">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatNumber(Math.round(activity.avgOrderValue))}
                  </div>
                  <div className="text-xs text-gray-500">Avg. Order</div>
                </div>
              </div>
            </div>
          );
        })}

        {activityData.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">📊</span>
            </div>
            <p className="text-gray-900 font-medium text-sm sm:text-base mb-1">
              No activity data
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Performance metrics will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityProgressChart;
