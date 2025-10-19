import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setOrders(
      user?.orders?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
    );
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const cancelledOrder = user.orders.find((order) => orderId === order.id);
      for (const item of cancelledOrder.items) {
        try {
          const response = await axios.get(
            `http://localhost:3001/products/${item.id}`
          );
          const latestProduct = response.data;
          await axios.patch(`http://localhost:3001/products/${item.id}`, {
            stock: latestProduct.stock + item.quantity,
          });
        } catch (error) {
          console.error("Failed to restore stock:", error);
        }
      }
      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      );
      const updatedUser = { ...user, orders: updatedOrders };
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        orders: updatedOrders,
      });
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setOrders(
        updatedOrders.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const canCancelOrder = (orderDate) => {
    const orderTime = new Date(orderDate);
    const currentTime = new Date();
    const timeDifference = currentTime - orderTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference <= 24;
  };

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No orders yet</h2>
          <Link
            to="/products"
            className="bg-black text-white px-6 py-2 rounded"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="border rounded p-4 mb-4">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">Order #{order.id.slice(-6)}</p>
            <div className="text-right">
              <p className="font-semibold">₹{order.total}</p>
              <p
                className={`text-sm ${
                  order.status === "confirmed"
                    ? "text-green-600"
                    : order.status === "cancelled"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            {new Date(order.date).toLocaleDateString()} •{" "}
            {new Date(order.date).toLocaleTimeString()}
          </p>

          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm mb-1">
              <span>
                {item.title} (×{item.quantity})
              </span>
              <span>{item.price}</span>
            </div>
          ))}
          <div className="border-t mt-3 pt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Paid Online"}
            </div>

            {order.status === "processing" && canCancelOrder(order.date) && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Cancel Order
              </button>
            )}

            {order.status === "cancelled" && (
              <span className="text-red-500 text-sm">Cancelled</span>
            )}

            {order.status === "confirmed" && !canCancelOrder(order.date) && (
              <span className="text-gray-500 text-sm">Cannot cancel</span>
            )}
          </div>
        </div>
      ))}

      <div className="text-center mt-8">
        <Link to="/products" className="bg-black text-white px-6 py-2 rounded">
          Shop More
        </Link>
      </div>
    </div>
  );
};

export default OrderHistory;
