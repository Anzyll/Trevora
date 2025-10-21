import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
        try {
          const user = JSON.parse(userData);
          setWishlist(user.wishlist || []);
        } catch (error) {
          console.error("Error parsing wishlist data:", error);
          setWishlist([]);
        }
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
    const userData = localStorage.getItem("currentUser");
    if (!userData) return;

    try {
      const user = JSON.parse(userData);
      if (!user.id) return;

      setWishlist(newWishlist);
      const updatedUser = { ...user, wishlist: newWishlist };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      axios.patch(`https://trevora-2.onrender.com/users/${user.id}`, {
        wishlist: newWishlist,
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const addToWishlist = (product) => {
    if (!wishlist.find((item) => item.id == product.id)) {
      updateWishlist([...wishlist, product]);
      toast.success("Added to wishlist");
    }
  };

  const removeFromWishlist = (productId) => {
    updateWishlist(wishlist.filter((item) => productId !== item.id));
    toast.success("Removed From wishlist");
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => productId === item.id);
  };

  const value = {
    wishlist,
    updateWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount: wishlist.length,
  };
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
