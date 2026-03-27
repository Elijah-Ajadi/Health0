import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LightTheme, DarkTheme } from '../theme/Theme';

const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'health0_user_theme';

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState(LightTheme);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            let savedTheme = null;
            if (Platform.OS === 'web') {
                savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            } else {
                savedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
            }

            if (savedTheme) {
                const dark = savedTheme === 'dark';
                setIsDarkMode(dark);
                setTheme(dark ? DarkTheme : LightTheme);
            }
        } catch (e) {
            console.error('Failed to load theme', e);
        }
    };

    const toggleTheme = async () => {
        try {
            const newMode = !isDarkMode;
            setIsDarkMode(newMode);
            const newTheme = newMode ? DarkTheme : LightTheme;
            setTheme(newTheme);

            if (Platform.OS === 'web') {
                localStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
            } else {
                await SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
                try {
                    await SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
                } catch (secureStoreError) {
                    console.warn('SecureStore failed, falling back to localStorage (if available):', secureStoreError);
                    // Fallback to localStorage if SecureStore fails on non-web platforms
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
                    }
                }
            }
        } catch (e) {
            console.error('Failed to toggle theme', e);
        }
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
