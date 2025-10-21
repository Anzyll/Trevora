import React from "react";
import  { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import StatsCards from "./StatCards";
import OrderStatusChart from "./OrderStatusChart";
import TopProductsChart from "./TopProductsChart";
import ActivityProgressChart from "./ActivityChart";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, productRes] = await Promise.all([
          axios.get("https://trevora-2.onrender.com/users"),
          axios.get("https://trevora-2.onrender.com/products"),
        ]);
        setUsers(userRes.data);
        setProducts(productRes.data);
        setLoading(false);
      } catch (error) {
        console.error("error", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const allOrders = users.flatMap((user) => user.orders || []);
  const totalRevenue = allOrders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalOrders = allOrders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl border border-gray-800 p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-300 text-lg">
              Welcome to your admin dashboard
            </p>
          </div>
        </div>

        <div className="mb-8">
          <StatsCards
            totalRevenue={totalRevenue}
            totalUsers={totalUsers}
            totalProducts={totalProducts}
            totalOrders={totalOrders}
          />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    Sales Activity
                  </h3>
                </div>
                <ActivityProgressChart orders={allOrders} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  Order Status
                </h3>
              </div>
              <OrderStatusChart orders={allOrders} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  Top Performing Products
                </h3>
                <p className="text-gray-500 mt-1">Based on sales performance</p>
              </div>
            </div>
            <TopProductsChart orders={allOrders} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">System Status</p>
              <p className="text-gray-500 text-sm">All systems operational</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
