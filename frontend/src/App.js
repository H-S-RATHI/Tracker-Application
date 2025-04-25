import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import ProjectDetail from './ProjectDetail';
import './App.css';

function AppRoutes() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(token ? JSON.parse(localStorage.getItem('user')) : null);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  function handleAuth({ token, user }) {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard', { replace: true });
  }
  function handleLogout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  }
  function handleProjectSelect(p) {
    setProject(p);
    navigate(`/project/${p._id}`);
  }
  function handleBackToDashboard() {
    setProject(null);
    navigate('/dashboard');
  }

  return (
    <Routes>
      <Route
        path="/signup"
        element={
          token ? <Navigate to="/dashboard" /> : <Signup onSignup={handleAuth} onGoToLogin={() => navigate('/login')} />
        }
      />
      <Route
        path="/login"
        element={
          token ? <Navigate to="/dashboard" /> : <Login onLogin={handleAuth} />
        }
      />
      <Route
        path="/dashboard"
        element={
          token ? <Dashboard token={token} user={user} onLogout={handleLogout} onSelectProject={handleProjectSelect} /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/project/:id"
        element={
          token && project ? (
            <ProjectDetail token={token} project={project} onBack={handleBackToDashboard} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={token ? '/dashboard' : '/login'} />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
