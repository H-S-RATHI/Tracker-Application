import React, { useState, useEffect } from 'react';
import { apiRequest } from './api';

export default function Dashboard({ token, user, onLogout, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  async function fetchProjects() {
    try {
      const data = await apiRequest('/projects', 'GET', null, token);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await apiRequest('/projects', 'POST', { name }, token);
      setName('');
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Welcome, {user.name} <span className="user-email">({user.email})</span></h2>
        </div>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <h3 className="projects-title">Your Projects</h3>
      <form onSubmit={handleCreate} className="form project-form">
        <input placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} required className="input" />
        <button type="submit" disabled={projects.length >= 4} className="button create-project">Create Project</button>
      </form>
      {error && <div className="error">{error}</div>}
      <ul className="project-list">
        {projects.map(p => (
          <li key={p._id} className="project-list-item">
            <button onClick={() => onSelectProject(p)} className="project-link">{p.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
