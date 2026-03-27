// Centralized Configuration for Health0 App
// uses EXPO_PUBLIC_ prefix for automatic injection in Expo environments

export const Config = {
    // Falls back to localhost for development if EXPO_PUBLIC_API_URL is not set
    // NOTE: Use your machine's local IP (e.g., http://192.168.1.x:8000) for physical devices
    // Use http://10.0.2.2:8000 for Android Emulators
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://health0.onrender.com/api',
    BASE_URL: (process.env.EXPO_PUBLIC_API_URL || 'https://health0.onrender.com').replace(/\/api$/, ''),
};

export default Config;
