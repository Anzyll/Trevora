import React from "react";
import axios from "axios";
import  { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
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
  const userData = (localStorage.getItem("currentUser") ||localStorage.getItem("adminUser"));
  if (userData) {
    try {
      const user = JSON.parse(userData);
      setCart(user.cart || []);
    } catch (error) {
      console.error("Error parsing cart data:", error);
      setCart([]);
    }
  } else {
    setCart([]);
  }
};
    handleChange()
    window.addEventListener("storage", handleChange);
    window.addEventListener("logout", handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("logout", handleChange);
    };
  }, []);

  const updateCart = async (newCart) => {
    const userData = (localStorage.getItem("currentUser")||localStorage.getItem("adminUser"));
    if (!userData) {
      return;
    }
    const user = JSON.parse(userData);
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        cart: newCart,
      });
      setCart(newCart);
      localStorage.setItem(
        "currentUser"||"adminUser",
        JSON.stringify({
          ...user,
          cart: newCart,
        })
      );
    } catch (error) {
      console.error("Cart update failed:", error);
      toast.error('Failed to add product to cart');
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateCart(newCart);
    } else {
      updateCart([...cart, { ...product, quantity: 1 }]);

    }
      if (localStorage.getItem("currentUser")||localStorage.getItem("adminUser")) {
      toast.success('Product added to cart!');
    }
  };

  const removeFromCart = (productId) => {
    updateCart(cart.filter((item) => item.id !== productId));
    toast.success('Product Removed from cart!');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      const newCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      updateCart(newCart);
    }
  };

  const clearCart = () => {
    updateCart([]);
  };

  const cartCount = cart.reduce((total,item)=>total+item.quantity,0)

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>}