import React from "react";
import axios from "axios";
import  { useEffect, useState } from "react";
import { useParams, Link,  } from "react-router-dom";
import { useCart } from "../contexts/CartProvider";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const {addToCart}=useCart()

  
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://trevora-2.onrender.com/products/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("product not found");
        setLoading(false);
      }
    };
    useEffect(()=>{
     fetchProduct();
    },[id])
    

  const handleAddToCart=async()=>{
    if(product.stock>0){
     await addToCart(product)
    }
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
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
              <div className="text-2xl font-normal text-gray-900 flex justify-between items-center">
                {product.price} 
                                {product.stock == 0 ? (
              <span className="text-sm  text-red-600">Out of Stock</span>
            ) : product.stock <= 10 ? (
              <span className="text-sm  text-red-600">
                {" "}
                {product.stock} stocks left{" "}
              </span>
            ) : (
              <span className="text-sm  text-green-700">In Stock </span>
            )}
              </div>
              
        
          
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
