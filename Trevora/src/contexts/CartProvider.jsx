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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      setCart(user.cart || []);
    } else {
      setCart([]); // Clear cart when no user
    }
  }, []); // Remove dependency array - runs on every render

  useEffect(() => {
  const handleStorageChange = () => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      setCart(user.cart || []);
    } else {
      setCart([]);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('logout', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('logout', handleStorageChange);
  };
}, []);

  useEffect(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cart]);

  const addToCart = async (product) => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      alert("Please login to add items to cart");
      return;
    }
    const user = JSON.parse(userData);
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(
      (item) => item.id === product.id
    );
    if (existingItemIndex > -1) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({
        ...product,
        quantity: 1,
      });
    }
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        cart: updatedCart,
      });
      setCart(updatedCart);

      const updatedUser = { ...user, cart: updatedCart };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const removeFromCart = async (productId) => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      return;
    }
    const user = JSON.parse(userData);
    const updatedCart = cart.filter((item) => item.id !== productId);
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        cart: updatedCart,
      });
      setCart(updatedCart);

      const updatedUser = { ...user, cart: updatedCart };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("error removing cart:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    const userData = localStorage.getItem("currentUser");
    if (!userData) return;
    const user = JSON.parse(userData);
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        cart: updatedCart,
      });
      setCart(updatedCart);

      const updatedUser = { ...user, cart: updatedCart };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("error updating quantity", err);
    }
  };

  const clearCart = async () => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) return;

    const user = JSON.parse(userData);
    const updatedCart = [];

    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        cart: updatedCart,
      });
      setCart(updatedCart);

      const updatedUser = { ...user, cart: updatedCart };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error clearing cart", err);
    }
  };

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
