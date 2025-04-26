import React, { useState } from 'react';
import { apiRequest } from './api';

export default function Signup({ onSignup, onGoToLogin }) {
  const [form, setForm] = useState({ email: '', password: '', name: '', country: '' });
  const [error, setError] = useState('');
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiRequest('/auth/signup', 'POST', form);
      onSignup(data);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="signup-container">
      <h2>Sign Up</h2>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
      {error && <div className="error">{error}</div>}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <span>Already have an account? </span>
        <button type="button" onClick={onGoToLogin} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '1rem' }}>
          Sign In
        </button>
      </div>
    </form>
  );
}
