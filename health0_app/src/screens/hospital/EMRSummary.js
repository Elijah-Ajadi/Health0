import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';
import { useAuth } from '../../context/AuthContext';
import Config from '../../config';

export default function EMRSummary({ route, navigation }) {
    const { patientId } = route.params || {};
    const { token } = useAuth();
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!patientId) return;
        try {
            const response = await fetch(`${Config.BASE_URL}/api/hospital/patient/${patientId}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setPatient(data.profile);
                setRecords(data.records);
            }
        } catch (error) {
            console.error('Error fetching EMR:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [patientId]);
    const TimelineItem = ({ year, event, hospital, type }) => (
        <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
                <Text style={styles.timelineYear}>{year}</Text>
                <View style={styles.timelineLine} />
            </View>
            <View style={styles.timelineContent}>
                <View style={styles.eventBox}>
                    <Text style={styles.eventTitle}>{event}</Text>
                    <Text style={styles.eventHospital}>{hospital} • {type}</Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background }}>
                <ActivityIndicator size="large" color={Theme.colors.clinical.primary} />
                <Text style={{ marginTop: 12, color: Theme.colors.textSecondary, fontWeight: '600' }}>Retrieving Secure Health Ledger...</Text>
            </View>
        );
    }

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={Theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.patientBrief}>
                        <Text style={styles.patientName}>{patient?.user?.first_name} {patient?.user?.last_name}</Text>
                        <Text style={styles.patientId}>ID: {patient?.nin} • {patient?.blood_group} • {patient?.genotype}</Text>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                        <MaterialIcons name="more-vert" size={24} color={Theme.colors.text} />
                    </TouchableOpacity>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            {/* Red Flag Alert Zone */}
            <View style={styles.alertZone}>
                <View style={styles.alertHeader}>
                    <MaterialIcons name="warning" size={20} color={Theme.colors.error} />
                    <Text style={styles.alertTitle}>CRITICAL CLINICAL ALERTS</Text>
                </View>
                <View style={styles.alertGrid}>
                    <View style={styles.alertPill}>
                        <Text style={styles.alertLabel}>Allergies:</Text>
                        <Text style={styles.alertVal}>{patient?.allergies || 'NONE RECORDED'}</Text>
                    </View>
                    <View style={styles.alertPill}>
                        <Text style={styles.alertLabel}>Infectious Diseases:</Text>
                        <Text style={styles.alertVal}>{patient?.infectious_diseases || 'NONE RECORDED'}</Text>
                    </View>
                    <View style={styles.alertPill}>
                        <Text style={styles.alertLabel}>Clinical Status:</Text>
                        <Text style={[styles.alertVal, { fontWeight: '800', color: Theme.colors.success }]}>VERIFIED (INTERSWITCH ID)</Text>
                    </View>
                </View>
            </View>

            {/* Quick Metrics */}
            <View style={styles.metricsRow}>
                <View style={styles.metricItem}>
                    <Text style={styles.mLabel}>BLOOD GROUP</Text>
                    <Text style={[styles.mVal, { color: Theme.colors.error }]}>{patient?.blood_group || 'N/A'}</Text>
                </View>
                <View style={[styles.metricItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Theme.colors.outline }]}>
                    <Text style={styles.mLabel}>GENOTYPE</Text>
                    <Text style={styles.mVal}>{patient?.genotype || 'N/A'}</Text>
                </View>
                <View style={styles.metricItem}>
                    <Text style={styles.mLabel}>RECORDS</Text>
                    <Text style={styles.mVal}>{records.length}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>UNIFIED CLINICAL TIMELINE (ALL FACILITIES)</Text>
                <View style={styles.timelineContainer}>
                    {records.map((record) => (
                        <TimelineItem
                            key={record.id}
                            year={new Date(record.created_at).getFullYear()}
                            event={record.title}
                            hospital={record.hospital_name || 'Health0 System'}
                            type={record.is_verified ? 'OFFICIAL' : 'USER UPLOAD'}
                        />
                    ))}
                    {records.length === 0 && (
                        <Text style={{ color: Theme.colors.textSecondary }}>No clinical history found.</Text>
                    )}
                </View>
            </View>

            <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionBtn}>
                    <MaterialCommunityIcons name="pill" size={20} color={Theme.colors.clinical.primary} />
                    <Text style={styles.actionText}>Medication Reconciliation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <MaterialIcons name="folder-shared" size={20} color={Theme.colors.clinical.primary} />
                    <Text style={styles.actionText}>Detailed Diagnostics</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.signatureInfo}>
                <MaterialIcons name="lock" size={14} color={Theme.colors.textSecondary} />
                <Text style={styles.sigText}>Certified Unified Record via Health0 Blockchain Ledger</Text>
            </View>
        </PageWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
        maxWidth: 1000,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
        gap: 16,
    },
    patientBrief: {
        flex: 1,
    },
    patientName: {
        fontSize: 18,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    patientId: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    alertZone: {
        backgroundColor: '#fef2f2',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: '#fecaca',
        marginTop: 10,
        marginBottom: Theme.spacing.lg,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    alertTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: Theme.colors.error,
        letterSpacing: 1,
    },
    alertGrid: {
        gap: 8,
    },
    alertPill: {
        flexDirection: 'row',
        gap: 8,
    },
    alertLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#991b1b',
    },
    alertVal: {
        fontSize: 13,
        color: '#450a0a',
        fontWeight: '500',
    },
    metricsRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        marginBottom: Theme.spacing.xl,
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    mLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
    },
    mVal: {
        fontSize: 18,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    section: {
        marginBottom: Theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    timelineContainer: {
        paddingLeft: 20,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    timelineLeft: {
        width: 60,
        alignItems: 'center',
        marginRight: 20,
    },
    timelineYear: {
        fontSize: 14,
        fontWeight: '900',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: Theme.colors.outline,
    },
    timelineContent: {
        flex: 1,
    },
    eventBox: {
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    eventTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    eventHospital: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        marginTop: 2,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
    },
    actionBtn: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: Theme.borderRadius.lg,
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: Theme.colors.clinical.border,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '700',
        color: Theme.colors.clinical.primary,
        textAlign: 'center',
    },
    signatureInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        opacity: 0.5,
        paddingBottom: 20,
    },
    sigText: {
        fontSize: 10,
        fontWeight: '700',
        color: Theme.colors.textSecondary,
    },
});
