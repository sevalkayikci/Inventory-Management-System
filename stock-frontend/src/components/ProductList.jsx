import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    axios.get('http://localhost:5001/api/products/with-stock')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Ürünler alınamadı', err));
  };

  useEffect(() => {
    fetchProducts(); // ✅ Sayfa her açıldığında çalışır
  }, []);

  return (
    <div className="product-list-container">
      <h2>Ürün Listesi</h2>
      {products.length === 0 ? (
        <p className="no-products">Hiç ürün yok.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Adı</th>
              <th>Birim</th>
              <th>Toplam Miktar</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>{prod.unit || '-'}</td>
                <td>{prod.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
