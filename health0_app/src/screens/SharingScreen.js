import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';

export default function SharingScreen() {
    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sharing Center</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            {/* Dynamic OTP Card */}
            <LinearGradient
                colors={['#0F172A', '#1E293B']}
                style={styles.otpCard}
            >
                <View style={styles.otpHeader}>
                    <Text style={styles.otpLabel}>ONE-TIME ACCESS CODE</Text>
                    <MaterialCommunityIcons name="shield-key" size={24} color={Theme.colors.secondary} />
                </View>
                <Text style={styles.otpValue}>882 109</Text>
                <Text style={styles.otpExpiry}>Expires in 04:59</Text>
                <TouchableOpacity style={styles.refreshButton}>
                    <MaterialIcons name="refresh" size={16} color="white" />
                    <Text style={styles.refreshText}>GENERATE NEW CODE</Text>
                </TouchableOpacity>
            </LinearGradient>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>SHARING METHODS</Text>

                <TouchableOpacity style={styles.methodCard}>
                    <View style={styles.methodIconBox}>
                        <MaterialIcons name="email" size={24} color={Theme.colors.primary} />
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>Email Secure PDF</Text>
                        <Text style={styles.methodSubtitle}>Send full profile to a verified clinic</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={Theme.colors.outline} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.methodCard}>
                    <View style={styles.methodIconBox}>
                        <MaterialIcons name="local-shipping" size={24} color={Theme.colors.secondary} />
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>Request Physical Delivery</Text>
                        <Text style={styles.methodSubtitle}>Hard-copy clinical records via courier</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={Theme.colors.outline} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.methodCard}>
                    <View style={styles.methodIconBox}>
                        <MaterialCommunityIcons name="cellphone-key" size={24} color={Theme.colors.accent} />
                    </View>
                    <View style={styles.methodInfo}>
                        <Text style={styles.methodTitle}>USSD Quick Access</Text>
                        <Text style={styles.methodSubtitle}>Manage access via *555*9#</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={Theme.colors.outline} />
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <MaterialIcons name="info-outline" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.infoText}>
                    Anyone with your OTP can view your designated clinical snapshot for up to 15 minutes.
                </Text>
            </View>
        </PageWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
    },
    header: {
        padding: Theme.spacing.lg,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    otpCard: {
        padding: Theme.spacing.xl,
        borderRadius: Theme.borderRadius.xl,
        alignItems: 'center',
        marginBottom: Theme.spacing.xl,
        ...Platform.select({
            web: { boxShadow: '0 10px 15px rgba(0,0,0,0.3)' },
            default: Theme.shadows.lg,
        })
    },
    otpHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    otpLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    otpValue: {
        color: 'white',
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: 4,
        marginVertical: 10,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    otpExpiry: {
        color: Theme.colors.secondary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 20,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: Theme.borderRadius.full,
    },
    refreshText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '800',
    },
    section: {
        marginBottom: Theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: Theme.spacing.md,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        marginBottom: 12,
        gap: 16,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    methodIconBox: {
        width: 50,
        height: 50,
        backgroundColor: Theme.colors.background,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodInfo: {
        flex: 1,
    },
    methodTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    methodSubtitle: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
    },
    infoBox: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: Theme.colors.outline + '30',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: Theme.colors.textSecondary,
        lineHeight: 18,
    },
});
