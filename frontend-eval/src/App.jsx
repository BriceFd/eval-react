import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { AuthContext } from './AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', justifyContent: 'center' }}>
          {!user && <Link to="/login">Se connecter</Link>}
          {!user && <Link to="/signup">Créer un compte</Link>}
          {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
        </nav>

        <Routes>
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
