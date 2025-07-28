import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ProductAdd.css';

export default function ProductAdd() {
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    unit: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/products', formData);
      setMessage('Ürün başarıyla eklendi!');
      setFormData({ name: '', barcode: '', unit: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Hata oluştu');
    }
  };

  return (
    <div className="product-add-container">
      <h2>Yeni Ürün Ekle</h2>
      <form onSubmit={handleSubmit} className="product-add-form">
        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="barcode"
          placeholder="Barkod"
          value={formData.barcode}
          onChange={handleChange}
          required
        />
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
        >
          <option value="">Birim Seçiniz</option>
          <option value="adet">Adet</option>
          <option value="kg">Kilogram</option>
          <option value="litre">Litre</option>
          <option value="paket">Paket</option>
          <option value="kutu">Kutu</option>
          <option value="kasa">Kasa</option>

        </select>
        <button type="submit">Kaydet</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
