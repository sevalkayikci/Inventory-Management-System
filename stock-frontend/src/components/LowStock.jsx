import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/LowStock.css';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function LowStock() {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/products/low-stock')
      .then(res => setLowStockProducts(res.data))
      .catch(err => console.error('Düşük stok verileri alınamadı', err));
  }, []);

  return (
    <div className="low-stock-container">
    <h2><FaExclamationTriangle /> Düşük Stokta Olan Ürünler</h2>
      {lowStockProducts.length === 0 ? (
        <p className="no-low-stock">Tüm ürünlerin stoku yeterli</p>
      ) : (
        <table className="low-stock-table">
          <thead>
            <tr>
              <th>Ürün Adı</th>
              <th>Birim</th>
              <th>Mevcut Miktar</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map(prod => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>{prod.unit || '-'}</td>
                <td className="low">{prod.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
