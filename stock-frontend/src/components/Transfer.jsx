import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Transfer.css';

export default function Transfer() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productQuery, setProductQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [locations, setLocations] = useState([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5001/api/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔍 Ürün aramasını filtrele
  useEffect(() => {
    if (productQuery.trim() === '') {
      setFilteredProducts([]);
    } else {
      const query = productQuery.toLowerCase();
      const results = products.filter(p => p.name.toLowerCase().includes(query));
      setFilteredProducts(results);
    }
  }, [productQuery, products]);

  const handleTransfer = async () => {
    if (!selectedProductId || !fromLocation || !toLocation || !quantity) {
      setMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/stock_transfer', {
        product_id: selectedProductId,
        from_location_id: fromLocation,
        to_location_id: toLocation,
        quantity: parseInt(quantity),
        movement_type: 'transfer'
      });
      setMessage("✅ Ürün başarıyla taşındı.");
      setProductQuery('');
      setSelectedProductId('');
      setFromLocation('');
      setToLocation('');
      setQuantity('');
      setFilteredProducts([]);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "🚨 Taşıma işlemi başarısız.");
    }
  };

  return (
    <div className="transfer-container">
      <h2 className="transfer-title">Depodan Depoya Ürün Transferi</h2>

      <div className="form-row">
        <label>Ürün Ara</label>
        <input
          type="text"
          value={productQuery}
          onChange={e => setProductQuery(e.target.value)}
          placeholder="Ürün adı girin"
        />
        {filteredProducts.length > 0 && (
          <ul className="product-suggestions">
            {filteredProducts.map(p => (
              <li
                key={p.id}
                onClick={() => {
                  setProductQuery(p.name);
                  setSelectedProductId(p.id);
                  setFilteredProducts([]);
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="form-row">
        <label>Kaynak Depo</label>
        <select value={fromLocation} onChange={e => setFromLocation(e.target.value)}>
          <option value="">Seçiniz</option>
          {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label>Hedef Depo</label>
        <select value={toLocation} onChange={e => setToLocation(e.target.value)}>
          <option value="">Seçiniz</option>
          {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label>Miktar</label>
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Adet gir"
          min={1}
        />
      </div>

      <div className="btn-row">
        <button className="save-btn" onClick={handleTransfer}>✔ Kaydet</button>
        <button className="cancel-btn" onClick={() => window.history.back()}>✖ İptal</button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
