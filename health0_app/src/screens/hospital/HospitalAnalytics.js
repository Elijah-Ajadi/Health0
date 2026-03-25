import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';

export default function HospitalAnalytics() {
    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Hospita Intelligence</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.chartBox}>
                <Text style={styles.sectionTitle}>REVENUE CYCLE MANAGEMENT</Text>
                <View style={styles.revenueMain}>
                    <Text style={styles.revVal}>₦4.2M</Text>
                    <Text style={styles.revLabel}>TOTAL BILLABLES (MAR 2026)</Text>
                </View>
                <View style={styles.revBar}>
                    <View style={[styles.revSeg, { width: '70%', backgroundColor: Theme.colors.success }]} />
                    <View style={[styles.revSeg, { width: '20%', backgroundColor: Theme.colors.warning }]} />
                </View>
                <View style={styles.revLegend}>
                    <View style={styles.legItem}><View style={[styles.dot, { backgroundColor: Theme.colors.success }]} /><Text style={styles.legText}>Insurance (70%)</Text></View>
                    <View style={styles.legItem}><View style={[styles.dot, { backgroundColor: Theme.colors.warning }]} /><Text style={styles.legText}>Out-of-Pocket (20%)</Text></View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>SUPPLY & INVENTORY AI</Text>
                <TouchableOpacity style={styles.inventoryCard}>
                    <MaterialCommunityIcons name="package-variant-closed" size={24} color={Theme.colors.warning} />
                    <View style={styles.invInfo}>
                        <Text style={styles.invTitle}>Paracetamol 500mg Low Stock</Text>
                        <Text style={styles.invSub}>AI Suggestion: Re-order 200 units</Text>
                    </View>
                    <MaterialIcons name="shopping-cart" size={20} color={Theme.colors.clinical.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>TREATMENT OUTCOMES</Text>
                <View style={styles.outcomeGrid}>
                    <View style={styles.outcomeBox}>
                        <Text style={styles.outcomeVal}>94%</Text>
                        <Text style={styles.outcomeLabel}>RECOVERY RATE</Text>
                    </View>
                    <View style={styles.outcomeBox}>
                        <Text style={styles.outcomeVal}>3.2 Days</Text>
                        <Text style={styles.outcomeLabel}>AVG LENGTH OF STAY</Text>
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
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    revenueMain: {
        marginBottom: 20,
    },
    revVal: {
        fontSize: 32,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    revLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
    },
    revBar: {
        height: 12,
        backgroundColor: Theme.colors.background,
        borderRadius: 6,
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 16,
    },
    revSeg: {
        height: '100%',
    },
    revLegend: {
        flexDirection: 'row',
        gap: 16,
    },
    legItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legText: {
        fontSize: 11,
        fontWeight: '600',
        color: Theme.colors.textSecondary,
    },
    section: {
        marginBottom: Theme.spacing.xl,
    },
    inventoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Theme.colors.warning + '40',
        gap: 16,
    },
    invInfo: {
        flex: 1,
    },
    invTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    invSub: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
    },
    outcomeGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    outcomeBox: {
        flex: 1,
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    outcomeVal: {
        fontSize: 24,
        fontWeight: '900',
        color: Theme.colors.clinical.primary,
    },
    outcomeLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
});
