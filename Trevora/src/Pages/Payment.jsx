import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartProvider";
import toast from "react-hot-toast";
import axios from "axios";
import {
  loadRazorpayScript,
  initializeRazorpayPayment,
} from "../utils/Razorpay";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const { total, address } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRazorpayPayment = async () => {
    if (!total || !cart || cart.length === 0) {
      toast.error("Invalid order details");
      return;
    }
    setIsProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user || !user.id) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      initializeRazorpayPayment(
        total,
        user,
        cart,
        address,
        async (paymentResponse) => {
          try {
            await createOrderInJSON(paymentResponse, user);
            toast.success("Payment successful! Order placed.");
            navigate("/order-success", {
              state: {
                orderId: paymentResponse.razorpay_payment_id,
                address: address,
                paymentId: paymentResponse.razorpay_payment_id,
              },
            });
          } catch (error) {
            console.error("Order creation failed:", error);
            toast.error(
              "Payment successful but order creation failed. Please contact support."
            );
          }
        },
        (error) => {
          console.error("Payment error:", error);
          toast.error(error || "Payment failed. Please try again.");
        }
      );
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const createOrderInJSON = async (paymentResponse, user) => {
    try {
      for (const item of cart) {
        try {
          const response = await axios.get(
            `https://trevora-2.onrender.com/products/${item.id}`
          );
          const latestProduct = response.data;
          const newStock = latestProduct.stock - item.quantity;
          await axios.patch(
            `https://trevora-2.onrender.com/products/${item.id}`,
            {
              stock: newStock,
            }
          );
        } catch (error) {
          console.error(
            `Failed to update stock for product ${item.id}:`,
            error
          );
        }
      }

      const order = {
        id: paymentResponse.razorpay_payment_id,
        items: [...cart],
        total: total,
        address: address,
        paymentMethod: "razorpay",
        date: new Date().toISOString(),
        status: "Processing",
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
      };

      const userResponse = await axios.get(
        `https://trevora-2.onrender.com/users/${user.id}`
      );
      const currentUser = userResponse.data;
      const updatedUser = {
        ...currentUser,
        orders: [...(currentUser.orders || []), order],
      };
      await axios.patch(
        `https://trevora-2.onrender.com/users/${user.id}`,
        updatedUser
      );
      const updatedLocalUser = {
        ...user,
        orders: updatedUser.orders,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedLocalUser));

      clearCart();
    } catch (error) {
      console.error("Order creation error", error);
      throw error;
    }
  };

  const handleCODPayment = async () => {
    if (!address.trim()) {
      toast.error("Please enter shipping address");
      return;
    }
    setIsProcessing(true);

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));

      for (const item of cart) {
        try {
          const response = await axios.get(
            `https://trevora-2.onrender.com/products/${item.id}`
          );
          const latestProduct = response.data;
          const newStock = latestProduct.stock - item.quantity;
          await axios.patch(
            `https://trevora-2.onrender.com/products/${item.id}`,
            {
              stock: newStock,
            }
          );
        } catch (error) {
          console.error(`Failed to update stock:`, error);
        }
      }

      const order = {
        id: `cod_${Date.now()}`,
        items: [...cart],
        total: total,
        address: address,
        paymentMethod: "cod",
        date: new Date().toISOString(),
        status: "Processing",
      };

      const userResponse = await axios.get(
        `https://trevora-2.onrender.com/users/${user.id}`
      );
      const currentUser = userResponse.data;
      const updatedUser = {
        ...currentUser,
        orders: [...(currentUser.orders || []), order],
      };
      await axios.patch(
        `https://trevora-2.onrender.com/users/${user.id}`,
        updatedUser
      );

      const updatedLocalUser = {
        ...user,
        orders: updatedUser.orders,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedLocalUser));

      clearCart();
      toast.success("Order placed successfully!");

      navigate("/order-success", {
        state: {
          orderId: order.id,
          address: address,
        },
      });
    } catch (error) {
      console.error("COD order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentMethod === "cod") {
      handleCODPayment();
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
        <div className="border rounded p-4">
          {cart?.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Shipping To</h2>
        <div className="border rounded p-4 bg-gray-50">
          <p className="whitespace-pre-line">{address}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
        <div className="space-y-2">
          <label className="flex items-center p-4 border rounded cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              className="mr-3"
              checked={paymentMethod === "razorpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            RazorPay
          </label>

          <label className="flex items-center p-4 border rounded cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cod"
              className="mr-3"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      {paymentMethod === "razorpay" && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Secure Payment</h3>
          <p className="text-sm text-gray-600">
            You will be redirected to Razorpay's secure payment gateway.
          </p>
        </div>
      )}

      {paymentMethod === "cod" && (
        <div className="mb-6 border rounded p-4 bg-yellow-50">
          <h3 className="text-lg font-semibold mb-2">Cash on Delivery</h3>
          <p className="text-sm text-gray-600">Pay when your order arrives.</p>
        </div>
      )}

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Amount</span>
          <span className="text-2xl font-bold">₹{total?.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full ${
          isProcessing ? "bg-gray-400" : "bg-black hover:bg-gray-800"
        } text-white py-3 rounded text-lg font-medium transition-colors`}
      >
        {isProcessing
          ? "Processing..."
          : paymentMethod === "cod"
          ? "Place Order"
          : `Pay Securely ₹${total?.toFixed(2)}`}
      </button>
      {paymentMethod === "razorpay" && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Secure payment powered by Razorpay
        </p>
      )}
    </div>
  );
};

export default Payment;
