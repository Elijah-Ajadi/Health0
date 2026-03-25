import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';

export default function OperationsScreen() {
    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Operations & Scheduling</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.statGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statVal}>18m</Text>
                    <Text style={styles.statLabel}>AVG WAIT TIME</Text>
                    <View style={[styles.trend, { backgroundColor: Theme.colors.success + '15' }]}>
                        <MaterialIcons name="trending-down" size={12} color={Theme.colors.success} />
                        <Text style={[styles.trendText, { color: Theme.colors.success }]}>-4m</Text>
                    </View>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statVal}>32</Text>
                    <Text style={styles.statLabel}>TODAY'S APPOINTMENTS</Text>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>STAFF ON DUTY</Text>
                    <TouchableOpacity><Text style={styles.viewFull}>Roster</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.staffScroll}>
                    <View style={styles.staffCard}>
                        <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>DA</Text></View>
                        <Text style={styles.staffName}>Dr. Ademola</Text>
                        <Text style={styles.staffTitle}>Cardiologist</Text>
                    </View>
                    <View style={styles.staffCard}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: Theme.colors.accent + '20' }]}><Text style={[styles.avatarText, { color: Theme.colors.accent }]}>NB</Text></View>
                        <Text style={styles.staffName}>Nurse Bello</Text>
                        <Text style={styles.staffTitle}>On-Call</Text>
                    </View>
                </ScrollView>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ACTIVE REFERRALS</Text>
                <View style={styles.referralCard}>
                    <View style={styles.referralInfo}>
                        <Text style={styles.refPatient}>Patient HV-092 (Olawale)</Text>
                        <Text style={styles.refTarget}>To: Eye Foundation Clinic</Text>
                    </View>
                    <View style={styles.statusChip}>
                        <Text style={styles.statusText}>SENT</Text>
                    </View>
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
        padding: Theme.spacing.lg,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    statGrid: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        marginBottom: Theme.spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    statVal: {
        fontSize: 28,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    trend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 8,
    },
    trendText: {
        fontSize: 10,
        fontWeight: '900',
    },
    section: {
        marginBottom: Theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1.5,
    },
    viewFull: {
        fontSize: 12,
        fontWeight: '800',
        color: Theme.colors.clinical.primary,
    },
    staffScroll: {
        gap: 12,
    },
    staffCard: {
        width: 120,
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        alignItems: 'center',
        marginRight: 12,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        backgroundColor: Theme.colors.clinical.bg,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 14,
        fontWeight: '900',
        color: Theme.colors.clinical.primary,
    },
    staffName: {
        fontSize: 13,
        fontWeight: '700',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    staffTitle: {
        fontSize: 10,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    referralCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    referralInfo: {
        gap: 4,
    },
    refPatient: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    refTarget: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
    },
    statusChip: {
        backgroundColor: Theme.colors.success + '15',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.success,
    },
});
