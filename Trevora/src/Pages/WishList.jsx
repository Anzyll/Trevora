import React from "react";
import { useWishlist } from "../contexts/WishlistProvider";
import { useCart } from "../contexts/CartProvider";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Wishlist
          </h1>
          <p className="text-gray-600">Total items: {wishlistCount}</p>
        </div>

        <div className="space-y-4">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    {item.price}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
