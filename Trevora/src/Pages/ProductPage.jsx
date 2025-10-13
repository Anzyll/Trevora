import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../Components/ProductCard";
import { useLocation,  } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("all");
  const location = useLocation();
  const [selectedActivity, setSelectedActivity] = useState("");
  const [search, setSearch] = useState("");
  

   
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const activity = urlParam.get("activity");
    setSelectedActivity(activity);
  }, [location.search]);

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const category = urlParam.get("category");
    if (category) {
      setCategory(category);
    }
  }, [location.search]);

  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const searchFromUrl = urlParam.get("search");
    if (searchFromUrl) {
      setSearch(searchFromUrl);
    }
    else{
      setSearch("")
    }
  }, [location.search]);
  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message, "failed to fetch");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter by category , sort by price and by search
  const filteredAndSortedProducts = products
    .filter((product) => {
      const categoryMatch =
        category === "all" ||
        product.category?.toLowerCase() === category.toLowerCase();
      const activityMatch =
        !selectedActivity || selectedActivity === product.activity;
      const searchMatch =
        !search || product.title.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && activityMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "lowtohigh") {
        return (
          parseInt(a.price.replace(/[^\d]/g, "")) -
          parseInt(b.price.replace(/[^\d]/g, ""))
        );
      }
      if (sortBy === "hightolow") {
        return (
          parseInt(b.price.replace(/[^\d]/g, "")) -
          parseInt(a.price.replace(/[^\d]/g, ""))
        );
      }
      return 0;
    });

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Adventure & Outdoor Essentials
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore the outdoors with our durable and versatile gear
          </p>
        </div>
        <div className="flex overflow-x-auto gap-3 mb-8 pb-4">
          {[
            { id: "all", name: "All" },
            { id: "clothing", name: "Clothing" },
            { id: "gear", name: "Gear" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-6 py-3 border rounded-full font-medium transition-colors whitespace-nowrap ${
                category === cat.id
                  ? "bg-black text-white border-black"
                  : "bg-white border-gray-200 text-gray-700 hover:border-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-700 font-semibold text-lg">
            {filteredAndSortedProducts.length} Items
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by</option>
            <option value="lowtohigh">Price: Low to High</option>
            <option value="hightolow">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
