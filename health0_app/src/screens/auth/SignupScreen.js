import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../../theme/Theme';
import { useAuth } from '../../context/AuthContext';
import Config from '../../config';

export default function SignupScreen({ navigation }) {
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nin: '',
        fullName: '',
        dob: '',
        gender: '',
        phone: '',
        otp: '',
        email: '',
        address: '',
        username: '',
        password: '',
        healthPin: '',
        biometricEnabled: false,
        consentNDPA: false,
        consentSharing: false,
    });

    const [isVerifyingNIN, setIsVerifyingNIN] = useState(false);
    const [isNINVerified, setIsNINVerified] = useState(false);

    const handleVerifyNIN = async () => {
        if (formData.nin.length < 11) {
            Alert.alert("Invalid VNIN/NIM", "Please enter a valid NIN or VNIN.");
            return;
        }
        setIsVerifyingNIN(true);
        try {
            const response = await fetch(`${Config.BASE_URL}/api/verify-nin/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nin: formData.nin }),
            });

            const result = await response.json();

            if (response.ok) {
                setIsNINVerified(true);
                // Map official Interswitch Full Details schema
                setFormData({
                    ...formData,
                    nin: result.nin || formData.nin,
                    fullName: `${result.firstName || ''} ${result.middleName || ''} ${result.lastName || ''}`.trim(),
                    dob: result.dateOfBirth,
                    gender: result.gender === 'f' ? 'Female' : result.gender === 'm' ? 'Male' : result.gender,
                    phone: result.mobile || formData.phone,
                    address: result.address?.addressLine || formData.address
                });
            } else {
                Alert.alert("Verification Failed", result.error || "Could not verify NIN");
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to verification server.");
        } finally {
            setIsVerifyingNIN(false);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Identity Verification</Text>
            <Text style={styles.stepSubtitle}>We verify your identity directly with NIMC via Interswitch KYC.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>NATIONAL IDENTITY NUMBER (NIN)</Text>
                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="card-account-details-outline" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="VNIN (e.g. YV...FY) or NIN"
                        value={formData.nin}
                        onChangeText={(txt) => setFormData({ ...formData, nin: txt.toUpperCase() })}
                        maxLength={20}
                    />
                    {isNINVerified && <MaterialIcons name="check-circle" size={20} color={Theme.colors.success} />}
                </View>
            </View>

            {!isNINVerified ? (
                <TouchableOpacity
                    style={styles.verifyBtn}
                    onPress={handleVerifyNIN}
                    disabled={isVerifyingNIN}
                >
                    <LinearGradient
                        colors={Theme.gradients.medical}
                        style={styles.gradientBtn}
                    >
                        {isVerifyingNIN ? (
                            <Text style={styles.btnText}>VERIFYING WITH NIMC...</Text>
                        ) : (
                            <>
                                <Text style={styles.btnText}>VERIFY IDENTITY</Text>
                                <MaterialIcons name="verified-user" size={20} color="white" />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            ) : (
                <View style={styles.verifiedData}>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyLabel}>PRIMARY NIN (VERIFIED)</Text>
                        <Text style={styles.readOnlyValue}>{formData.nin}</Text>
                    </View>
                    <View style={styles.readOnlyField}>
                        <Text style={styles.readOnlyLabel}>FULL NAME (LEGAL)</Text>
                        <Text style={styles.readOnlyValue}>{formData.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.readOnlyField, { flex: 1 }]}>
                            <Text style={styles.readOnlyLabel}>DOB</Text>
                            <Text style={styles.readOnlyValue}>{formData.dob}</Text>
                        </View>
                        <View style={[styles.readOnlyField, { flex: 1 }]}>
                            <Text style={styles.readOnlyLabel}>GENDER</Text>
                            <Text style={styles.readOnlyValue}>{formData.gender}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                        <Text style={styles.nextBtnText}>PROCEED TO CONTACT INFO</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Contact Binding</Text>
            <Text style={styles.stepSubtitle}>Ensure your phone number matches the one linked to your NIN.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>PHONE NUMBER</Text>
                <View style={styles.inputWrapper}>
                    <MaterialIcons name="phone" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="+234 ..."
                        value={formData.phone}
                        onChangeText={(txt) => setFormData({ ...formData, phone: txt })}
                        keyboardType="phone-pad"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.otpBtn}>
                <Text style={styles.otpBtnText}>SEND SMS OTP</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS (FOR PDF DELIVERY)</Text>
                <View style={styles.inputWrapper}>
                    <MaterialIcons name="email" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="email@example.com"
                        value={formData.email}
                        onChangeText={(txt) => setFormData({ ...formData, email: txt })}
                        autoCapitalize="none"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>RESIDENTIAL ADDRESS (PHYSICAL DELIVERY)</Text>
                <View style={[styles.inputWrapper, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                    <MaterialIcons name="location-on" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, { textAlignVertical: 'top' }]}
                        placeholder="Street, City, State"
                        value={formData.address}
                        onChangeText={(txt) => setFormData({ ...formData, address: txt })}
                        multiline
                    />
                </View>
            </View>

            <View style={styles.navButtons}>
                <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
                    <Text style={styles.backBtnText}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                    <Text style={styles.nextBtnText}>SECURITY SETUP</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleSignupFinal = async () => {
        try {
            const nameParts = formData.fullName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            console.log("DEBUG: Sending Signup Payload:", {
                username: formData.username || formData.email,
                email: formData.email,
                nin: formData.nin,
                phone_number: formData.phone
            });
            const response = await fetch(`${Config.BASE_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username || formData.email,
                    email: formData.email,
                    password: formData.password,
                    first_name: firstName,
                    last_name: lastName,
                    role: 'PATIENT',
                    phone_number: formData.phone,
                    address: formData.address,
                    nin: formData.nin,
                    dob: formData.dob,
                    gender: formData.gender,
                    health_pin: formData.healthPin,
                    biometric_enabled: formData.biometricEnabled
                }),
            });

            const result = await response.json();

            if (response.ok) {
                await login(result.user, result.token);
                Alert.alert("Signup Complete", "Your Health0 ID has been verified and created.");
                navigation.navigate('PatientTabs');
            } else {
                Alert.alert("Signup Failed", result.error || JSON.stringify(result));
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Network Error", "Could not connect to registration server.");
        }
    };

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Account Security</Text>
            <Text style={styles.stepSubtitle}>Finalize your secure access credentials.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>CHOOSE USERNAME</Text>
                <View style={styles.inputWrapper}>
                    <MaterialIcons name="account-circle" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Unique Username"
                        autoCapitalize="none"
                        value={formData.username}
                        onChangeText={(txt) => setFormData({ ...formData, username: txt })}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>CREATE PASSWORD (MIN 12 CHARS)</Text>
                <View style={styles.inputWrapper}>
                    <MaterialIcons name="lock-outline" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Strong Password"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(txt) => setFormData({ ...formData, password: txt })}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>HEALTH PIN (FOR USSD/OFFLINE ACCESS)</Text>
                <View style={styles.inputWrapper}>
                    <MaterialIcons name="pin" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="4-digit PIN"
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        value={formData.healthPin}
                        onChangeText={(txt) => setFormData({ ...formData, healthPin: txt })}
                    />
                </View>
            </View>

            <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>Enable Biometric Login</Text>
                    <Text style={styles.toggleDesc}>Use Fingerprint/FaceID for quick access</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setFormData({ ...formData, biometricEnabled: !formData.biometricEnabled })}
                >
                    <MaterialIcons
                        name={formData.biometricEnabled ? "toggle-on" : "toggle-off"}
                        size={40}
                        color={formData.biometricEnabled ? Theme.colors.success : Theme.colors.outline}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.consentList}>
                <TouchableOpacity
                    style={styles.consentItem}
                    onPress={() => setFormData({ ...formData, consentNDPA: !formData.consentNDPA })}
                >
                    <MaterialIcons
                        name={formData.consentNDPA ? "check-box" : "check-box-outline-blank"}
                        size={22}
                        color={formData.consentNDPA ? Theme.colors.secondary : Theme.colors.outline}
                    />
                    <Text style={styles.consentText}>I agree to the NDPA Privacy Policy and Terms of Use.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.consentItem}
                    onPress={() => setFormData({ ...formData, consentSharing: !formData.consentSharing })}
                >
                    <MaterialIcons
                        name={formData.consentSharing ? "check-box" : "check-box-outline-blank"}
                        size={22}
                        color={formData.consentSharing ? Theme.colors.secondary : Theme.colors.outline}
                    />
                    <Text style={styles.consentText}>I consent to sharing record hashes with partner facilities.</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navButtons}>
                <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
                    <Text style={styles.backBtnText}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: Theme.colors.primary }]}
                    onPress={handleSignupFinal}
                >
                    <Text style={styles.nextBtnText}>COMPLETE SIGNUP</Text>
                    <MaterialIcons name="verified" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressDot, step >= 1 && styles.activeDot]} />
                    <View style={[styles.progressLine, step >= 2 && styles.activeLine]} />
                    <View style={[styles.progressDot, step >= 2 && styles.activeDot]} />
                    <View style={[styles.progressLine, step >= 3 && styles.activeLine]} />
                    <View style={[styles.progressDot, step >= 3 && styles.activeDot]} />
                </View>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an ID?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>SIGN IN</Text>
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
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Theme.colors.outline,
    },
    activeDot: {
        backgroundColor: Theme.colors.secondary,
    },
    progressLine: {
        width: 40,
        height: 2,
        backgroundColor: Theme.colors.outline,
    },
    activeLine: {
        backgroundColor: Theme.colors.secondary,
    },
    stepContainer: {
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xxl,
        ...Platform.select({
            web: { boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
            default: Theme.shadows.lg,
        }),
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: Theme.colors.primary,
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: 24,
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
    verifyBtn: {
        borderRadius: Theme.borderRadius.lg,
        overflow: 'hidden',
        marginTop: 8,
    },
    gradientBtn: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    btnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    verifiedData: {
        marginTop: 8,
        gap: 12,
    },
    readOnlyField: {
        backgroundColor: Theme.colors.background,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.md,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    readOnlyLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        marginBottom: 4,
    },
    readOnlyValue: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    nextBtn: {
        backgroundColor: Theme.colors.secondary,
        height: 56,
        borderRadius: Theme.borderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 12,
    },
    nextBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    otpBtn: {
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    otpBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: Theme.colors.secondary,
        textDecorationLine: 'underline',
    },
    navButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
    },
    backBtn: {
        flex: 1,
        height: 56,
        borderRadius: Theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    backBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    toggleDesc: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
    },
    consentList: {
        gap: 16,
        marginBottom: 24,
    },
    consentItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    consentText: {
        flex: 1,
        fontSize: 13,
        color: Theme.colors.textSecondary,
        lineHeight: 18,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        fontWeight: '500',
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '800',
        color: Theme.colors.secondary,
        letterSpacing: 1,
    },
});
