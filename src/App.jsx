import React from 'react'; // Вот это обязательно!
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import SupportWidget from './components/SupportWidget';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

const Success = () => (
  <div className="w-full px-4 py-16 text-center font-montserrat">
    <h1 className="font-lora text-[32px] font-bold text-neutral-900-alt mb-4">Заказ принят!</h1>
    <p className="text-neutral-500">Номер появится на этой странице в следующей задаче</p>
  </div>
);

function ProtectedProfile() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user === null) {
    return <Navigate to="/auth?next=/profile" replace />;
  }
  return <Profile />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Header />
            <main className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/profile" element={<ProtectedProfile />} />
                <Route path="/success" element={<Success />} />
              </Routes>
            </main>
            <SupportWidget />
            <Footer />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;