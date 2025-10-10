import React from 'react';

const WishlistPage = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999.00,
      image: "📱",
      description: "Titanium design with Pro camera system"
    },
    {
      id: 2,
      name: "Apple Watch Series 9",
      price: 399.00,
      image: "⌚",
      description: "Smarter, brighter, mightier"
    }
  ];

  const totalItems = wishlistItems.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
          <p className="text-gray-600">Total items: {totalItems}</p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

       

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-black hover:bg-black text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        Add to Cart
                      </button>
                      <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (uncomment to see) */}
        {/* 
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600">Start adding items you love!</p>
        </div>
        */}
      </div>
    </div>
  );
};

export default WishlistPage;