import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ConfPage from './pages/ConfPage';
import ConfDetailPage from './pages/ConfDetailPage';
import AdminConfPage from './pages/AdminConfPage';
import { AuthContext } from './AuthContext';
import './App.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ConferenceHub
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Accueil
          </Link>

          {user && user.role === 'admin' && (
            <Link
              to="/admin-conference"
              className={`navbar-link ${isActive('/admin-conference') ? 'active' : ''}`}
            >
              Gestion des conférences
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
            >
              Se connecter
            </Link>
          )}

          {!user && (
            <Link
              to="/signup"
              className={`navbar-link ${isActive('/signup') ? 'active' : ''}`}
            >
              Créer un compte
            </Link>
          )}

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
            >
              Admin
            </Link>
          )}

          {user && (
            <div className="user-section">
              <span className="user-info">
                {user.id || user.email || 'Utilisateur'}
                {user.role === 'admin' && (
                  <span className="user-role">Admin</span>
                )}
              </span>
              <button
                onClick={logout}
                className="logout-button"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path='/' element={<ConfPage />} />
          <Route path="/conference/:id" element={<ConfDetailPage />} />
          <Route path='/admin-conference' element={<AdminConfPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;