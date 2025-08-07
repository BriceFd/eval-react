import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

export default function SignupPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [createdUser, setCreatedUser] = useState(null);
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSignup = async (isAdmin) => {
        const endpoint = isAdmin ? 'signupadmin' : 'signup';

        try {
            const response = await fetch(`http://localhost:4555/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password }),
            });

            const data = await response.json();

            if (response.ok && data.user) {
                login(data.token);
                setCreatedUser({ id: data.user.id, role: data.user.type });
                setError('');
            } else if (response.ok) {
                // Si data.user est manquant mais pas d'erreur HTTP, fallback
                setCreatedUser({ id, role: isAdmin ? 'admin' : 'user' });
                setError('');
            } else {
                setError(data.message || 'Erreur lors de la création du compte');
            }

        } catch (err) {
            setError('Erreur réseau : ' + err.message);
        }
    };

    if (createdUser) {
        return (
            <div className="success-container">
                <h2 className="success-title">Compte créé !</h2>
                <p className="success-info">
                    <strong>ID :</strong> {createdUser.id}
                </p>
                <p className="success-info">
                    <strong>Rôle :</strong> {createdUser.role}
                </p>
            </div>
        );
    }

    return (
        <div className="signup-container">
            <h2 className="signup-title">Créer un compte</h2>

            <div className="signup-form">
                <input
                    className="signup-input"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    placeholder="ID utilisateur"
                />

                <input
                    className="signup-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                />

                <div className="signup-buttons">
                    <button
                        className="signup-button primary"
                        onClick={() => handleSignup(false)}
                    >
                        Créer un compte utilisateur
                    </button>

                    <button
                        className="signup-button admin"
                        onClick={() => handleSignup(true)}
                    >
                        Créer un compte admin
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}