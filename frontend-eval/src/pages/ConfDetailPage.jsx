import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function ConfDetailPage() {
    const { id } = useParams(); 
    const [conference, setConference] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchConference = async () => {
            try {
                const response = await axios.get(`http://localhost:4555/conference/${id}`);
                setConference(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération de la conférence :', err);
                setError('Impossible de charger la conférence.');
            } finally {
                setLoading(false);
            }
        };

        fetchConference();
    }, [id]);

    if (loading) return <p>Chargement de la conférence...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!conference) return <p>Conférence introuvable.</p>;

    return (
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem' }}>
            <h1>{conference.title}</h1>
            <p><strong>Description :</strong> {conference.description}</p>
            {conference.img && (
                <img
                    src={conference.img}
                    alt={conference.title}
                    style={{ maxWidth: '100%', maxHeight: 300, marginBottom: 20 }}
                />
            )}
            <p><strong>Contenu :</strong> {conference.content}</p>
            <p><strong>Design :</strong></p>
            <ul>
                <span style={{ background: conference.design?.mainColor, padding: '2px 8px', marginRight: '1rem', marginLeft: '0.5rem', color: 'white' }}>
                    {conference.design?.mainColor}
                </span>
                /
                <span style={{ background: conference.design?.secondColor, padding: '2px 8px', marginLeft: '0.5rem' }}>
                    {conference.design?.secondColor}
                </span>
            </ul>

            <Link to="/">← Retour à la liste</Link>
        </div>
    );
}
