import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://trevora-2.onrender.com/users");
      setOrders(
        response.data.flatMap((user) =>
          (user.orders || []).map((order) => ({
            ...order,
            customerName: user.fullName,
            customerEmail: user.email,
          }))
        )
      );
      setLoading(false);
    } catch (error) {
      console.error("error while fetching orders", error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const usersResponse = await axios.get("https://trevora-2.onrender.com/users");
      const users = usersResponse.data;

      for (const user of users) {
        const orderIndex = user.orders?.findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex >= 0) {
          const updatedOrders = [...user.orders];
          updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            status: newStatus,
          };

          await axios.patch(`https://trevora-2.onrender.com/users/${user.id}`, {
            orders: updatedOrders,
          });
          break;
        }
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const statusCounts = {
    cancelled: orders.filter((order) => order.status === "cancelled").length,
    Processing: orders.filter((order) => order.status === "Processing").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
  };

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    return searchMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Order Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage customer orders
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          {[
            { key: "cancelled", label: "Cancelled" },
            { key: "Processing", label: "Processing" },
            { key: "shipped", label: "Shipped" },
            { key: "delivered", label: "Delivered" },
          ].map((status) => (
            <div
              key={status.key}
              className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {status.label}
                  </p>
                  <p className={`text-lg sm:text-xl lg:text-2xl font-bold`}>
                    {statusCounts[status.key]}
                  </p>
                </div>
                <span className="text-lg sm:text-xl">{status.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="cancelled">Cancelled</option>
              <option value="Processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-b-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id.slice(-4)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items?.length} items
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ₹{order.total?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {order.status === "Processing" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "shipped")
                              }
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Mark Shipped"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                          {order.status === "shipped" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "delivered")
                              }
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Mark Delivered"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          )}
                          {order.status === "Processing" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "cancelled")
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Cancel Order"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="hidden md:block lg:hidden">
            <div className="p-4 space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Order ID</div>
                      <div className="font-medium">#{order.id.slice(-4)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.items?.length} items
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Customer</div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {order.customerEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Amount</div>
                      <div className="font-semibold">
                        ₹{order.total?.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      {order.status === "Processing" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "delivered")
                          }
                          className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status === "Processing" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "cancelled")
                          }
                          className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      #{order.id.slice(-4)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {order.customerEmail}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <div className="text-gray-600 text-xs">Amount</div>
                    <div className="font-semibold text-gray-900">
                      ₹{order.total?.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Items</div>
                    <div className="text-gray-900">
                      {order.items?.length} items
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                  <div className="flex gap-1">
                    {order.status === "Processing" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Ship
                      </button>
                    )}
                    {order.status === "shipped" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        Deliver
                      </button>
                    )}
                    {order.status === "Processing" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-3">📦</div>
              <p className="text-gray-500 text-lg font-medium">
                No orders found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "No orders available"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            Showing {filteredOrders.length} of {orders.length} orders
            {(searchTerm || statusFilter !== "all") && " (filtered)"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
