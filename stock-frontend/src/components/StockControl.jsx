import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StockControl.css';

import {
  FaArrowDown,
  FaArrowUp,
  FaMapMarkerAlt,
  FaSearch,
  FaHashtag,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

export default function StockControl() {
  const [refreshKey, setRefreshKey] = useState(0);

  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [movementType, setMovementType] = useState('in');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5001/api/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, [refreshKey]);

  const handleSave = async () => {
    if (!selectedProduct || !selectedLocation || !quantity) return alert("Lütfen tüm alanları doldurun");

    try {
      await axios.post('http://localhost:5001/api/stock_movements', {
        product_id: selectedProduct.id,
        location_id: selectedLocation,
        quantity: parseInt(quantity),
        movement_type: movementType
      });

      alert(`✅ İşlem başarılı: ${movementType === 'in' ? 'Stoğa eklendi' : 'Stoktan düşüldü'}!`);
      setSelectedProduct(null);
      setSelectedLocation('');
      setQuantity('');
      setSearchTerm('');
      setRefreshKey(prev => prev + 1);

    } catch (err) {
      console.error(err);
      alert("❌ Bir hata oluştu.");
    }
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 4);

  return (
    <div className="stock-container">
      <div className="stock-header">
        <button
          className={movementType === 'in' ? 'active' : ''}
          onClick={() => setMovementType('in')}
        >
          <FaArrowUp /> Stoğa Ekle
        </button>
        <button
          className={movementType === 'out' ? 'active' : ''}
          onClick={() => setMovementType('out')}
        >
          <FaArrowDown /> Stoktan Düş
        </button>
      </div>

      <div className="form-row">
        <label><FaMapMarkerAlt /> Depo Seç</label>
        <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
          <option value="">Depo seç</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label><FaSearch /> Ürün Ara</label>
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <div className="product-list">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <div
                  key={p.id}
                  className={`product-item ${selectedProduct?.id === p.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProduct(p)}
                >
                  {p.name}
                </div>
              ))
            ) : (
              <div className="product-item">Ürün bulunamadı</div>
            )}
          </div>
        )}
      </div>

      <div className="form-row">
        <label><FaHashtag /> Miktar</label>
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Adet gir"
        />
      </div>

      <div className="btn-row">
        <button className="save-btn" onClick={handleSave}>
          <FaCheck /> Kaydet
        </button>
        <button className="cancel-btn" onClick={() => {
          setSelectedProduct(null);
          setSelectedLocation('');
          setQuantity('');
          setSearchTerm('');
        }}>
          <FaTimes /> İptal
        </button>
      </div>
    </div>
  );
}
