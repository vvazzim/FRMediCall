// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authInfo, setAuthInfo] = useState();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const info = jwtDecode(token);
            setAuthInfo(info);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
