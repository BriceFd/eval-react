import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

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

            const data = await response.text(); // le token en texte brut
            console.log('Réponse login:', data);

            if (response.ok && data) {
                // Met à jour le contexte (stockage token + user)
                login(data);

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
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h2>Connecté</h2>
                <p>ID : {user.id}</p>
                <p>Rôle : {user.role}</p>
                <button onClick={logout}>Se déconnecter</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Se connecter</h2>
            <input value={id} onChange={e => setId(e.target.value)} placeholder="ID" />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mot de passe"
            />
            <button onClick={handleLogin}>Se connecter</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
