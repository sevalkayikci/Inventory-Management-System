import React, { useEffect, useState } from 'react';
import '../styles/ProductsTab.css';

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', unit: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  // Ürünleri backend'den çek
  useEffect(() => {
    fetch('http://localhost:5001/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setError('Ürünler yüklenirken hata oluştu'));
  }, []);

  // Form input değişimi
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Yeni ürün ekle veya düzenlenen ürünü güncelle
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    // Basit validasyon
    if (!form.name.trim()) return setError('Ürün adı zorunlu');

    try {
      let response;
      if (editingId) {
        // Güncelle
        response = await fetch(`http://localhost:5001/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        // Yeni ürün ekle
        response = await fetch('http://localhost:5001/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }

      if (!response.ok) throw new Error('Sunucu hatası');
      const data = await response.json();

      if (editingId) {
        setProducts(products.map(p => (p.id === editingId ? data : p)));
        setEditingId(null);
      } else {
        setProducts([...products, data]);
      }
      setForm({ name: '', unit: '', price: '' });
    } catch {
      setError('İşlem sırasında hata oluştu');
    }
  };

  // Ürün sil
  const handleDelete = async id => {
    if (!window.confirm('Ürünü silmek istediğine emin misin?')) return;
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Silme hatası');
      setProducts(products.filter(p => p.id !== id));
    } catch {
      setError('Ürün silinirken hata oluştu');
    }
  };

  // Düzenleme için formu doldur
  const handleEdit = product => {
    setForm({ name: product.name, unit: product.unit || '', price: product.price || '' });
    setEditingId(product.id);
  };

  // İptal et
  const handleCancel = () => {
    setForm({ name: '', unit: '', price: '' });
    setEditingId(null);
    setError(null);
  };

  return (
    <div className="products-tab">
      <h2>Ürünler</h2>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Ürün adı"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="unit"
          placeholder="Birim (örn: adet, kg)"
          value={form.unit}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Fiyat"
          value={form.price}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
        <div className="buttons">
          <button type="submit" className="btn btn-primary">{editingId ? 'Güncelle' : 'Ekle'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={handleCancel}>İptal</button>}
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <table className="products-table">
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Birim</th>
            <th>Fiyat</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Ürün bulunamadı</td>
            </tr>
          )}
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.unit || '-'}</td>
              <td>{product.price ? product.price.toFixed(2) : '-'}</td>
              <td>
                <button className="btn btn-edit" onClick={() => handleEdit(product)}>Düzenle</button>
                <button className="btn btn-delete" onClick={() => handleDelete(product.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
