import React from 'react'; // Вот это обязательно!
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import SupportWidget from './components/SupportWidget';
import Product from './pages/Product';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <SupportWidget />
          <Footer />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
export default App;