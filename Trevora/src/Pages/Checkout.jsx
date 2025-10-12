import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Checkout = () => {
  const [address, setAddress] = useState("");
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      setAddress(user.shippingAddress || "");
    } else {
      setAddress("");
    }
  }, []);
  const total =
    cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + price * item.quantity;
    }, 0) + 500;

  const handleCheckout = () => {
    if (!address.trim()) {
      toast("Please enter shipping address");
      return;
    }
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      const updatedUser = { ...user, shippingAddress: address };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
    navigate("/payment", { state: { total, cart, address } });
  };

  return (
    <div className="min-h-screen bg-white max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Order Items</h2>
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
        <textarea
          value={address}
          name="address"
          className="w-90 h-40 border-2 p-3 border-black focus:outline-black "
          placeholder="Enter your complete shipping address..."
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items ({cart.length})</span>
            <span>₹{(total - 500).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹500.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-black text-white py-3 rounded mt-6 hover:bg-gray-800"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
