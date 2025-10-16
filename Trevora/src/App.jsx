import React from "react";
import Header from "./components/Header";
import Home from "./Pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/signup";
import Footer from "./Components/Footer";
import ProductPage from "./Pages/ProductPage";
import ProductDetails from "./Pages/ProductDetails";
import ScrollToTop from "./Components/ScrollToTop";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishList";
import Checkout from "./Pages/Checkout";
import Payment from "./Pages/Payment";
import OrderSuccess from "./Pages/OrderSuccess";
import OrderHistory from "./Pages/Orders";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProductManagement from "./admin/pages/ProductManagement";


const App = () => {
  const location =useLocation()
  const isAdmin=location.pathname.startsWith('/admin')
  return (
    <>
      <ScrollToTop />
     {!isAdmin &&< Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
         <Route path="/orders" element={<OrderHistory />} />
         <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/productmanagement" element={<ProductManagement />} />
      </Routes>
      {!isAdmin &&<Footer />}
    </>
  );
};

export default App;
