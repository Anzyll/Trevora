import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter } from 'react-router-dom'
import { CartProvider } from './contexts/CartProvider.jsx'
import WishlistProvider from './contexts/WishlistProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <CartProvider>
      <WishlistProvider>
    <App />
    </WishlistProvider>
     </CartProvider>
    </BrowserRouter>
  </StrictMode>
)
