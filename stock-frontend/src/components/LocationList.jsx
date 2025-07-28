import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/LocationList.css';

export default function LocationList() {
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [products, setProducts] = useState([]);

  // Lokasyonları çek
  useEffect(() => {
    axios.get('http://localhost:5001/api/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error('Lokasyonlar alınamadı', err));
  }, []);

  // Lokasyona tıklanınca o lokasyondaki ürünleri çek
  const handleLocationClick = (id) => {
    setSelectedLocationId(id);
    axios.get(`http://localhost:5001/api/locations/${id}/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Ürünler alınamadı', err));
  };

  return (
    <div className="location-container">
      <h2>📦 Depolar</h2>
      <ul className="location-list">
        {locations.map(loc => (
          <li
            key={loc.id}
            onClick={() => handleLocationClick(loc.id)}
            className={selectedLocationId === loc.id ? 'active' : ''}
          >
            {loc.name}
          </li>
        ))}
      </ul>

      {selectedLocationId && (
        <div className="product-list">
          <h3>📋 Bu depodaki ürünler:</h3>
          {products.length === 0 ? (
            <p>Ürün bulunamadı.</p>
          ) : (
            <ul>
              {products.map((prod) => (
                <li key={prod.id}>
                  {prod.name} – <strong>{prod.total_quantity}</strong> {prod.unit}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
