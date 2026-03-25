// Centralized Configuration for Health0 App
// uses EXPO_PUBLIC_ prefix for automatic injection in Expo environments

export const Config = {
    // Falls back to localhost for development if EXPO_PUBLIC_API_URL is not set
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
    BASE_URL: (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api$/, ''),
};

export default Config;
