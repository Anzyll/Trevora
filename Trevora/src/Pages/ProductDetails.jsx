import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartProvider";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate()
  const {addToCart}=useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/products/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("product not found");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart=()=>{
    addToCart(product)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full mx-auto mb-4">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            
            <nav className="flex text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link
                to="/products"
                className="text-gray-500 hover:text-gray-700"
              >
                Products
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{product.category}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="mb-4">
              <h1 className="text-2xl font-light text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center space-x-4 mb-4"></div>
              <p className="text-2xl font-normal text-gray-900">
                {product.price}
              </p>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <button className="w-full bg-black text-white py-4 px-6 text-base font-medium hover:bg-gray-800 transition-colors mb-4"
              onClick={handleAddToCart}>
                Add to Bag
              </button>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Shipping & Exchanges
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
