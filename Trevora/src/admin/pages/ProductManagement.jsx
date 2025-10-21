import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFilter, setProductFilter] = useState("all");
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    activity: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://trevora-2.onrender.com/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        id: Date.now() + "",
        image: newProduct.image,
      };

      await axios.post("https://trevora-2.onrender.com/products", productData);
      setShowAddForm(false);
      setNewProduct({
        title: "",
        category: "",
        price: "",
        stock: "",
        image: "",
        activity: "",
      });
      fetchProducts();
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://trevora-2.onrender.com/products/${editingProduct.id}`, {
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
      });
      setEditingProduct(null);
      fetchProducts();
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

const handleDeleteProduct = (productId) => {
  toast.confirm("Are you sure you want to delete this product?", {
    onConfirm: async () => {
      try {
        await axios.delete(`https://trevora-2.onrender.com/products/${productId}`);
        fetchProducts();
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    },
    onCancel: () => {
      console.log("Deletion cancelled");
    }
  });
};

  const totalProducts = products.length;
  const lowStock = products.filter((product) => product.stock < 10).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const categories = [...new Set(products.map((product) => product.category))]
    .length;

  const filteredProducts = products.filter((product) => {
    const searchFilter =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const filteredProduct =
      productFilter == "all" || product.category === productFilter;
    return searchFilter && filteredProduct;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your product catalog and inventory
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
                {totalProducts}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Low Stock
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {lowStock}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Out of Stock
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
                {outOfStock}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Categories
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
                {categories}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
              />
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-2.5 sm:top-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full sm:w-48 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="Clothing">Clothing</option>
              <option value="Gear">Gear</option>
            </select>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium whitespace-nowrap flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base"
            >
              <span>+</span>
              Add New Product
            </button>
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-lg">📷</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? "bg-red-100 text-red-800"
                            : product.stock < 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No products in the system"}
              </p>
            </div>
          )}
        </div>

        <div className="lg:hidden space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-lg">📷</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {product.id}
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {product.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-600 text-xs">Price</div>
                  <div className="text-gray-900 font-semibold">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Stock</div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock === 0
                        ? "bg-red-100 text-red-800"
                        : product.stock < 10
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.stock} units
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">📦</div>
              <p className="text-gray-500">No products found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No products in the system"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl mx-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Product
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-4">
                {[
                  "title",
                  "category",
                  "price",
                  "stock",
                  "activity",
                  "image",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field === "image" ? "Image URL" : field}
                    </label>
                    <input
                      type={
                        field === "price" || field === "stock"
                          ? "number"
                          : "text"
                      }
                      required={field !== "activity" && field !== "image"}
                      value={newProduct[field]}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                      placeholder={`Enter product ${field}`}
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl mx-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Product
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditProduct} className="space-y-4">
                {["title", "category", "price", "stock"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field}
                    </label>
                    <input
                      type={
                        field === "price" || field === "stock"
                          ? "number"
                          : "text"
                      }
                      required
                      value={editingProduct[field]}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
