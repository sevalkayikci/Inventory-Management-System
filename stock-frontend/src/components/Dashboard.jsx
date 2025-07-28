import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

import {
  FaBarcode,
  FaExchangeAlt,
  FaPlus,
  FaBoxOpen,
  FaWarehouse,
  FaUserPlus,
  FaExclamationTriangle
} from 'react-icons/fa';

export default function Dashboard() {
  const navigate = useNavigate();
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5001/api/products/low-stock')
      .then(res => setLowStockCount(res.data.length))
      .catch(err => console.error('Düşük stok sayısı alınamadı', err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Stok Kontrol Paneli</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/low-stock')}>
          <FaExclamationTriangle /> Düşük Stoklar
          {lowStockCount > 0 && (
            <span className="badge">{lowStockCount}</span>
          )}
        </button>
        <button onClick={() => navigate('/barcode')}><FaBarcode /> Barkod Oku</button>
        <button onClick={() => navigate('/stock-control')}><FaExchangeAlt /> Stok Kontrol</button>
        <button onClick={() => navigate('/add-product')}><FaPlus /> Ürün Ekle</button>
        <button onClick={() => navigate('/products')}><FaBoxOpen /> Ürünleri Listele</button>
        <button onClick={() => navigate('/locations')}><FaWarehouse /> Depoları Listele</button>
        <button onClick={() => navigate('/register')}><FaUserPlus /> Kullanıcı Ekle</button>
      </div>
    </div>
  );
}
