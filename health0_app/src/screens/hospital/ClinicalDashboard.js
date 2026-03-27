import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform, Modal, Pressable, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';
import { useAuth } from '../../context/AuthContext';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AlertItem = ({ type, message, time, severity }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.alertItem, { borderBottomColor: theme.colors.background }]}>
            <View style={[styles.severityDot, { backgroundColor: severity === 'high' ? theme.colors.error : theme.colors.warning }]} />
            <View style={styles.alertMain}>
                <Text style={[styles.alertType, { color: theme.colors.text }]}>{type}</Text>
                <Text style={[styles.alertMessage, { color: theme.colors.textSecondary }]} numberOfLines={1}>{message}</Text>
            </View>
            <Text style={[styles.alertTime, { color: theme.colors.textSecondary }]}>{time}</Text>
        </View>
    );
};

export default function ClinicalDashboard({ navigation }) {
    const { user, logout } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const { width } = useWindowDimensions();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Adaptive Layout Logic
    const isWeb = width > 768;
    const numColumns = width > 1000 ? 4 : width > 600 ? 2 : 1;
    const spacing = 12;
    const totalPadding = Theme.spacing.md * 2;
    const cardWidth = (width - totalPadding - ((numColumns - 1) * spacing)) / numColumns;

    const MetricCard = ({ label, value, icon, color, delay = 0 }) => {
        const scale = useSharedValue(1);
        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }]
        }));

        const handlePressIn = () => scale.value = withSpring(0.97);
        const handlePressOut = () => scale.value = withSpring(1);

        return (
            <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                entering={FadeInDown.delay(delay).springify()}
                style={[
                    styles.metricCard,
                    {
                        width: numColumns === 1 ? '100%' : cardWidth,
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.outline
                    },
                    animatedStyle
                ]}
            >
                <View style={[styles.metricIcon, { backgroundColor: color + '15' }]}>
                    <MaterialCommunityIcons name={icon} size={28} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.metricValue, { color }]}>{value}</Text>
                    <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
                </View>
            </AnimatedPressable>
        );
    };

    const Shortcut = ({ icon, label, bg, delay = 0 }) => {
        const scale = useSharedValue(1);
        const pressStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }]
        }));

        const handlePressIn = () => scale.value = withSpring(0.95);
        const handlePressOut = () => scale.value = withSpring(1);

        return (
            <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                entering={FadeInUp.delay(delay + 400).springify()}
                style={[styles.shortcut, { backgroundColor: bg }, pressStyle]}
            >
                <View style={styles.shortcutIconRing}>
                    <MaterialIcons name={icon} size={32} color="white" />
                </View>
                <Text style={styles.shortcutLabel}>{label}</Text>
            </AnimatedPressable>
        );
    };

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
                <View style={[
                    styles.profileMenu,
                    isWeb && styles.webProfileMenu,
                    { backgroundColor: theme.colors.card }
                ]}>
                    <View style={[styles.menuHeader, { borderBottomColor: theme.colors.outline }]}>
                        <Text style={[styles.menuUserName, { color: theme.colors.text }]}>{user?.first_name} {user?.last_name}</Text>
                        <Text style={[styles.menuUserEmail, { color: theme.colors.textSecondary }]}>{user?.email}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowProfileMenu(false);
                            navigation.navigate('Profile');
                        }}
                    >
                        <MaterialIcons name="person-outline" size={22} color={theme.colors.clinical.primary} />
                        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <MaterialIcons name="settings" size={22} color={theme.colors.textSecondary} />
                        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Account Settings</Text>
                    </TouchableOpacity>

                    <View style={[styles.menuDivider, { backgroundColor: theme.colors.outline }]} />

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowProfileMenu(false);
                            logout();
                        }}
                    >
                        <MaterialIcons name="logout" size={22} color={theme.colors.error} />
                        <Text style={[styles.menuItemText, { color: theme.colors.error }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );

    return (
        <PageWrapper
            header={
                <Animated.View
                    entering={FadeInDown.duration(800)}
                    style={[
                        styles.header,
                        {
                            backgroundColor: theme.colors.card,
                            borderBottomColor: theme.colors.outline
                        }
                    ]}
                >
                    <View style={[styles.headerLeft, { flex: 1 }]}>
                        <Text style={[styles.hospitalName, { color: theme.colors.text }]} numberOfLines={1}>LAGOS GENERAL HOSPITAL</Text>
                        <View style={[styles.deptBadge, { backgroundColor: theme.colors.clinical.bg }]}>
                            <Text style={styles.deptText}>CARDIOLOGY DEPT</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={[styles.statusToggle, { backgroundColor: theme.colors.background }]}
                            onPress={() => setShowProfileMenu(true)}
                        >
                            <View style={styles.onlineDot} />
                            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                                {user?.first_name ? `DR. ${user.first_name.toUpperCase()} (ON DUTY)` : 'DR. ADEMOLA (OFFLINE)'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.profileBtn}
                            onPress={() => setShowProfileMenu(true)}
                        >
                            <Image
                                source={{ uri: `https://i.pravatar.cc/150?u=${user?.id || 'health0_doc'}` }}
                                style={styles.profileThumbnail}
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={isWeb ? styles.webLayout : styles.mobileLayout}>
                {/* Main Content Area */}
                <View style={styles.mainContent}>
                    {renderProfileMenu()}
                    <Animated.Text entering={FadeInDown.delay(100)} style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>CLINICAL COMMAND CENTER</Animated.Text>

                    {/* Traffic Grid */}
                    <View style={styles.metricGrid}>
                        <MetricCard label="Admissions Today" value="12" icon="hospital-box" color={theme.colors.clinical.primary} delay={200} />
                        <MetricCard label="Appointments" value="08" icon="calendar-clock" color={theme.colors.secondary} delay={300} />
                        <MetricCard label="Pending Labs" value="24" icon="flask-outline" color={theme.colors.warning} delay={400} />
                        <MetricCard label="Critical Alerts" value="03" icon="alert-decagram" color={theme.colors.error} delay={500} />
                    </View>

                    {/* Quick Shortcuts */}
                    <View style={styles.shortcutRow}>
                        <Shortcut icon="add-circle" label="New Consultation" bg={theme.colors.clinical.primary} delay={200} />
                        <Shortcut icon="emergency" label="Emergency Reg" bg={theme.colors.error} delay={300} />
                        <Shortcut icon="history-edu" label="E-Prescription" bg={theme.colors.secondary} delay={400} />
                    </View>

                    {/* Patient Queue Placeholder */}
                    <Animated.View entering={FadeInUp.delay(600).springify()} style={[styles.queueSection, { backgroundColor: theme.colors.card }]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.subTitle, { color: theme.colors.text }]}>ACTIVE PATIENT QUEUE</Text>
                            <TouchableOpacity><Text style={[styles.viewFull, { color: theme.colors.clinical.primary }]}>View All</Text></TouchableOpacity>
                        </View>
                        <View style={styles.emptyQueue}>
                            <MaterialCommunityIcons name="account-group" size={48} color={theme.colors.outline} />
                            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>All patients have been seen. Waiting for new arrivals.</Text>
                        </View>
                    </Animated.View>
                </View>

                {/* Sidebar / Alerts Column */}
                <View style={isWeb ? styles.sidebar : styles.mobileAlerts}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>CRITICAL ALERTS</Text>
                    <View style={[styles.alertList, { backgroundColor: theme.colors.card }]}>
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

                    <View style={[
                        styles.complianceCard,
                        {
                            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4',
                            borderColor: theme.colors.success + '40'
                        }
                    ]}>
                        <MaterialIcons name="security" size={20} color={theme.colors.success} />
                        <Text style={[styles.complianceText, { color: theme.colors.success }]}>NDPA COMPLIANCE ACTIVE</Text>
                        <Text style={[styles.complianceSub, { color: theme.colors.textSecondary }]}>All interactions are being logged.</Text>
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
        paddingHorizontal: Platform.OS === 'web' ? Theme.spacing.lg : Theme.spacing.md,
        paddingVertical: Theme.spacing.md,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
        gap: 8,
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
        flexShrink: 1,
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    profileBtn: {
        padding: 2,
    },
    profileThumbnail: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Theme.colors.outline,
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
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        ...Theme.shadows.sm,
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
        height: 110,
        borderRadius: Theme.borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        ...Theme.shadows.md,
    },
    shortcutIconRing: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    shortcutLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: '900',
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
