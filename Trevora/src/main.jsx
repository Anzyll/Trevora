import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./contexts/CartProvider.jsx";
import WishlistProvider from "./contexts/WishlistProvider.jsx";
import { Toaster, toast } from "react-hot-toast";

toast.confirm = (message, { onConfirm, onCancel, confirmText = "OK", cancelText = "Cancel", ...options } = {}) => {
  return toast.custom(
    (t) => (
      <div
        className={`bg-black border border-[#333333] p-4 max-w-sm mx-auto transition-all duration-300 ${
          t.visible ? 'animate-in fade-in' : 'animate-out fade-out'
        }`}
        style={{
          background: '#000000',
          color: '#ffffff',
          border: '1px solid #333333',
          borderRadius: '0px',
          fontSize: '13px',
          fontWeight: '400',
          padding: '12px 16px',
          boxShadow: 'none',
          minWidth: '200px',
          fontFamily: 'inherit',
        }}
      >
        <p className="text-white text-sm mb-3" style={{ fontSize: '13px', fontWeight: '400', margin: 0, lineHeight: '1.4' }}>
          {message}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              onCancel?.();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-xs border border-[#333333] text-gray-300 hover:bg-[#111111] transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500"
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid #333333',
              borderRadius: '0px',
              fontSize: '11px',
              fontWeight: '400',
              padding: '6px 12px',
              minWidth: '60px',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-xs bg-white text-black hover:bg-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500"
            style={{
              background: '#ffffff',
              color: '#000000',
              border: '1px solid #ffffff',
              borderRadius: '0px',
              fontSize: '11px',
              fontWeight: '400',
              padding: '6px 12px',
              minWidth: '60px',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity, 
      ...options,
    }
  );
};


toast.dismissAll = () => {
  toast.dismiss();
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster
            position="top-right"
            gutter={8}
            containerStyle={{
              top: 80,
              right: 20,
            }}
            toastOptions={{
              duration: 2000,
              style: {
                background: '#000000',
                color: '#ffffff',
                borderRadius: '0px',
                fontSize: '13px',
                fontWeight: '400',
                padding: '12px 16px',
                border: '1px solid #333333',
                boxShadow: 'none',
                minWidth: '200px',
                fontFamily: 'inherit',
              },
              success: {
                duration: 1500,
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#000000',
                },
                style: {
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #333333',
                },
              },
              error: {
                duration: 3000,
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#000000',
                },
                style: {
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #333333',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#ffffff',
                  secondary: '#000000',
                },
                style: {
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #333333',
                },
              },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);