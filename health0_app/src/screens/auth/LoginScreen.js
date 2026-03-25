import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../theme/Theme';
import Config from '../../config';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert("Missing Fields", "Please enter both identifier and password.");
            return;
        }

        try {
            const response = await fetch(`${Config.BASE_URL}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: identifier, // Backend uses username (could be NIN/Email)
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                await login(result.user, result.token);
                Alert.alert("Access Granted", "Welcome to your Secure Health Vault.");
                navigation.navigate('PatientTabs');
            } else {
                Alert.alert("Login Failed", result.error || "Invalid credentials.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to health0 gateway.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.brand}>Health0</Text>
                    <Text style={styles.welcome}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Unified Clinical Access Gateway</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NIN, EMAIL, OR PHONE</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="person-outline" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your identifier"
                                value={identifier}
                                onChangeText={setIdentifier}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <View style={styles.inputWrapper}>
                            <MaterialIcons name="lock-outline" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialIcons
                                    name={showPassword ? "visibility-off" : "visibility"}
                                    size={20}
                                    color={Theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <MaterialIcons
                                name={rememberMe ? "check-box" : "check-box-outline-blank"}
                                size={20}
                                color={rememberMe ? Theme.colors.secondary : Theme.colors.textSecondary}
                            />
                            <Text style={styles.checkboxText}>Remember this device</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                        <LinearGradient
                            colors={Theme.gradients.medical}
                            style={styles.gradientBtn}
                        >
                            <Text style={styles.loginBtnText}>SIGN IN TO SECURE VAULT</Text>
                            <MaterialIcons name="arrow-forward" size={20} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>QUICK ACCESS</Text>
                        <View style={styles.line} />
                    </View>

                    <TouchableOpacity style={styles.biometricBtn}>
                        <MaterialCommunityIcons name="fingerprint" size={32} color={Theme.colors.primary} />
                        <Text style={styles.biometricText}>Login with Biometrics</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have a secure Health0 ID?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.signupLink}>SIGN UP & VERIFY NIN</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Theme.spacing.xl,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    brand: {
        fontSize: 28,
        fontWeight: '900',
        color: Theme.colors.primary,
        marginBottom: 8,
    },
    welcome: {
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
        marginTop: 4,
    },
    form: {
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xxl,
        ...Platform.select({
            web: { boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
            default: Theme.shadows.lg,
        }),
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        marginBottom: 8,
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
        borderRadius: Theme.borderRadius.md,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: Theme.colors.text,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxText: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
        fontWeight: '500',
    },
    forgotText: {
        fontSize: 13,
        color: Theme.colors.secondary,
        fontWeight: '700',
    },
    loginBtn: {
        borderRadius: Theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: 24,
    },
    gradientBtn: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loginBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Theme.colors.outline,
    },
    dividerText: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
    },
    biometricBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 12,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        backgroundColor: Theme.colors.background,
    },
    biometricText: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.primary,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        fontWeight: '500',
    },
    signupLink: {
        fontSize: 14,
        fontWeight: '800',
        color: Theme.colors.secondary,
        letterSpacing: 1,
    },
});
