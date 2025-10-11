import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios"; // ✅ Add this import

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const handleChange = () => {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const user = JSON.parse(userData);
        setWishlist(user.wishlist || []);
      } else {
        setWishlist([]);
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

  const updateWishlist = async (newWishlist) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "[]");
    if (!user.id) {
      alert("Please login first");
      return;
    }

    setWishlist(newWishlist);
    const updatedUser = { ...user, wishlist: newWishlist };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    axios.patch(`http://localhost:3001/users/${user.id}`, {
      wishlist: newWishlist,
    });
  };

  const addToWishlist = (product) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      updateWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    updateWishlist(wishlist.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const value = {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    wishlistCount: wishlist.length, 
  };


  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
