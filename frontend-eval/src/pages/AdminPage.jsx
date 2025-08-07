import React, { useEffect, useState } from 'react';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4555/users');
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };


        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Liste des utilisateurs</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!error && users.length === 0 && <p>Aucun utilisateur trouvé.</p>}
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        ID: {user.id} — Rôle: {user.type}
                    </li>
                ))}
            </ul>
        </div>
    );
}
