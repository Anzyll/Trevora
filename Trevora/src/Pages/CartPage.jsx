import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartProvider";
import { useNavigate } from "react-router-dom";


const CartPage = () => {
  const {cart,removeFromCart,updateQuantity,clearCart,cartCount}=useCart()
  const navigate=useNavigate()
  const [user, setUser] = useState(null);

  useEffect(()=>{
const userData = localStorage.getItem("currentUser")
if(userData){
  setUser(JSON.parse(userData))
}
},[])

const subtotal=cart.reduce((total,item)=>{
  const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
 return total+(price*item.quantity)

},0)
 const total=subtotal;

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to view your cart</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Bag ({cartCount})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
          
            <div className="flex justify-between mb-8">
              <button
                onClick={clearCart}
                className="text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 px-4 py-2 rounded hover:bg-red-50 transition-colors"
              >
                Clear Cart
              </button>
             
            </div>

           
            <div className="space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">

                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <span className="text-lg font-medium text-gray-900">
                            {item.price}
                          </span>
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors "
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-l border-r border-gray-30">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-red-600 hover:text-red-800 border border-red-300 px-4 py-2 rounded hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="max-w-md mx-auto space-y-4 text-center">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                   Subtotal ({cartCount} items)
                  </span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <button
                  onClick={()=>navigate("/checkout")}
                  className="w-full bg-black text-white py-4 px-6 text-base font-medium hover:bg-gray-800 transition-colors mt-6"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
