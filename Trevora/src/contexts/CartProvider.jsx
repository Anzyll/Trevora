import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

 useEffect(() => {
  const handleChange = () => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      setCart(user.cart || []);
    } else {
      setCart([]);
    }
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener("logout", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("logout", handleChange);
  };
}, []);

 
  const updateCart = async (newCart) => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      alert("Please login to modify cart");
      return;
    }

    const user = JSON.parse(userData);
    
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        cart: newCart,
      });
      
      setCart(newCart);
      localStorage.setItem("currentUser", JSON.stringify({
        ...user,
        cart: newCart
      }));
      
    } catch (error) {
      console.error("Cart update failed:", error);
      alert("Failed to update cart");
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      const newCart = cart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      updateCart(newCart);
    } else {
      updateCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    updateCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      const newCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCart(newCart);
    }
  };

  const clearCart = () => {
    updateCart([]);
  };


  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    cartCount, 
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};