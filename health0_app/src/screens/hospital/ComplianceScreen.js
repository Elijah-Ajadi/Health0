import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';

export default function ComplianceScreen() {
    const AuditItem = ({ user, action, time }) => (
        <View style={styles.auditItem}>
            <View style={styles.auditLeft}>
                <Text style={styles.auditUser}>{user}</Text>
                <Text style={styles.auditAction}>{action}</Text>
            </View>
            <Text style={styles.auditTime}>{time}</Text>
        </View>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Compliance & Legal</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.ndpaBadge}>
                <MaterialIcons name="gavel" size={24} color={Theme.colors.clinical.primary} />
                <View>
                    <Text style={styles.ndpaTitle}>Nigeria Data Protection Act (NDPA)</Text>
                    <Text style={styles.ndpaSub}>Full Compliance Active • Audit Logs Locked</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ACCESS AUDIT TRAIL (UNEDITABLE)</Text>
                <View style={styles.auditCard}>
                    <AuditItem user="Dr. Ademola" action="Viewed EMR HV-092" time="12:54" />
                    <AuditItem user="Nurse Bello" action="Uploaded Lab Report" time="11:20" />
                    <AuditItem user="System" action="NIN Data Sync Complete" time="09:00" />
                    <AuditItem user="Dr. Bello" action="Authorized E-Prescription" time="Yesterday" />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>USER PERMISSION MANAGEMENT</Text>
                <View style={styles.roleGrid}>
                    <TouchableOpacity style={styles.roleBox}>
                        <Text style={styles.roleTitle}>Doctors</Text>
                        <Text style={styles.roleDesc}>Full Write/Verify Clinical Access</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roleBox}>
                        <Text style={styles.roleTitle}>Nursing</Text>
                        <Text style={styles.roleDesc}>Vitals & Observation Entry</Text>
                    </TouchableOpacity>
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
    ndpaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: Theme.colors.clinical.bg,
        padding: 20,
        borderRadius: Theme.borderRadius.xl,
        marginTop: 10,
        marginBottom: Theme.spacing.xl,
        borderWidth: 1,
        borderColor: Theme.colors.clinical.border,
    },
    ndpaTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: Theme.colors.clinical.primary,
    },
    ndpaSub: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    section: {
        marginBottom: Theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    chartBox: {
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        marginTop: 10,
        marginBottom: Theme.spacing.xl,
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
            default: Theme.shadows.md,
        })
    },
    auditCard: {
        backgroundColor: 'black',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        ...Platform.select({
            web: { boxShadow: '0 10px 15px rgba(0,0,0,0.3)' },
            default: Theme.shadows.lg,
        })
    },
    auditItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    auditUser: {
        color: Theme.colors.secondary,
        fontSize: 13,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    auditAction: {
        color: 'white',
        fontSize: 11,
        marginTop: 2,
    },
    auditTime: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: '700',
    },
    roleGrid: {
        gap: 12,
    },
    roleBox: {
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    roleDesc: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
    },
});
