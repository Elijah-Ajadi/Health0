import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform, ScrollView, Modal, Pressable, Linking } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';
import { useAuth } from '../context/AuthContext';

export default function PatientDashboard({ navigation }) {
    const { user, logout } = useAuth();
    const { width } = useWindowDimensions();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const isWeb = width > 768;

    // --- Sub-Components ---

    const Header = () => (
        <View style={isWeb ? styles.webHeader : styles.mobileHeader}>
            <View style={styles.headerLeft}>
                <Text style={styles.brandText}>Health0</Text>
                <View style={styles.clinicalBadge}>
                    <Text style={styles.clinicalBadgeText}>CLINICAL ENVIRONMENT</Text>
                </View>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="notifications-none" size={24} color={Theme.colors.textSecondary} />
                    <View style={styles.notifDot} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() => setShowProfileMenu(true)}
                >
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=health0_patient' }}
                        style={styles.profileThumbnail}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const IdentityHeader = () => (
        <View style={styles.idSection}>
            <View style={[styles.idCard, { flexDirection: isWeb ? 'row' : 'column' }]}>
                <View style={styles.idMainInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.fullName}>{user?.first_name} {user?.last_name}</Text>
                        <MaterialIcons name="verified" size={20} color={Theme.colors.primary} />
                    </View>
                    <Text style={styles.ninText}>NIN: {user?.patient_profile?.nin || 'Not Verified'}</Text>
                    <View style={styles.idBadge}>
                        <Text style={styles.idBadgeText}>PRIMARY ID: {user?.patient_profile?.nin}</Text>
                    </View>
                </View>

                <View style={[styles.qrContainer, { marginTop: isWeb ? 0 : 20 }]}>
                    <View style={styles.qrPlaceholder}>
                        <MaterialCommunityIcons name="qrcode-scan" size={48} color={Theme.colors.text} />
                    </View>
                    <Text style={styles.qrLabel}>SCAN FOR ACCESS</Text>
                </View>
            </View>
        </View>
    );

    const LifeSaverCard = () => (
        <View style={styles.lifeSaverSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="emergency" size={20} color={Theme.colors.error} />
                <Text style={styles.sectionTitle}>CRITICAL MEDICAL SNAPSHOT</Text>
            </View>

            <View style={styles.snapGrid}>
                <View style={[styles.snapItem, { borderLeftColor: Theme.colors.primary }]}>
                    <Text style={styles.snapLabel}>BLOOD GROUP</Text>
                    <Text style={styles.snapValue}>{user?.patient_profile?.blood_group || 'N/A'}</Text>
                    <Text style={styles.snapSub}>GENOTYPE: {user?.patient_profile?.genotype || 'N/A'}</Text>
                </View>
                <View style={[styles.snapItem, { borderLeftColor: Theme.colors.error }]}>
                    <Text style={styles.snapLabel}>ACTIVE ALLERGIES</Text>
                    <Text style={[styles.snapValue, { color: Theme.colors.error, fontSize: 16 }]}>
                        {user?.patient_profile?.allergies || 'NONE RECORDED'}
                    </Text>
                    <Text style={styles.snapSub}>VERIFIED RECORDS ONLY</Text>
                </View>
            </View>

            <View style={styles.medsCard}>
                <View style={styles.medsHeader}>
                    <MaterialCommunityIcons name="pill" size={18} color={Theme.colors.secondary} />
                    <Text style={styles.medsTitle}>CURRENT MEDICATIONS</Text>
                </View>
                <View style={styles.medList}>
                    <Text style={styles.medItem}>• No active prescriptions found in vault.</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.emergencyContact}>
                <View>
                    <Text style={styles.contactLabel}>EMERGENCY CONTACT (NOK)</Text>
                    <Text style={styles.contactName}>Contact Support to setup NOK</Text>
                </View>
                <View style={styles.callButton}>
                    <MaterialIcons name="call" size={20} color="white" />
                    <Text style={styles.callText}>CALL</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    const VitalsMonitor = () => (
        <View style={styles.vitalsSection}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="pulse" size={20} color={Theme.colors.error} />
                <Text style={styles.sectionTitle}>VITAL SIGNS & MONITORING</Text>
            </View>

            <View style={styles.vitalsGrid}>
                <View style={styles.vitalBox}>
                    <Text style={styles.vitalLabel}>BLOOD PRESSURE</Text>
                    <Text style={styles.vitalValue}>120/80</Text>
                    <Text style={styles.vitalStatus}>STABLE</Text>
                </View>
                <View style={styles.vitalBox}>
                    <Text style={styles.vitalLabel}>BODY TEMP</Text>
                    <Text style={styles.vitalValue}>36.5°C</Text>
                    <Text style={styles.vitalStatus}>NORMAL</Text>
                </View>
            </View>
        </View>
    );

    const ActivityTree = () => (
        <View style={styles.timelineSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="account-tree" size={20} color={Theme.colors.primary} />
                <Text style={styles.sectionTitle}>THE INTERACTIVE ACTIVITY TREE</Text>
            </View>

            <View style={styles.timelineContainer}>
                <View style={styles.timelineLine} />

                <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: Theme.colors.success }]}>
                        <MaterialIcons name="local-hospital" size={10} color="white" />
                    </View>
                    <View style={styles.timelineCard}>
                        <View style={styles.cardTop}>
                            <Text style={styles.timelineDate}>MARCH 22, 2026 • 11:45 AM</Text>
                            <View style={styles.facilityTag}><Text style={styles.facilityText}>ST. JUDE MEDICAL</Text></View>
                        </View>
                        <Text style={styles.activitySummary}>Post-Op Consultation: Cardiology Dept.</Text>
                        <TouchableOpacity style={styles.expandButton}>
                            <Text style={styles.expandText}>VIEW DEEP DIVE</Text>
                            <MaterialIcons name="keyboard-arrow-down" size={16} color={Theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: Theme.colors.secondary }]}>
                        <MaterialIcons name="science" size={10} color="white" />
                    </View>
                    <View style={styles.timelineCard}>
                        <View style={styles.cardTop}>
                            <Text style={styles.timelineDate}>MARCH 18, 2026 • 09:30 AM</Text>
                            <View style={[styles.facilityTag, { backgroundColor: '#f0f9ff' }]}><Text style={styles.facilityText}>DIAGNOSTIC LABS</Text></View>
                        </View>
                        <Text style={styles.activitySummary}>Advanced Lipid Panel & CBC Results</Text>
                        <View style={styles.verifiedTag}>
                            <MaterialIcons name="check-circle" size={12} color={Theme.colors.success} />
                            <Text style={styles.verifiedTagText}>HOSPITAL VERIFIED</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    const HealthVaultSummary = () => (
        <View style={styles.vaultSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="folder-special" size={20} color={Theme.colors.primary} />
                <Text style={styles.sectionTitle}>DIGITAL HEALTH VAULT</Text>
            </View>

            <View style={styles.folderRow}>
                <TouchableOpacity style={styles.folderCard}>
                    <MaterialCommunityIcons name="folder-home" size={24} color={Theme.colors.primary} />
                    <Text style={styles.folderName}>Radiology</Text>
                    <Text style={styles.folderCount}>12 Files</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.folderCard}>
                    <MaterialCommunityIcons name="folder-text" size={24} color={Theme.colors.secondary} />
                    <Text style={styles.folderName}>Lab Reports</Text>
                    <Text style={styles.folderCount}>28 Files</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.folderCard}>
                    <MaterialCommunityIcons name="folder-account" size={24} color={Theme.colors.accent} />
                    <Text style={styles.folderName}>Prescriptions</Text>
                    <Text style={styles.folderCount}>8 Files</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subSubtitle}>RECENT UPLOADS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.docPreview}>
                        <View style={styles.docThumbnail}>
                            <MaterialCommunityIcons name="file-pdf-box" size={32} color={Theme.colors.error} />
                        </View>
                        <Text style={styles.docName}>Lab_Result_{i}.pdf</Text>
                        <View style={styles.unverifiedTag}><Text style={styles.unverifiedText}>USER UPLOADED</Text></View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    const SharingCenter = () => (
        <View style={styles.sharingSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="share" size={20} color={Theme.colors.primary} />
                <Text style={styles.sectionTitle}>SHARING & RETRIEVAL CENTER</Text>
            </View>

            <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.actionCard}>
                    <MaterialIcons name="email" size={24} color={Theme.colors.primary} />
                    <Text style={styles.actionLabel}>Email Secure PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                    <MaterialIcons name="local-shipping" size={24} color={Theme.colors.secondary} />
                    <Text style={styles.actionLabel}>Physical Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}>
                    <MaterialCommunityIcons name="cellphone-key" size={24} color={Theme.colors.accent} />
                    <Text style={styles.actionLabel}>USSD Settings</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.otpButton}>
                <View style={styles.otpLeft}>
                    <Text style={styles.otpLabel}>ONE-TIME ACCESS CODE (OTP)</Text>
                    <Text style={styles.otpValue}>GENERATED: 882 109</Text>
                </View>
                <MaterialIcons name="refresh" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );

    const PrivacyAudit = () => (
        <View style={styles.auditSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="security" size={20} color={Theme.colors.secondary} />
                <Text style={styles.sectionTitle}>ACCESS & PRIVACY AUDIT</Text>
            </View>

            <View style={styles.auditList}>
                <View style={styles.auditItem}>
                    <View style={styles.auditInfo}>
                        <Text style={styles.auditUser}>General Hospital - Dr. Tunde</Text>
                        <Text style={styles.auditType}>Full Profile View</Text>
                    </View>
                    <Text style={styles.auditTime}>2h ago</Text>
                </View>
                <View style={styles.auditItem}>
                    <View style={styles.auditInfo}>
                        <Text style={styles.auditUser}>Lagoon Pharmacy</Text>
                        <Text style={styles.auditType}>Prescription Verification</Text>
                    </View>
                    <Text style={styles.auditTime}>Yesterday</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.revokeButton}>
                <Text style={styles.revokeText}>REVOKE ALL EXTERNAL ACCESS</Text>
            </TouchableOpacity>
        </View>
    );

    const Navigation = () => !isWeb && (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navTab}><MaterialIcons name="dashboard" size={24} color={Theme.colors.primary} /></TouchableOpacity>
            <TouchableOpacity style={styles.navTab}><MaterialIcons name="folder" size={24} color={Theme.colors.textSecondary} /></TouchableOpacity>
            <TouchableOpacity style={styles.navTab}><MaterialIcons name="analytics" size={24} color={Theme.colors.textSecondary} /></TouchableOpacity>
            <TouchableOpacity style={styles.navTab} onPress={() => navigation.navigate('Profile')}><MaterialIcons name="person" size={24} color={Theme.colors.textSecondary} /></TouchableOpacity>
        </View>
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
                        <MaterialIcons name="person-outline" size={22} color={Theme.colors.primary} />
                        <Text style={styles.menuItemText}>Edit Profile</Text>
                    </TouchableOpacity>

                    {(user?.role === 'ADMIN' || user?.is_staff_admin || user?.is_superuser) && (
                        <>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setShowProfileMenu(false);
                                    Linking.openURL('http://localhost:5173/');
                                }}
                            >
                                <MaterialCommunityIcons name="view-dashboard-variant" size={22} color={Theme.colors.secondary} />
                                <Text style={[styles.menuItemText, { color: Theme.colors.secondary }]}>Admin Dashboard</Text>
                            </TouchableOpacity>
                            <View style={styles.menuDivider} />
                        </>
                    )}

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

    // --- Main Layout ---

    return (
        <PageWrapper
            header={<Header />}
            footer={<Navigation />}
            contentContainerStyle={styles.container}
        >
            <IdentityHeader />
            <LifeSaverCard />
            <VitalsMonitor />
            <ActivityTree />
            <HealthVaultSummary />
            <SharingCenter />
            <PrivacyAudit />

            {/* Action FAB */}
            <TouchableOpacity style={styles.fab}>
                <MaterialIcons name="add-a-photo" size={28} color="white" />
            </TouchableOpacity>

            {renderProfileMenu()}
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

    // Header Styles
    webHeader: {
        height: 70,
        backgroundColor: Theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
    },
    mobileHeader: {
        height: 64,
        backgroundColor: Theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
    },
    brandText: {
        fontSize: 22,
        fontWeight: '900',
        color: Theme.colors.primary,
        letterSpacing: -1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    clinicalBadge: {
        backgroundColor: Theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    clinicalBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        letterSpacing: 0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    profileThumbnail: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Theme.colors.outline,
    },
    iconButton: {
        padding: 4,
        position: 'relative',
    },
    notifDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        backgroundColor: Theme.colors.error,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'white',
    },

    profileBtn: {
        padding: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'web' ? 70 : 64,
        paddingRight: 20,
    },
    profileMenu: {
        width: 250,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 8,
        elevation: 10,
        ...Platform.select({
            web: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
            }
        })
    },
    webProfileMenu: {
        width: 280,
    },
    menuHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
        marginBottom: 8,
    },
    menuUserName: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    menuUserEmail: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
        marginTop: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 12,
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    menuDivider: {
        height: 1,
        backgroundColor: Theme.colors.outline,
        marginVertical: 8,
    },

    // Identity Section Styles
    idSection: {
        marginBottom: Theme.spacing.lg,
    },
    idCard: {
        backgroundColor: Theme.colors.surface,
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            web: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
            default: { elevation: 2 }
        })
    },
    idMainInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    fullName: {
        fontSize: 24,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    ninText: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
        marginBottom: 12,
    },
    idBadge: {
        backgroundColor: '#eff6ff',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Theme.borderRadius.full,
    },
    idBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: Theme.colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    qrContainer: {
        alignItems: 'center',
    },
    qrPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: Theme.colors.background,
        borderRadius: Theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        marginBottom: 8,
    },
    qrLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        letterSpacing: 1,
    },

    // Life Saver Section Styles
    lifeSaverSection: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: '#fee2e2',
        backgroundColor: '#fffafb',
        marginBottom: Theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: Theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: Theme.colors.error,
        letterSpacing: 1,
    },
    snapGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.md,
    },
    snapItem: {
        flex: 1,
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderLeftWidth: 4,
        ...Platform.select({
            web: { boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
            default: { elevation: 1 }
        })
    },
    snapLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        marginBottom: 4,
    },
    snapValue: {
        fontSize: 20,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    snapSub: {
        fontSize: 10,
        fontWeight: '600',
        color: Theme.colors.textSecondary,
        marginTop: 2,
    },
    medsCard: {
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        marginBottom: Theme.spacing.md,
    },
    medsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    medsTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: Theme.colors.secondary,
    },
    medList: {
        gap: 4,
    },
    medItem: {
        fontSize: 13,
        color: Theme.colors.text,
        fontWeight: '500',
    },
    emergencyContact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    contactLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        marginBottom: 2,
    },
    contactName: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Theme.borderRadius.md,
    },
    callText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '800',
    },

    // Sharing Styles
    sharingSection: {
        marginBottom: Theme.spacing.lg,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 12,
        marginTop: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
    },
    actionCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        alignItems: 'center',
        gap: 8,
    },
    actionLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    otpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Theme.colors.text,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
    },
    otpLeft: {
        gap: 2,
    },
    otpLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.6)',
    },
    otpValue: {
        fontSize: 16,
        fontWeight: '800',
        color: 'white',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },

    // Audit Styles
    auditSection: {
        marginBottom: Theme.spacing.xxl,
    },
    auditList: {
        backgroundColor: 'white',
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        overflow: 'hidden',
        marginTop: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
    },
    auditItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.background,
    },
    auditUser: {
        fontSize: 13,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    auditType: {
        fontSize: 10,
        color: Theme.colors.textSecondary,
    },
    auditTime: {
        fontSize: 10,
        fontWeight: '600',
        color: Theme.colors.textSecondary,
    },
    revokeButton: {
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.error,
        borderRadius: Theme.borderRadius.md,
    },
    revokeText: {
        fontSize: 10,
        fontWeight: '800',
        color: Theme.colors.error,
    },

    // Vitals Styles
    vitalsSection: {
        marginBottom: Theme.spacing.lg,
    },
    vitalsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginTop: Theme.spacing.md,
    },
    vitalBox: {
        flex: 1,
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    vitalLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        marginBottom: 4,
    },
    vitalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    vitalStatus: {
        fontSize: 10,
        fontWeight: '700',
        color: Theme.colors.success,
        marginTop: 2,
    },

    // Navigation Styles
    bottomNav: {
        height: 70,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: Theme.colors.outline,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    navTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Timeline Styles
    timelineSection: {
        marginBottom: Theme.spacing.lg,
    },
    timelineContainer: {
        paddingLeft: Theme.spacing.lg,
        marginTop: Theme.spacing.md,
    },
    timelineLine: {
        position: 'absolute',
        left: 24,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: Theme.colors.outline,
        zIndex: -1,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: Theme.spacing.lg,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Theme.colors.primary,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    timelineCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        ...Platform.select({
            web: { boxShadow: '0 2px 5px rgba(0,0,0,0.02)' },
            default: { elevation: 1 }
        })
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    timelineDate: {
        fontSize: 10,
        fontWeight: '700',
        color: Theme.colors.textSecondary,
    },
    facilityTag: {
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    facilityText: {
        fontSize: 8,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
    },
    activitySummary: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    expandText: {
        fontSize: 10,
        fontWeight: '800',
        color: Theme.colors.primary,
    },
    verifiedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verifiedTagText: {
        fontSize: 9,
        fontWeight: '800',
        color: Theme.colors.success,
    },

    // Vault Styles
    vaultSection: {
        marginBottom: Theme.spacing.lg,
    },
    folderRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: Theme.spacing.md,
        marginBottom: Theme.spacing.md,
    },
    folderCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        alignItems: 'center',
        gap: 4,
    },
    folderName: {
        fontSize: 12,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    folderCount: {
        fontSize: 10,
        color: Theme.colors.textSecondary,
    },
    subSubtitle: {
        fontSize: 10,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        marginBottom: 12,
        letterSpacing: 1,
    },
    previewScroll: {
        flexDirection: 'row',
        gap: 12,
    },
    docPreview: {
        width: 140,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: Theme.borderRadius.md,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        marginRight: 12,
    },
    docThumbnail: {
        height: 80,
        backgroundColor: Theme.colors.background,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    docName: {
        fontSize: 11,
        fontWeight: '600',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    unverifiedTag: {
        backgroundColor: '#fff7ed',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    unverifiedText: {
        fontSize: 8,
        fontWeight: '800',
        color: '#9a3412',
    },

    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'web' ? 30 : 100, // Account for bottom nav
        right: 30,
        width: 60,
        height: 60,
        backgroundColor: Theme.colors.primary,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        ...Platform.select({
            web: { boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
            default: { elevation: 8 }
        })
    },
});
