import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';

export default function AnalyticsScreen() {
    const MetricCard = ({ label, value, unit, status, color }) => (
        <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{label}</Text>
            <View style={styles.metricMain}>
                <Text style={styles.metricValue}>{value}</Text>
                <Text style={styles.metricUnit}>{unit}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: color + '15' }]}>
                <Text style={[styles.statusText, { color: color }]}>{status}</Text>
            </View>
        </View>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Health Analytics</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.grid}>
                <MetricCard label="HEART RATE" value="72" unit="bpm" status="Healthy" color={Theme.colors.success} />
                <MetricCard label="BLOOD PRESSURE" value="118/79" unit="mmHg" status="Normal" color={Theme.colors.success} />
                <MetricCard label="BLOOD GLUCOSE" value="95" unit="mg/dL" status="Ideal" color={Theme.colors.secondary} />
                <MetricCard label="O2 SATURATION" value="98" unit="%" status="Optimal" color={Theme.colors.success} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>TREND ANALYSIS</Text>
                <View style={styles.chartPlaceholder}>
                    <LinearGradient
                        colors={['#eff6ff', '#fff']}
                        style={styles.chartGradient}
                    >
                        <MaterialCommunityIcons name="chart-bell-curve" size={48} color={Theme.colors.secondary} />
                        <Text style={styles.chartText}>Vitals History Graph (Weekly)</Text>
                    </LinearGradient>
                </View>
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                    <MaterialIcons name="auto-awesome" size={20} color={Theme.colors.accent} />
                    <Text style={styles.summaryTitle}>Health AI Insight</Text>
                </View>
                <Text style={styles.summaryBody}>
                    Your cardiovascular metrics have remained stable over the last 30 days. Your resting heart rate is in the 75th percentile for your age group.
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: Theme.spacing.lg,
    },
    metricCard: {
        width: '48%',
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2, // For Android
            },
        })
    },
    metricLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 0.5,
    },
    metricMain: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginVertical: 8,
    },
    metricValue: {
        fontSize: 22,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    metricUnit: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: Theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: Theme.spacing.md,
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: 'white',
        borderRadius: Theme.borderRadius.xl,
        overflow: 'hidden',
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 5, // For Android
            },
        })
    },
    chartGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    chartText: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    summaryCard: {
        backgroundColor: '#F5F3FF',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: '#DDD6FE',
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: Theme.colors.accent,
    },
    summaryBody: {
        fontSize: 13,
        color: '#5B21B6',
        lineHeight: 20,
        fontWeight: '500',
    },
});
