import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import RegisterForm from './components/Register.jsx';
import LocationList from './components/LocationList.jsx';
import BarcodeScanner from './components/BarcodeScanner.jsx';
import ProductList from './components/ProductList.jsx';
import ProductAdd from './components/ProductAdd.jsx';
import StockControl from './components/StockControl.jsx';
import LowStock from './components/LowStock.jsx';
import Transfer from './components/Transfer.jsx';
import ProductHistory from './components/ProductHistory.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/locations" element={<LocationList />} />
        <Route path="/barcode" element={<BarcodeScanner />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-product" element={<ProductAdd />} />
        <Route path="/stock-control" element={<StockControl />} />
        <Route path="/low-stock" element={<LowStock />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/product-history" element={<ProductHistory />} />


      </Routes>
    </Router>
  );
}

export default App;
