import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform, Modal, Pressable } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';
import { useAuth } from '../../context/AuthContext';

export default function ClinicalDashboard({ navigation }) {
    const { user, logout } = useAuth();
    const { width } = useWindowDimensions();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const isWeb = width > 768;

    const MetricCard = ({ label, value, icon, color }) => (
        <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: color + '15' }]}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text style={styles.metricValue}>{value}</Text>
                <Text style={styles.metricLabel}>{label}</Text>
            </View>
        </View>
    );

    const AlertItem = ({ type, message, time, severity }) => (
        <View style={styles.alertItem}>
            <View style={[styles.severityDot, { backgroundColor: severity === 'high' ? Theme.colors.error : Theme.colors.warning }]} />
            <View style={styles.alertMain}>
                <Text style={styles.alertType}>{type}</Text>
                <Text style={styles.alertMessage} numberOfLines={1}>{message}</Text>
            </View>
            <Text style={styles.alertTime}>{time}</Text>
        </View>
    );

    const Shortcut = ({ icon, label, bg }) => (
        <TouchableOpacity style={[styles.shortcut, { backgroundColor: bg }]}>
            <MaterialIcons name={icon} size={24} color="white" />
            <Text style={styles.shortcutLabel}>{label}</Text>
        </TouchableOpacity>
    );

    const renderProfileMenu = () => (
        <Modal
            transparent={true}
            visible={showProfileMenu}
            onRequestClose={() => setShowProfileMenu(false)}
            animationType="fade"
        >
            <Pressable
                style={styles.modalOverlay}
                onPress={() => setShowProfileMenu(false)}
            >
                <View style={[styles.profileMenu, isWeb && styles.webProfileMenu]}>
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuUserName}>{user?.first_name} {user?.last_name}</Text>
                        <Text style={styles.menuUserEmail}>{user?.email}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowProfileMenu(false);
                            navigation.navigate('Profile');
                        }}
                    >
                        <MaterialIcons name="person-outline" size={22} color={Theme.colors.clinical.primary} />
                        <Text style={styles.menuItemText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <MaterialIcons name="settings" size={22} color={Theme.colors.textSecondary} />
                        <Text style={styles.menuItemText}>Account Settings</Text>
                    </TouchableOpacity>

                    <View style={styles.menuDivider} />

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowProfileMenu(false);
                            logout();
                        }}
                    >
                        <MaterialIcons name="logout" size={22} color={Theme.colors.error} />
                        <Text style={[styles.menuItemText, { color: Theme.colors.error }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.hospitalName}>LAGOS GENERAL HOSPITAL</Text>
                        <View style={styles.deptBadge}>
                            <Text style={styles.deptText}>CARDIOLOGY DEPT</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.statusToggle}
                            onPress={() => setShowProfileMenu(true)}
                        >
                            <View style={styles.onlineDot} />
                            <Text style={styles.statusLabel}>
                                {user?.first_name ? `DR. ${user.first_name.toUpperCase()} (ON DUTY)` : 'DR. ADEMOLA (OFFLINE)'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={isWeb ? styles.webLayout : styles.mobileLayout}>
                {/* Main Content Area */}
                <View style={styles.mainContent}>
                    <Text style={styles.sectionTitle}>CLINICAL COMMAND CENTER</Text>

                    {/* Traffic Grid */}
                    <View style={styles.metricGrid}>
                        <MetricCard label="Admissions Today" value="12" icon="hospital-box" color={Theme.colors.clinical.primary} />
                        <MetricCard label="Appointments" value="08" icon="calendar-clock" color={Theme.colors.secondary} />
                        <MetricCard label="Pending Labs" value="24" icon="flask-outline" color={Theme.colors.warning} />
                        <MetricCard label="Critical Alerts" value="03" icon="alert-decagram" color={Theme.colors.error} />
                    </View>

                    {/* Quick Shortcuts */}
                    <View style={styles.shortcutRow}>
                        <Shortcut icon="add-circle" label="New Consultation" bg={Theme.colors.clinical.primary} />
                        <Shortcut icon="emergency" label="Emergency Reg" bg={Theme.colors.error} />
                        <Shortcut icon="history-edu" label="E-Prescription" bg={Theme.colors.secondary} />
                    </View>

                    {/* Patient Queue Placeholder */}
                    <View style={styles.queueSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.subTitle}>ACTIVE PATIENT QUEUE</Text>
                            <TouchableOpacity><Text style={styles.viewFull}>View All</Text></TouchableOpacity>
                        </View>
                        <View style={styles.emptyQueue}>
                            <MaterialCommunityIcons name="account-group" size={48} color={Theme.colors.outline} />
                            <Text style={styles.emptyText}>All patients have been seen. Waiting for new arrivals.</Text>
                        </View>
                    </View>
                </View>

                {/* Sidebar / Alerts Column */}
                <View style={isWeb ? styles.sidebar : styles.mobileAlerts}>
                    <Text style={styles.sectionTitle}>CRITICAL ALERTS</Text>
                    <View style={styles.alertList}>
                        <AlertItem
                            type="Abnormal Labs"
                            message="Patient ID: #882 has critical high glucose."
                            time="2m ago"
                            severity="high"
                        />
                        <AlertItem
                            type="Access Request"
                            message="Lagoon Pharmacy: Record Access OTP Verified"
                            time="15m ago"
                            severity="low"
                        />
                        <AlertItem
                            type="Medication Overdue"
                            message="Ward 4 - Bed 12 medication needs administration."
                            time="1h ago"
                            severity="high"
                        />
                    </View>

                    <View style={styles.complianceCard}>
                        <MaterialIcons name="security" size={20} color={Theme.colors.success} />
                        <Text style={styles.complianceText}>NDPA COMPLIANCE ACTIVE</Text>
                        <Text style={styles.complianceSub}>All interactions are being logged.</Text>
                    </View>
                </View>
            </View>
        </PageWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.lg,
        paddingVertical: Theme.spacing.md,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
    },
    hospitalName: {
        fontSize: 16,
        fontWeight: '900',
        color: Theme.colors.text,
        letterSpacing: 1,
    },
    deptBadge: {
        backgroundColor: Theme.colors.clinical.bg,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    deptText: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.clinical.primary,
    },
    statusToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Theme.colors.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Theme.borderRadius.full,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.success,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Theme.colors.textSecondary,
    },
    webLayout: {
        flexDirection: 'row',
        gap: Theme.spacing.xl,
    },
    mobileLayout: {
        flexDirection: 'column',
        gap: Theme.spacing.lg,
    },
    mainContent: {
        flex: 3,
    },
    sidebar: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: Theme.spacing.md,
    },
    metricGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: Theme.spacing.xl,
    },
    metricCard: {
        width: '48%',
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    metricIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 24,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    metricLabel: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    shortcutRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.xl,
    },
    shortcut: {
        flex: 1,
        height: 100,
        borderRadius: Theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
            default: Theme.shadows.md,
        })
    },
    shortcutLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
        paddingHorizontal: 8,
    },
    alertList: {
        backgroundColor: 'white',
        borderRadius: Theme.borderRadius.xl,
        overflow: 'hidden',
        marginBottom: Theme.spacing.lg,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    alertItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.background,
    },
    severityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 10,
    },
    alertMain: {
        flex: 1,
    },
    alertType: {
        fontSize: 12,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    alertMessage: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
    },
    alertTime: {
        fontSize: 10,
        fontFamily: Theme.typography.fontFamilyMedium,
        color: Theme.colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'web' ? 70 : 100,
        paddingRight: 20,
    },
    profileMenu: {
        width: 250,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,
        ...Theme.shadows.lg,
    },
    webProfileMenu: {
        marginTop: 10,
    },
    menuHeader: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
    },
    menuUserName: {
        fontSize: 16,
        fontFamily: Theme.typography.fontFamilyBold,
        color: Theme.colors.text,
    },
    menuUserEmail: {
        fontSize: 12,
        fontFamily: Theme.typography.fontFamilyRegular,
        color: Theme.colors.textSecondary,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
    },
    menuItemText: {
        fontSize: 14,
        fontFamily: Theme.typography.fontFamilyMedium,
        color: Theme.colors.text,
        marginLeft: 10,
    },
    menuDivider: {
        height: 1,
        backgroundColor: Theme.colors.outline,
        marginVertical: 5,
    },
    complianceCard: {
        backgroundColor: '#f0fdf4',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    complianceText: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.success,
        marginTop: 4,
    },
    complianceSub: {
        fontSize: 9,
        color: Theme.colors.textSecondary,
        textAlign: 'center',
    },
    queueSection: {
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        ...Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    viewFull: {
        fontSize: 12,
        color: Theme.colors.clinical.primary,
        fontWeight: '700',
    },
    emptyQueue: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    emptyText: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
        textAlign: 'center',
        maxWidth: 200,
        lineHeight: 18,
    },
});
