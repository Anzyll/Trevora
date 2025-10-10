import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isWishlisted,setIsWishlisted]=useState(false)
  const toggleWishlist=(e)=>{
    e.stopPropagation()
   e.preventDefault()
    const wishlist =setIsWishlisted(!isWishlisted)
  }
  // Destructure the product data
  const { title, price, image, } = product;
  return (
    <Link
    to={`/products/${product.id}`}
    >
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group  md:w-75">
      <div className="h-100  bg-gray-100 relative overflow-hidden ">
              <button
        onClick={toggleWishlist}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
      >
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            isWishlisted ? "text-black fill-current" : "text-gray-400"
          }`}
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
        <img
          src={image}
          alt={title}
          className="w-full sm:h-fit md:h-full object-cover transition-transform duration-300 group-hover:scale-105  "
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
