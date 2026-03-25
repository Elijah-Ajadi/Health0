import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';

export default function PrivacyScreen() {
    const AuditItem = ({ facility, action, time, icon }) => (
        <View style={styles.auditItem}>
            <View style={styles.auditIconBox}>
                <MaterialIcons name={icon} size={20} color={Theme.colors.textSecondary} />
            </View>
            <View style={styles.auditMain}>
                <Text style={styles.auditFacility}>{facility}</Text>
                <Text style={styles.auditAction}>{action}</Text>
            </View>
            <Text style={styles.auditTime}>{time}</Text>
        </View>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Privacy & Access</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ACTIVE PERMISSIONS</Text>
                <View style={styles.card}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>Public Emergency Access</Text>
                            <Text style={styles.settingDesc}>Allows verified ER doctors to see your Life-Saver card</Text>
                        </View>
                        <Switch
                            value={true}
                            trackColor={{ false: '#767577', true: Theme.colors.success }}
                        />
                    </View>
                    <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: Theme.colors.outline }]}>
                        <View style={styles.settingText}>
                            <Text style={styles.settingTitle}>NIMC Data Sync</Text>
                            <Text style={styles.settingDesc}>Keep profile data in sync with national database</Text>
                        </View>
                        <Switch
                            value={true}
                            trackColor={{ false: '#767577', true: Theme.colors.success }}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>RECENT ACCESS AUDIT</Text>
                    <TouchableOpacity><Text style={styles.seeAllLetter}>Protocol Logs</Text></TouchableOpacity>
                </View>
                <View style={styles.auditCard}>
                    <AuditItem
                        facility="Lagoon Hospital - Dr. Bello"
                        action="Full Clinical View"
                        time="14:20"
                        icon="person"
                    />
                    <AuditItem
                        facility="MedPlus Pharmacy #04"
                        action="Prescription Check"
                        time="Yesterday"
                        icon="receipt"
                    />
                    <AuditItem
                        facility="Olawale Benjamin (You)"
                        action="Document Download"
                        time="Mar 20"
                        icon="get-app"
                    />
                    <AuditItem
                        facility="Red Cross ER Team"
                        action="Life-Saver Card Ping"
                        time="Mar 18"
                        icon="warning"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.dangerButton}>
                <MaterialIcons name="security-update-warning" size={20} color={Theme.colors.error} />
                <Text style={styles.dangerText}>REVOKE ALL EXTERNAL ACCESS</Text>
            </TouchableOpacity>
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
    card: {
        backgroundColor: 'white',
        borderRadius: Theme.borderRadius.xl,
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
            default: Theme.shadows.md,
        })
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
    },
    settingText: {
        flex: 1,
        paddingRight: 20,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    settingDesc: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    seeAllLetter: {
        fontSize: 12,
        fontWeight: '800',
        color: Theme.colors.secondary,
        textDecorationLine: 'underline',
    },
    auditCard: {
        backgroundColor: 'white',
        borderRadius: Theme.borderRadius.xl,
        overflow: 'hidden',
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
            default: Theme.shadows.md,
        })
    },
    auditItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.background,
    },
    auditIconBox: {
        width: 36,
        height: 36,
        backgroundColor: Theme.colors.background,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    auditMain: {
        flex: 1,
    },
    auditFacility: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    auditAction: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
    },
    auditTime: {
        fontSize: 10,
        fontWeight: '700',
        color: Theme.colors.textSecondary,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 16,
        borderWidth: 2,
        borderColor: Theme.colors.error,
        borderRadius: Theme.borderRadius.lg,
        marginTop: 20,
    },
    dangerText: {
        fontSize: 12,
        fontWeight: '900',
        color: Theme.colors.error,
    },
});
