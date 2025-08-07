import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import './LoginPage.css';

export default function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { user, login, logout } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:4555/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password }),
            });

            const rawToken = await response.text();
            const token = rawToken.replace(/^"|"$/g, '');

            if (response.ok && token) {
                login(token);
                setError('');
            } else {
                setError('Erreur de connexion');
            }
        } catch (err) {
            setError('Erreur réseau : ' + err.message);
        }
    };

    if (user) {
        return (
            <div className="success-container">
                <h2 className="success-title">Connecté</h2>
                <p className="success-info"><strong>ID :</strong> {user.id}</p>
                <p className="success-info"><strong>Rôle :</strong> {user.role}</p>
                <button className="logout-button" onClick={logout}>Se déconnecter</button>
            </div>
        );
    }

    return (
        <div className="login-container">
            <h2 className="login-title">Se connecter</h2>

            <div className="login-form">
                <input
                    className="login-input"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    placeholder="ID utilisateur"
                />

                <input
                    className="login-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                />

                <button
                    className="login-button primary"
                    onClick={handleLogin}
                >
                    Se connecter
                </button>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
