import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SearchBar, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';

export default function VaultScreen() {
    const Folder = ({ icon, name, count, color }) => (
        <TouchableOpacity style={styles.folderCard}>
            <View style={[styles.folderIcon, { backgroundColor: color + '10' }]}>
                <MaterialCommunityIcons name={icon} size={32} color={color} />
            </View>
            <Text style={styles.folderName}>{name}</Text>
            <Text style={styles.folderCount}>{count} Documents</Text>
        </TouchableOpacity>
    );

    const DocumentItem = ({ name, date, type, verified }) => (
        <TouchableOpacity style={styles.docItem}>
            <View style={styles.docLeft}>
                <View style={styles.fileIcon}>
                    <MaterialCommunityIcons name="file-pdf-box" size={24} color={Theme.colors.error} />
                </View>
                <View>
                    <Text style={styles.docTitle}>{name}</Text>
                    <Text style={styles.docSubtitle}>{date} • {type}</Text>
                </View>
            </View>
            {verified ? (
                <View style={styles.verifiedTag}>
                    <MaterialIcons name="verified" size={12} color={Theme.colors.success} />
                    <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
            ) : (
                <View style={styles.userTag}>
                    <Text style={styles.userText}>USER UPLOADS</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Digital Health Vault</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <MaterialIcons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            {/* Search Bar Placeholder */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={Theme.colors.textSecondary} />
                <Text style={styles.searchPlaceholder}>Search reports, scans, prescriptions...</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>CATEGORIES</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderScroll}>
                    <Folder icon="radiology-box" name="Radiology" count="12" color={Theme.colors.secondary} />
                    <Folder icon="test-tube" name="Lab Results" count="24" color={Theme.colors.accent} />
                    <Folder icon="pill" name="Prescriptions" count="8" color={Theme.colors.success} />
                    <Folder icon="hospital-building" name="Discharge Summary" count="3" color={Theme.colors.warning} />
                </ScrollView>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>RECENT DOCUMENTS</Text>
                    <MaterialIcons name="filter-list" size={20} color={Theme.colors.textSecondary} />
                </View>
                <DocumentItem name="Full Lipid Profile.pdf" date="March 22, 2026" type="Lab Report" verified={true} />
                <DocumentItem name="Chest X-Ray.jpg" date="March 15, 2026" type="Radiology" verified={true} />
                <DocumentItem name="Medication_List.pdf" date="March 10, 2026" type="User Upload" verified={false} />
                <DocumentItem name="Heart_Rate_Log.pdf" date="March 05, 2026" type="User Upload" verified={false} />
            </View>
        </PageWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    addButton: {
        width: 40,
        height: 40,
        backgroundColor: Theme.colors.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.outline + '40',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        gap: 10,
        marginBottom: Theme.spacing.xl,
    },
    searchPlaceholder: {
        color: Theme.colors.textSecondary,
        fontSize: 14,
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
    folderScroll: {
        flexDirection: 'row',
        gap: 12,
    },
    folderCard: {
        width: 140,
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        marginRight: 12,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    folderIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    folderName: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    folderCount: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    docItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        marginBottom: 10,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    docLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fileIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#fee2e2',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    docTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    docSubtitle: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
    },
    verifiedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Theme.colors.success + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    verifiedText: {
        fontSize: 9,
        fontWeight: '900',
        color: Theme.colors.success,
    },
    userTag: {
        backgroundColor: Theme.colors.outline + '40',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    userText: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
    },
});
