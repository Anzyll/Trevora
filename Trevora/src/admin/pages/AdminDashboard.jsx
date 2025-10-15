import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import StatsCards from "./StatCards";
import OrderStatusChart from "./OrderStatusChart";
import TopProductsChart from "./TopProductsChart";
import ActivityProgressChart from "./ActivityChart";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, productRes] = await Promise.all([
          axios.get("http://localhost:3001/users"),
          axios.get("http://localhost:3001/products")
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const allOrders = users.flatMap(user=>user.orders || [])
  const totalRevenue=allOrders
 
  .filter(order=>order.status==="delivered")
  .reduce((sum,order)=>sum+order.total,0)
  const totalUsers = users.length;
  const totalProducts=products.length;
  const totalOrders=allOrders.length


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="p-4 lg:p-6">
        <div className="space-y-6">
          <StatsCards
            totalRevenue={totalRevenue}
            totalUsers={totalUsers}
            totalProducts={totalProducts}
            totalOrders={totalOrders}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-2">
              <ActivityProgressChart orders={allOrders} />
            </div>
            <div>
              <OrderStatusChart orders={allOrders} />
            </div>
            <div className="xl:col-span-3">
              <TopProductsChart orders={allOrders} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
