import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
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
      const userData = localStorage.getItem("currentUser");
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
    handleChange();
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
      return;
    }
    const user = JSON.parse(userData);
    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, {
        cart: newCart,
      });
      setCart(newCart);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...user,
          cart: newCart,
        })
      );
    } catch (error) {
      console.error("Cart update failed:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const addToCart = async (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    try {
      const response = await axios.get(`http://localhost:3001/products/${product.id}`)
      const latestProduct=response.data
      if (latestProduct.stock < 1) {
      toast.error('Product is out of stock');
      return;
    }
    await axios.patch(`http://localhost:3001/products/${product.id}`, {
      stock: latestProduct.stock - 1,
    });

      if (existingItem) {
        const newCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        updateCart(newCart);
      } else {
        updateCart([...cart, { ...product, quantity: 1 }]);
      }

      if (localStorage.getItem("currentUser")) {
        toast.success("Product added to cart!");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const removeFromCart = async (productId) => {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      try {
        const response=await axios.get(`http://localhost:3001/products/${productId}`)
        const latestProduct=response.data
        if(latestProduct){
        await axios.patch(`http://localhost:3001/products/${productId}`, {
          stock: latestProduct.stock + item.quantity,
        });}
      } catch (error) {
        console.error("Failed to update stock:", error);
      }

      updateCart(cart.filter((item) => item.id !== productId));
      toast.success("Product Removed from cart!");
    }
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

  const clearCart = async() => {
      try{
        for(const item of cart){
      const response =await axios.get(`http://localhost:3001/products/${item.id}`);
      const latestProduct=response.data
      if(latestProduct){
      await axios.patch(`http://localhost:3001/products/${item.id}`, {
          stock: latestProduct.stock + item.quantity
        })}
      }
      updateCart([]);
    toast.success("Cart cleared!");}
    catch(error){ 
       console.error("failed to clear cart", error)
      };
    
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
