import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import './ConfPage.css';

export default function ConfPage() {
    const [conferences, setConferences] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);


    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const response = await axios.get('http://localhost:4555/conferences');
                setConferences(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des conférences:', err);
                setError('Une erreur est survenue lors du chargement des conférences.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchConferences();
        }
    }, [user]);

    if (loading) {
        return <div className="loading">Chargement des conférences...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="conf-container">
            <h1 className="conf-title">Liste des Conférences</h1>           

            {conferences.length === 0 ? (
                <p className="conf-empty">Aucune conférence trouvée.</p>
            ) : (
                conferences.map((conf) => (
                    <div className="conf-card" key={conf._id || conf.id}>
                        <h2>{conf.title}</h2>
                        <p>{conf.description}</p>
                        {conf.img && (
                            <img
                                src={conf.img}
                                alt={conf.title}
                                className="conf-image"
                            />
                        )}
                        <p><strong>Contenu :</strong> {conf.content}</p>
                        <p>
                            <strong>Design :</strong>
                            <span style={{ background: conf.design?.mainColor, padding: '2px 8px', marginRight: '1rem', marginLeft: '0.5rem', color: 'white' }}>
                                {conf.design?.mainColor}
                            </span>
                            /
                            <span style={{ background: conf.design?.secondColor, padding: '2px 8px', marginLeft: '0.5rem' }}>
                                {conf.design?.secondColor}
                            </span>
                        </p>
                        <Link to={`/conference/${conf.id}`} className="conf-link">
                            Voir détails
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}
