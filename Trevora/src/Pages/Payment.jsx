import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartProvider";
import toast from "react-hot-toast";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const { total, address } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [upiId, setUpiId] = useState("");

  const handlePayment = async () => {
    if (!total || !cart || cart.length === 0) {
      toast.error("Invalid order details");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !cardDetails.number ||
        !cardDetails.expiry ||
        !cardDetails.cvv ||
        !cardDetails.name
      ) {
        toast.error("Please fill all card details");
        return;
      }
    }

    if (paymentMethod === "upi" && !upiId.includes("@")) {
      toast.error("Please enter valid UPI ID");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user || !user.id) {
        throw new Error("User not found");
      }

      const order = {
        id: Date.now().toString(),
        items: [...cart],
        total: total,
        address: address,
        paymentMethod: paymentMethod,
        date: new Date().toISOString(),
        status: "confirmed",
      };

      const userResponse = await axios.get(
        `http://localhost:3001/users/${user.id}`
      );
      const currentUser = userResponse.data;
      const updatedUser = {
        ...currentUser,
        orders: [...(currentUser.orders || []), order],
      };
      await axios.patch(`http://localhost:3001/users/${user.id}`, updatedUser);
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
      console.error("Payment error:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleCardInput = (field, value) => {
    let formattedValue = value;
    if (field === "number") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (formattedValue.length > 19)
        formattedValue = formattedValue.slice(0, 19);
    }
    if (field === "expiry") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5)
        formattedValue = formattedValue.slice(0, 5);
    }
    if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }
    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
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
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit/Debit Card
          </label>

          <label className="flex items-center p-4 border rounded cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="upi"
              className="mr-3"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI Payment
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

      {paymentMethod === "card" && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Card Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border p-3 rounded focus:outline-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => handleCardInput("number", e.target.value)}
                className="w-full border p-3 rounded focus:outline-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInput("expiry", e.target.value)}
                  className="w-full border p-3 rounded focus:outline-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInput("cvv", e.target.value)}
                  className="w-full border p-3 rounded focus:outline-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">UPI Details</h3>
          <div>
            <label className="block text-sm font-medium mb-2">UPI ID</label>
            <input
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full border p-3 rounded focus:outline-black"
            />
          </div>
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
        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 text-lg font-medium"
      >
        {paymentMethod === "cod" ? "Place Order" : `Pay ₹${total?.toFixed(2)}`}
      </button>
    </div>
  );
};

export default Payment;
