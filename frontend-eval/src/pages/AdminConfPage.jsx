import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import './AdminConfPage.css';

export default function AdminConferencePage() {
    const { user } = useContext(AuthContext);
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editConference, setEditConference] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Nouvel état pour formulaire ajout conférence
    const [newConf, setNewConf] = useState({
        title: '',
        description: '',
        img: '',
        content: '',
        design: {
            mainColor: '#000000',
            secondColor: '#ffffff'
        }
    });

    // Récupérer les conférences
    const fetchConferences = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:4555/conferences', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setConferences(res.data);
        } catch (err) {
            setError('Erreur lors du chargement des conférences');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.token) {
            fetchConferences();
        }
    }, [user]);

    if (!user || !user.token) {
        return <div>Accès refusé : veuillez vous connecter.</div>;
    }

    if (loading) {
        return <div>Chargement des conférences...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Supprimer conférence
    const handleDelete = async (id) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            setDeletingId(id);

            await axios.delete(`http://localhost:4555/conference/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // ✅ Filtrage uniquement sur `conf.id`, pas `_id`
            setConferences((prev) => prev.filter((conf) => conf.id !== id));
            setEditConference(null);
        } catch (err) {
            alert('Erreur lors de la suppression');
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    // Modifier conférence
    const startEdit = (conf) => setEditConference(conf);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'mainColor' || name === 'secondColor') {
            setEditConference((prev) => ({
                ...prev,
                design: {
                    ...prev.design,
                    [name]: value,
                },
            }));
        } else {
            setEditConference((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        const id = editConference.id || editConference._id;
        if (!id) {
            alert('ID de conférence manquant');
            return;
        }

        try {
            setSaving(true);
            const { _id, ...confData } = editConference;
            await axios.patch(`http://localhost:4555/conference/${id}`, { conference: confData }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            alert('Conférence mise à jour');
            setEditConference(null);
            fetchConferences();
        } catch (err) {
            alert('Erreur lors de la mise à jour');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Gestion changement formulaire ajout
    const handleNewChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mainColor' || name === 'secondColor') {
            setNewConf((prev) => ({
                ...prev,
                design: {
                    ...prev.design,
                    [name]: value,
                },
            }));
        } else {
            setNewConf((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Ajouter conférence
    const handleAddConference = async () => {
        const { title, description, content, design } = newConf;

        if (!title || !description || !content || !design.mainColor || !design.secondColor) {
            alert('Les champs Titre, Description, Contenu et les couleurs sont requis.');
            return;
        }

        try {
            await axios.post('http://localhost:4555/conference', newConf, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            alert('Conférence ajoutée avec succès !');
            setNewConf({
                title: '',
                description: '',
                img: '',
                content: '',
                design: {
                    mainColor: '#000000',
                    secondColor: '#ffffff',
                },
            });
            fetchConferences();
        } catch (err) {
            alert('Erreur lors de la création : ' + (err.response?.data?.message || 'Erreur inconnue'));
            console.error(err);
        }
    };

    if (loading) return <p>Chargement des conférences...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Administration des conférences</h2>

            {/* Formulaire ajout */}
            {user?.role === 'admin' && (
                <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
                    <h3>Ajouter une conférence</h3>
                    <input
                        name="title"
                        placeholder="Titre"
                        value={newConf.title}
                        onChange={handleNewChange}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <input
                        name="description"
                        placeholder="Description"
                        value={newConf.description}
                        onChange={handleNewChange}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <input
                        name="img"
                        placeholder="URL de l'image"
                        value={newConf.img}
                        onChange={handleNewChange}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <textarea
                        name="content"
                        placeholder="Contenu"
                        value={newConf.content}
                        onChange={handleNewChange}
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                        rows={4}
                    />
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label>
                            Couleur principale :
                            <input
                                type="color"
                                name="mainColor"
                                value={newConf.design.mainColor}
                                onChange={handleNewChange}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </label>{' '}
                        <label>
                            Couleur secondaire :
                            <input
                                type="color"
                                name="secondColor"
                                value={newConf.design.secondColor}
                                onChange={handleNewChange}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </label>
                    </div>
                    <button onClick={handleAddConference}>Créer</button>
                </div>
            )}

            {/* Liste conférences */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {conferences.map((conf) => (
                    <li className="admin-user-item"
                        key={conf._id || conf.id}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1rem',
                            background: conf.design?.secondColor || '#f9f9f9',
                            color: conf.design?.mainColor || '#000',
                        }}
                    >
                        <h3>{conf.title}</h3>
                        <p><strong>Description :</strong> {conf.description}</p>
                        <p><strong>Contenu :</strong> {conf.content}</p>
                        {conf.img && (
                            <img
                                src={conf.img}
                                alt="Illustration"
                                style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'cover', border: '1px solid #ccc' }}
                            />
                        )}
                        <p>
                            <strong>Couleurs :</strong>{' '}
                            <span style={{ background: conf.design?.mainColor, padding: '2px 8px', marginRight: '1rem', color: 'white' }}>
                                {conf.design?.mainColor}
                            </span>
                            <span style={{ background: conf.design?.secondColor, padding: '2px 8px' }}>
                                {conf.design?.secondColor}
                            </span>
                        </p>
                        <button className="modifier-btn" onClick={() => startEdit(conf)} disabled={saving}>Modifier</button>{' '}
                        <button className="supprimer-btn"
                            onClick={() => handleDelete(conf.id)}
                            disabled={deletingId === conf.id}
                        >
                            {deletingId === conf.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                    </li>
                ))}
            </ul>

            {editConference && (
                <div className="adminconf-edit-form">
                    <h3>Modifier la conférence</h3>
                    <label>
                        Titre :
                        <input name="title" value={editConference.title || ''} onChange={handleChange} />
                    </label>
                    <label>
                        Description :
                        <textarea name="description" value={editConference.description || ''} onChange={handleChange} />
                    </label>
                    <label>
                        Image URL :
                        <input name="img" value={editConference.img || ''} onChange={handleChange} />
                    </label>
                    <label>
                        Contenu :
                        <textarea name="content" value={editConference.content || ''} onChange={handleChange} />
                    </label>
                    <div className="adminconf-form-buttons">
                        <button onClick={handleSave} disabled={saving}>
                            {saving ? 'Enregistrement...' : 'Sauvegarder'}
                        </button>
                        <button onClick={() => setEditConference(null)} disabled={saving}>Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
}
