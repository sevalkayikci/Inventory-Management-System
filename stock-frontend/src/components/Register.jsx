import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterForm.css';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // opsiyonel
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', {
        username,
        password,
        role,
      });

      setMessage(res.data.message);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Kayıt sırasında hata oluştu');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Kayıt Ol</button>
      {message && <p>{message}</p>}
    </form>
  );
}
