import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import './AdminPage.css';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!user?.token) throw new Error('Utilisateur non authentifié');

                const response = await axios.get('http://localhost:4555/users', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setUsers(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des utilisateurs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) fetchUsers();
        else setLoading(false);
    }, [user]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            if (!user?.token) throw new Error('Utilisateur non authentifié');

            await axios.patch(
                `http://localhost:4555/usertype/${userId}`,
                { newType: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setUsers(prev =>
                prev.map(u => (u.id === userId ? { ...u, type: newRole } : u))
            );
        } catch (err) {
            console.error('Erreur lors de la mise à jour du rôle:', err);
            alert('Erreur lors de la mise à jour du rôle: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Confirmer la suppression de cet utilisateur ?')) return;

        try {
            await axios.delete(`http://localhost:4555/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Erreur lors de la suppression de l’utilisateur:', err);
            alert('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return <div className="loading">Chargement des utilisateurs...</div>;
    }

    return (
        <div className="admin-container">
            <h2 className="admin-title">Gestion des utilisateurs</h2>

            {error && <div className="error-message">{error}</div>}
            {!error && users.length === 0 && <p className="admin-empty">Aucun utilisateur trouvé.</p>}

            <ul className="admin-user-list">
                {users.map((userItem) => (
                    <li className="admin-user-item" key={userItem._id}>
                        <span className="admin-user-id"><strong>ID :</strong> {userItem.id}</span>
                        <label className="admin-role-select">
                            <strong>Rôle :</strong>
                            <select
                                value={userItem.type}
                                onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                                disabled={userItem.id === user.id}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                        {userItem.id !== user.id && (
                            <button
                                className="delete-user-btn"
                                onClick={() => handleDeleteUser(userItem.id)}
                            >
                                Supprimer
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
