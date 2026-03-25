import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';

export default function DiagnosticPortal() {
    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Diagnostic & Uploads</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.uploadBox}>
                <MaterialCommunityIcons name="cloud-upload" size={48} color={Theme.colors.clinical.primary} />
                <Text style={styles.uploadTitle}>Upload verified patient data</Text>
                <Text style={styles.uploadDesc}>Drag & drop PDF reports, DICOM images, or lab results</Text>
                <TouchableOpacity style={styles.uploadBtn}>
                    <Text style={styles.uploadBtnText}>SELECT FILES</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>LAB ORDER MANAGEMENT</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.info}>
                            <Text style={styles.itemTitle}>Full Blood Count (FBC)</Text>
                            <Text style={styles.itemSub}>Ordered by Dr. Ademola • Mar 24</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>PENDING</Text>
                        </View>
                    </View>
                    <View style={[styles.row, { borderTopWidth: 1, borderTopColor: Theme.colors.background }]}>
                        <View style={styles.info}>
                            <Text style={styles.itemTitle}>Urinalysis</Text>
                            <Text style={styles.itemSub}>Ordered by Dr. Bello • Yesterday</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: Theme.colors.success + '15' }]}>
                            <Text style={[styles.statusText, { color: Theme.colors.success }]}>COMPLETED</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>CHARTING & NOTES (SOAP)</Text>
                <TouchableOpacity style={styles.noteCard}>
                    <View style={styles.noteHeader}>
                        <MaterialCommunityIcons name="file-document-edit" size={24} color={Theme.colors.clinical.primary} />
                        <Text style={styles.noteTitle}>Start New Clinical Note</Text>
                    </View>
                    <Text style={styles.noteDesc}>Use standardized templates for Subjective, Objective, Assessment, and Plan documentation.</Text>
                </TouchableOpacity>
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
    uploadBox: {
        backgroundColor: Theme.colors.clinical.bg,
        padding: 40,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 2,
        borderColor: Theme.colors.clinical.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: Theme.spacing.xl,
    },
    uploadTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Theme.colors.text,
        marginTop: 16,
    },
    uploadDesc: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        maxWidth: 250,
    },
    uploadBtn: {
        backgroundColor: Theme.colors.clinical.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: Theme.borderRadius.lg,
        marginTop: 24,
    },
    uploadBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
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
    card: {
        backgroundColor: 'white',
        borderRadius: Theme.borderRadius.xl,
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
            default: Theme.shadows.md,
        })
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
    },
    info: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    itemSub: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        backgroundColor: Theme.colors.warning + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '900',
        color: Theme.colors.warning,
    },
    noteCard: {
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    noteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    noteDesc: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
        lineHeight: 18,
    },
});
