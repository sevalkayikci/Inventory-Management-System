import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ProductList.css';
import { FaBell } from 'react-icons/fa';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [threshold, setThreshold] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const fetchProducts = () => {
    axios.get('http://localhost:5001/api/products/with-stock')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Ürünler alınamadı', err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenPopup = (product) => {
    setSelectedProduct(product);
    setThreshold('');
    setShowPopup(true);
  };

  const handleSaveThreshold = async () => {
    try {
      await axios.put(`http://localhost:5001/api/products/${selectedProduct.id}`, {
        min_threshold: Number(threshold)
      });
      setShowPopup(false);
      fetchProducts(); // yenile
    } catch (err) {
      console.error('Eşik güncellenemedi', err);
    }
  };

  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <h2>Ürün Listesi</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Ürün ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredProducts.length === 0 ? (
        <p className="no-products">Hiç ürün yok.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Adı</th>
              <th>Birim</th>
              <th>Toplam Miktar</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => (
              <tr key={prod.id}>
                <td>{prod.name}</td>
                <td>{prod.unit || '-'}</td>
                <td>{prod.quantity}</td>
                <td>
                  <button className="bell-btn" onClick={() => handleOpenPopup(prod)}>
                    <FaBell />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{selectedProduct.name} için eşik belirle</h3>
            <input
              type="number"
              placeholder="Örn: 10"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleSaveThreshold}>Kaydet</button>
              <button onClick={() => setShowPopup(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
