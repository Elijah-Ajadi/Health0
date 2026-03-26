import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert, Modal, Pressable, ActivityIndicator } from 'react-native';
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset Password States
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetNin, setResetNin] = useState('');
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            setError("Please enter both identifier and password.");
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${Config.BASE_URL}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: identifier,
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                await login(result.user, result.token);
                navigation.navigate('PatientTabs');
            } else {
                setError(result.error || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            setError("Network Error: Could not connect to health0 gateway.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetNin || !resetNewPassword) {
            Alert.alert("Error", "Please fill in both NIN and New Password");
            return;
        }

        setResetLoading(true);
        try {
            const response = await fetch(`${Config.BASE_URL}/api/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nin: resetNin,
                    password: resetNewPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Password reset successful! You can now login.");
                setShowResetModal(false);
                setIdentifier(resetNin);
            } else {
                Alert.alert("Error", result.error || "Reset failed. Please verify your NIN.");
            }
        } catch (err) {
            Alert.alert("Network Error", "Could not reach reset server.");
        } finally {
            setResetLoading(false);
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
                        <TouchableOpacity onPress={() => setShowResetModal(true)}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={Theme.gradients.medical}
                            style={styles.gradientBtn}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.loginBtnText}>SIGN IN TO SECURE VAULT</Text>
                                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                                </>
                            )}
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

                {/* Password Reset Modal */}
                <Modal
                    visible={showResetModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowResetModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.resetModal}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Reset Secure Access</Text>
                                <TouchableOpacity onPress={() => setShowResetModal(false)}>
                                    <MaterialIcons name="close" size={24} color={Theme.colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.modalSub}>Enter your verified NIN to establish a new clinical password.</Text>

                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>NATIONAL IDENTITY NUMBER (NIN)</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Enter your 11-digit NIN"
                                    value={resetNin}
                                    onChangeText={setResetNin}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.modalInputGroup}>
                                <Text style={styles.modalLabel}>NEW SECURE PASSWORD</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Enter new password"
                                    value={resetNewPassword}
                                    onChangeText={setResetNewPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.resetSubmitBtn}
                                onPress={handleResetPassword}
                                disabled={resetLoading}
                            >
                                <Text style={styles.resetSubmitText}>
                                    {resetLoading ? 'RESETTING...' : 'RESET PASSWORD'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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
    errorText: {
        color: Theme.colors.error,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    forgotText: {
        fontSize: 13,
        color: Theme.colors.secondary,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    resetModal: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        ...Theme.shadows.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    modalSub: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        marginBottom: 24,
        lineHeight: 20,
    },
    modalInputGroup: {
        marginBottom: 16,
    },
    modalLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        marginBottom: 8,
    },
    modalInput: {
        height: 50,
        backgroundColor: Theme.colors.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        fontSize: 15,
    },
    resetSubmitBtn: {
        backgroundColor: Theme.colors.primary,
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    resetSubmitText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
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
