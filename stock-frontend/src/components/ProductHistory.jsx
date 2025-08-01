import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/ProductHistory.css';

export default function ProductHistory() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productInput, setProductInput] = useState('');
  const [productId, setProductId] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Ürünler yüklenemedi:", err));
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setProductInput(input);
    if (input.trim() === '') {
      setFilteredProducts([]);
      setShowSuggestions(false);
    } else {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowSuggestions(true);
    }
  };

  const handleProductSelect = (product) => {
    setProductInput(product.name);
    setProductId(product.id);
    setShowSuggestions(false);
  };

  const fetchHistory = () => {
    if (!productId || !startDate || !endDate) return alert("Tüm alanları doldur!");
    axios.get('http://localhost:5001/api/stock_movements/history', {
      params: {
        product_id: productId,
        start: startDate,
        end: endDate
      }
    })
      .then(res => setHistory(res.data))
      .catch(err => console.error("Geçmiş alınamadı:", err));
  };

  const exportPDF = () => {
    const selectedProduct = products.find(p => p.id === parseInt(productId));
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(94, 147, 108);
    doc.text(`Ürün Geçmişi - ${selectedProduct?.name || ''}`, 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [['Tarih', 'Konum', 'Tip', 'Miktar']],
      body: history.map(item => [
        item.date, item.location, item.type.toUpperCase(), item.quantity
      ])
    });

    doc.save(`urun-gecmisi-${selectedProduct?.name || 'rapor'}.pdf`);
  };

  return (
    <div className="history-container">
      <h2>Ürün Gecmisi</h2>

      <div className="form-group">
        <input
          type="text"
          value={productInput}
          onChange={handleInputChange}
          className="search-input"
          placeholder="Ürün adı yaz..."
        />
        {showSuggestions && filteredProducts.length > 0 && (
          <ul className="product-suggestions">
            {filteredProducts.map((p) => (
              <li key={p.id} onClick={() => handleProductSelect(p)}>
                {p.name}
              </li>
            ))}
          </ul>
        )}

        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button onClick={fetchHistory}>Listele</button>
      </div>

      {history.length > 0 && (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Konum</th>
                <th>Tip</th>
                <th>Miktar</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr key={i}>
                  <td>{item.date}</td>
                  <td>{item.location}</td>
                  <td>{item.type.toUpperCase()}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportPDF}>PDF Kaydet</button>
        </>
      )}
    </div>
  );
}
