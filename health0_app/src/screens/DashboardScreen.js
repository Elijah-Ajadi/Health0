import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';

export default function DashboardScreen() {
    const { width } = useWindowDimensions();
    const isWeb = width > 768;

    const QuickAction = ({ icon, label, color }) => (
        <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
                <MaterialCommunityIcons name={icon} size={28} color={color} />
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Morning, Olawale</Text>
                        <View style={styles.statusRow}>
                            <MaterialIcons name="verified" size={14} color={Theme.colors.success} />
                            <Text style={styles.statusText}>VERIFIED PATIENT</Text>
                        </View>
                    </View>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=health0_patient' }}
                        style={styles.avatar}
                    />
                </View>
            }
            contentContainerStyle={styles.container}
        >
            {/* Main Visual Card */}
            <LinearGradient
                colors={Theme.gradients.primary}
                style={styles.heroCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.heroInner}>
                    <View>
                        <Text style={styles.heroTitle}>Your Health0 ID</Text>
                        <Text style={styles.heroId}>HV-092-118-X</Text>
                        <Text style={styles.heroSubtitle}>Last Sync: Just now</Text>
                    </View>
                    <View style={styles.qrBadge}>
                        <MaterialCommunityIcons name="qrcode" size={40} color="white" />
                    </View>
                </View>
                <View style={styles.heroFooter}>
                    <Text style={styles.emergencyLabel}>NIN: 1234****901</Text>
                </View>
            </LinearGradient>

            {/* Life Saver Quick Access */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>PRIORITY CARE</Text>
                <TouchableOpacity style={styles.emergencyCard}>
                    <View style={styles.emergencyLeft}>
                        <View style={styles.emergencyIcon}>
                            <MaterialIcons name="emergency" size={24} color="white" />
                        </View>
                        <View>
                            <Text style={styles.emergencyTitle}>Life-Saver Snapshot</Text>
                            <Text style={styles.emergencySubtitle}>Blood Group O+, AA</Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={Theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.grid}>
                <QuickAction icon="calendar-check" label="Appointments" color={Theme.colors.secondary} />
                <QuickAction icon="pill" label="Medications" color={Theme.colors.accent} />
                <QuickAction icon="doctor" label="Talk to Doc" color={Theme.colors.success} />
                <QuickAction icon="map-marker-radius" label="Find Hospital" color={Theme.colors.warning} />
            </View>

            {/* Recent Activity Mini-Tree */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See History</Text></TouchableOpacity>
                </View>
                <View style={styles.activityCard}>
                    <View style={styles.activityDot} />
                    <View style={styles.activityInfo}>
                        <Text style={styles.activityText}>Consultation at St. Jude</Text>
                        <Text style={styles.activityTime}>2 hours ago</Text>
                    </View>
                    <MaterialIcons name="check-circle" size={16} color={Theme.colors.success} />
                </View>
            </View>
        </PageWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.lg,
        paddingVertical: Theme.spacing.md,
        backgroundColor: Theme.colors.surface,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.success,
        letterSpacing: 0.5,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: Theme.colors.outline,
    },
    heroCard: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        marginBottom: Theme.spacing.lg,
        ...Platform.select({
            web: { boxShadow: '0 10px 20px rgba(0,0,0,0.15)' },
            default: Theme.shadows.lg,
        })
    },
    heroInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroTitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    heroId: {
        color: 'white',
        fontSize: 24,
        fontWeight: '900',
        marginVertical: 4,
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
    },
    qrBadge: {
        width: 64,
        height: 64,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: Theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroFooter: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    emergencyLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
    section: {
        marginBottom: Theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: Theme.spacing.sm,
    },
    emergencyCard: {
        backgroundColor: Theme.colors.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: '#fee2e2',
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    emergencyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emergencyIcon: {
        width: 44,
        height: 44,
        backgroundColor: Theme.colors.error,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emergencyTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    emergencySubtitle: {
        fontSize: 12,
        color: Theme.colors.error,
        fontWeight: '600',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: Theme.spacing.xl,
    },
    actionItem: {
        width: '48%',
        backgroundColor: Theme.colors.surface,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        alignItems: 'center',
        gap: 10,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAll: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.colors.secondary,
    },
    activityCard: {
        backgroundColor: Theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        marginTop: 8,
        gap: 12,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.secondary,
    },
    activityInfo: {
        flex: 1,
    },
    activityText: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    activityTime: {
        fontSize: 10,
        color: Theme.colors.textSecondary,
    },
});
