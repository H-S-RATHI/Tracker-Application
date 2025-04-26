import React, { useState } from 'react';
import { apiRequest } from './api';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', 'POST', form);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    loading ? (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Logging in...</p>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="login-container">
        <h2>Login</h2>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span>Don't have an account? </span>
          <a href="/signup" style={{ color: '#6366f1', textDecoration: 'underline', cursor: 'pointer' }}>Sign up</a>
        </div>
      </form>
    )
  );
}
