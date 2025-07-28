import React, { useState, useEffect } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from 'axios';
import '../styles/BarcodeScanner.css';

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState('');
  const [scanned, setScanned] = useState(false);
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState('adet');
  const [quantity, setQuantity] = useState(1);
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error('Depo listesi alınamadı:', err));
  }, []);

  const handleScan = async (result) => {
    if (result?.text && !scanned) {
      setScanned(true);
      setBarcode(result.text);

      try {
        const res = await axios.get(`http://localhost:5001/api/products/barcode/${result.text}`);
        setProduct(res.data);
        setMessage('');
        setShowForm(true);
      } catch (err) {
        setProduct(null);
        setMessage('Ürün bulunamadı. Yeni ürün olarak eklemek ister misin?');
        setShowForm(true); // yeni ürün için de form göster
      }
    }
  };

  const handleSubmitForm = async () => {
  try {
    if (!barcode) {
      alert("❌ Barkod okunamadı.");
      return;
    }

    let productId = product?.id;

    if (!product) {
      const productRes = await axios.post('http://localhost:5001/api/products', {
        name: newName,
        barcode: barcode,
        unit: newUnit
      });
      productId = productRes.data.id;
    }

    await axios.post('http://localhost:5001/api/stock_movements', {
      product_id: productId,
      location_id: parseInt(locationId),
      quantity: parseInt(quantity),
      movement_type: 'in'
    });

    alert('✅ Ürün ve stok başarıyla kaydedildi!');
    setShowForm(false);
    resetAll();
  } catch (err) {
    console.error(err);
    alert('❌ Ekleme sırasında hata oluştu: ' + (err.response?.data?.message || 'Sunucu hatası'));
  }
};


  const resetAll = () => {
    setScanned(false);
    setBarcode('');
    setProduct(null);
    setNewName('');
    setNewUnit('adet');
    setQuantity(1);
    setLocationId('');
    setMessage('');
    setShowForm(false);
  };

  return (
    <div className="barcode-container">
      <h2>Barkod Oku</h2>

      {!scanned && (
        <BarcodeScannerComponent
          width={350}
          height={250}
          onUpdate={(err, result) => {
            if (result) handleScan(result);
          }}
        />
      )}

      {barcode && <p className="barcode-text">Barkod: <span>{barcode}</span></p>}

      {product && (
        <div className="product-info">
          <p>Ürün: {product.name}</p>
          <p>Birim: {product.unit}</p>
        </div>
      )}

      {scanned && (
        <button className="retry-btn" onClick={resetAll}>
          🔄 Yeniden Tara
        </button>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{product ? 'Stok Ekle' : 'Yeni Ürün Ekle'}</h3>

            {!product && (
              <>
                <input type="text" placeholder="Ürün Adı" value={newName} onChange={e => setNewName(e.target.value)} />
                <label>Birim</label>
                <select value={newUnit} onChange={e => setNewUnit(e.target.value)}>
                  <option value="adet">Adet</option>
                  <option value="kg">Kg</option>
                  <option value="paket">Paket</option>
                  <option value="kutu">Kutu</option>
                  <option value="kasa">Kasa</option>
                </select>
              </>
            )}

            <label>Adet</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />

            <label>Depo Seç</label>
            <select value={locationId} onChange={e => setLocationId(e.target.value)}>
              <option value="">Seçiniz</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>

            <button onClick={handleSubmitForm}>Kaydet</button>
            <button className="close-btn" onClick={() => setShowForm(false)}>İptal</button>
          </div>
        </div>
      )}

    </div>
  );
}
