import React, { useState,useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

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
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h2>Compte créé !</h2>
                <p>ID : {createdUser.id}</p>
                <p>Rôle : {createdUser.role}</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Créer un compte</h2>
            <input value={id} onChange={e => setId(e.target.value)} placeholder="ID" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
            <div>
                <button onClick={() => handleSignup(false)}>Créer compte utilisateur</button>
                <button onClick={() => handleSignup(true)}>Créer compte admin</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
