import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginForm.css';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { username, password });
      setMessage('Giriş başarılı!');
      localStorage.setItem('token', res.data.token); // Token'ı sakla
      navigate('/dashboard'); // Yönlendir
    } catch (err) {
      setMessage(err.response?.data?.message || 'Hata oluştu');
    }
  };

  return (
    <form onSubmit={handleLogin}>

      <img src='../public/Logo.svg' alt="Logo" />
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}
