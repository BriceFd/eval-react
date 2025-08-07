import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Échec du parsing du token JWT:', e);
        return null;
    }
}

function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = parseJwt(token);
        if (!payload || !payload.exp) return true;
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        console.error('Erreur lors de la vérification du token:', e);
        return true;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Initial load
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && !isTokenExpired(token)) {
            const payload = parseJwt(token);
            setUser({
                id: payload._id,
                role: payload.type,
                token: token,
            });
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, []);

    const login = (token) => {
        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token');
            setUser(null);
            return;
        }

        // Assure toi que c’est bien une string propre
        localStorage.setItem('token', token);
        const payload = parseJwt(token);

        setUser({
            id: payload._id,
            role: payload.type,
            token: token,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Axios interceptor pour attacher le token à chaque requête
    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use(
            config => {
                const token = localStorage.getItem('token');
                if (token && !isTokenExpired(token)) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    );
}
