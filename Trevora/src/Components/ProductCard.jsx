import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistProvider";

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  const { title, price, image } = product;

  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group md:w-75">
        <div className="h-100 bg-gray-100 relative overflow-hidden">
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 ${
              isInWishlist(product.id)
                ? "text-black bg-red-50"
                : "text-gray-400 bg-white hover:text-black hover:bg-red-50"
            }`}
          >
            ♥
          </button>

          <img
            src={image}
            alt={title}
            className="w-full sm:h-fit md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-gray-900">{price}</span>
          </div>

          <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
            View Product
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
