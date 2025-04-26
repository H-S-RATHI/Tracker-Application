import React, { useState, useEffect } from 'react';
import { apiRequest } from './api';

export default function Dashboard({ token, user, onLogout, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  async function fetchProjects() {
    setIsLoading(true);
    try {
      const data = await apiRequest('/projects', 'GET', null, token);
      setProjects(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Project name cannot be empty');
      return;
    }
    
    try {
      setIsLoading(true);
      await apiRequest('/projects', 'POST', { name }, token);
      setName('');
      fetchProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const projectIcons = ['📊', '📁', '📈', '🗂️', '📑', '🗄️'];
  
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="app-logo">
          <span className="logo-icon">📋</span>
          <h1 className="logo-text">Tracker</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Dashboard</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-label">Projects</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>
        
        <div className="sidebar-user">
          <div className="avatar" style={{ background: generateColorFromName(user.name) }}>
            {user.name[0].toUpperCase()}
          </div>
          <div className="sidebar-user-details">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
        </div>
        
        <button onClick={onLogout} className="sidebar-logout">
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </aside>
      
      <main className="dashboard-main">
        <header className="dashboard-main-header">
          <h2>My Workspace</h2>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search projects..."
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="notification-btn">🔔</button>
          </div>
        </header>
        
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{projects.length}</div>
              <div className="stat-label">Total Projects</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">0</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{projects.length}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
        </section>
        
        <section className="dashboard-projects-section">
          <div className="projects-header-row">
            <h3>Your Projects</h3>
            <form onSubmit={handleCreate} className="project-form-inline">
              <input 
                placeholder="New Project Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="project-input" 
              />
              <button 
                type="submit" 
                disabled={projects.length >= 10 || isLoading} 
                className="create-project-btn"
              >
                <span className="btn-icon">+</span>
                Create Project
              </button>
            </form>
          </div>
          
          {error && <div className="error-message"><span>⚠️</span> {error}</div>}
          
          {isLoading && !projects.length ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No projects yet</h3>
              <p>Create your first project to get started</p>
            </div>
          ) : (
            <ul className="project-grid">
              {projects.map((p, index) => (
  <li key={p._id} className="project-card">
    <div className="project-card-content-wrapper">
      <button 
        onClick={() => onSelectProject(p)} 
        className="project-card-content"
      >
        <div className="project-card-header">
          <span className="project-icon">
            {projectIcons[index % projectIcons.length]}
          </span>
          <div className="project-status">Active</div>
        </div>
        <h4 className="project-name">{p.name}</h4>
        <div className="project-meta">
          <div className="tasks-count">0 tasks</div>
          <div className="last-updated">Updated today</div>
        </div>
        <div className="view-project">View Details →</div>
      </button>
      <button 
        className="delete-project-btn"
        title="Delete Project"
        onClick={async (e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
            try {
              await apiRequest(`/projects/${p._id}`, 'DELETE', null, token);
              fetchProjects();
            } catch (err) {
              setError(err.message);
            }
          }
        }}
      >
        <span role="img" aria-label="delete">🗑️</span>
      </button>
    </div>
  </li>
))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function generateColorFromName(name) {
  // Generate a consistent color based on the user's name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to hex color
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}