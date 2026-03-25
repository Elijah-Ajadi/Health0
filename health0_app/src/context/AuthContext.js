import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                let storedToken, storedUser;
                if (isWeb) {
                    storedToken = localStorage.getItem('auth_token');
                    storedUser = localStorage.getItem('auth_user');
                } else {
                    storedToken = await SecureStore.getItemAsync('auth_token');
                    storedUser = await SecureStore.getItemAsync('auth_user');
                }

                if (storedToken && storedUser && storedToken !== 'null' && storedToken !== 'undefined') {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error('Failed to load auth data', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, []);

    const login = async (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        try {
            if (isWeb) {
                localStorage.setItem('auth_token', authToken);
                localStorage.setItem('auth_user', JSON.stringify(userData));
            } else {
                await SecureStore.setItemAsync('auth_token', authToken);
                await SecureStore.setItemAsync('auth_user', JSON.stringify(userData));
            }
        } catch (e) {
            console.error('Failed to save auth data', e);
        }
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        try {
            if (isWeb) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            } else {
                await SecureStore.deleteItemAsync('auth_token');
                await SecureStore.deleteItemAsync('auth_user');
            }
        } catch (e) {
            console.error('Failed to clear auth data', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
