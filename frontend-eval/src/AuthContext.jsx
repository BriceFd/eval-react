import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Au chargement, on récupère le token en localStorage et on parse le user
        const token = localStorage.getItem('token');
        if (token) {
            const payload = parseJwt(token);
            if (payload) {
                setUser({ id: payload._id, role: payload.type, token });
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const payload = parseJwt(token);
        setUser({ id: payload._id, role: payload.type, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
