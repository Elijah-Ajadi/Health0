const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports for consistent resolution of modern libraries like React Navigation 7
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
