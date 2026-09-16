import React from 'react'; // Вот это обязательно!
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import SupportWidget from './components/SupportWidget';
import Product from './pages/Product';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </main>
      <SupportWidget />
      <Footer />
    </BrowserRouter>
  );
}
export default App;