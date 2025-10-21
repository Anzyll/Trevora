import React from "react";
import { useLocation, Link } from "react-router-dom";
const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, address, paymentId } = location.state || {};

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Processing!
          </h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">#{orderId?.slice(-8)}</span>
            </div>

            {paymentId && paymentId.startsWith("pay_") && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID</span>
                <span className="font-medium">#{paymentId?.slice(-8)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Order Date</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-green-600">Processing</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">
                {paymentId && paymentId.startsWith("pay_")
                  ? "Razorpay"
                  : "Cash on Delivery"}
              </span>
            </div>
          </div>
        </div>
        <div className="border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
          <div className="bg-gray-50 border rounded p-4">
            <p className="whitespace-pre-line text-gray-700">{address}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/orders"
            className="block w-full bg-black text-white text-center py-3 px-6 rounded hover:bg-gray-800 text-lg font-medium"
          >
            Order History
          </Link>

          <Link
            to="/"
            className="block w-full border border-black text-black text-center py-3 px-6 rounded hover:bg-gray-100 text-lg font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
