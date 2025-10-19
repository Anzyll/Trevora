import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistProvider";
import { useCart } from "../contexts/CartProvider";

const ProductCard = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product);
    }
  };
  const { title, price, image, stock } = product;

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
            className="w-full sm-h-fit md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-gray-900">{price}</span>

            {stock == 0 ? (
              <span className="text-sm  text-red-600">Out of Stock</span>
            ) : stock <= 10 ? (
              <span className="text-sm  text-red-600">
                {" "}
                {stock} stocks left{" "}
              </span>
            ) : (
              <span className="text-sm  text-green-700">In Stock </span>
            )}
          </div>
          <div className="flex justify-between gap-5">
            <button
              className="w-80 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              onClick={handleAddToBag}
              disabled={stock === 0}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
