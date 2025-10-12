import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));

      if (user && user.orders) {
        const sortedOrders = user.orders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders.</p>
          <Link
            to="/products"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg">Order #{order.id}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(order.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  ₹{order.total?.toLocaleString("en-IN")}
                </p>
                <p
                  className={`text-sm ${
                    order.status === "confirmed"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Items:</h3>
              <div className="space-y-2">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <span className="font-medium">{item.title}</span>
                        <span className="text-gray-500 ml-2">
                          × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-medium">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Shipping Address</p>
                  <p className="font-medium mt-1 whitespace-pre-line">
                    {order.address}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Payment Method</p>
                  <p className="font-medium mt-1">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod?.charAt(0).toUpperCase() +
                        order.paymentMethod?.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/products"
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderHistory;
