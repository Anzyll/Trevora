import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./contexts/CartProvider.jsx";
import WishlistProvider from "./contexts/WishlistProvider.jsx";
import { Toaster } from "react-hot-toast";

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
    top: 80, // Right below your black header
    right: 20,
  }}
  toastOptions={{
    duration: 2000,
    style: {
      background: '#000000',
      color: '#ffffff',
      borderRadius: '0px', // Sharp corners like your design
      fontSize: '13px',
      fontWeight: '400', // Normal weight like your product titles
      padding: '12px 16px',
      border: '1px solid #333333',
      boxShadow: 'none', // No shadow - clean like your site
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
