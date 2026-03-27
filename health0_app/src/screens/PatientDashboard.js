import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform, ScrollView, Modal, Pressable, Linking, RefreshControl, ActivityIndicator, Alert, TextInput } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeIn, FadeOut, Layout, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Config from '../config';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PatientDashboard({ navigation }) {
    const { user, token, logout } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const { width } = useWindowDimensions();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Dynamic Data State
    const [profile, setProfile] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [recentRecords, setRecentRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);

    // New Event Form State
    const [eventTitle, setEventTitle] = useState('');
    const [eventFacility, setEventFacility] = useState('');
    const [eventNote, setEventNote] = useState('');
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
    const { toggleTheme } = useTheme();

    const isWeb = width > 768;

    const fetchData = async () => {
        try {
            const headers = { 'Authorization': `Token ${token}` };

            // 1. Fetch Profile
            const profileRes = await fetch(`${Config.BASE_URL}/api/profile/`, { headers });
            const profileData = await profileRes.json();
            if (profileRes.ok) setProfile(profileData);

            // 2. Fetch Audit Logs
            const auditRes = await fetch(`${Config.BASE_URL}/api/audit-log/`, { headers });
            const auditData = await auditRes.json();
            if (auditRes.ok) setAuditLogs(auditData.slice(0, 5));

            // 3. Fetch Records
            const recordsRes = await fetch(`${Config.BASE_URL}/api/records/`, { headers });
            const recordsData = await recordsRes.json();
            if (recordsRes.ok) setRecentRecords(recordsData.slice(0, 5));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleAddEvent = async () => {
        if (!eventTitle.trim()) {
            Alert.alert('Error', 'Please enter an event title.');
            return;
        }

        setIsSubmittingEvent(true);
        try {
            const response = await fetch(`${Config.BASE_URL}/api/records/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: eventTitle,
                    record_type: 'EVENT',
                    description: `Facility: ${eventFacility}\nNote: ${eventNote}`,
                    created_at: eventDate ? `${eventDate}T12:00:00Z` : undefined,
                    file: null
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Health event added to your clinical timeline.');
                setShowEventModal(false);
                setEventTitle('');
                setEventFacility('');
                setEventNote('');
                setEventDate(new Date().toISOString().split('T')[0]);
                fetchData();
            } else {
                const err = await response.json();
                Alert.alert('Error', JSON.stringify(err));
            }
        } catch (error) {
            console.error('Error adding event:', error);
            Alert.alert('Error', 'Failed to add health event.');
        } finally {
            setIsSubmittingEvent(false);
        }
    };
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    // --- Sub-Components ---

    const Header = () => (
        <Animated.View entering={FadeInDown.duration(800)} style={isWeb ? [styles.webHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }] : [styles.mobileHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline }]}>
            <View style={styles.headerLeft}>
                <Text style={[styles.brandText, { color: theme.colors.primary }]}>Health0</Text>
                <View style={[styles.clinicalBadge, { backgroundColor: theme.colors.clinical.bg, borderColor: theme.colors.clinical.border }]}>
                    <Text style={[styles.clinicalBadgeText, { color: theme.colors.clinical.primary }]}>SECURE CLINICAL NODE</Text>
                </View>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="notifications-none" size={24} color={theme.colors.textSecondary} />
                    <View style={styles.notifDot} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.profileBtn}
                    onPress={() => setShowProfileMenu(true)}
                >
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=' + user?.id }}
                        style={[styles.profileThumbnail, { borderColor: theme.colors.outline, borderWidth: 2 }]}
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );

    const IdentityHeader = () => (
        <Animated.View entering={FadeInDown.delay(200)} style={styles.idSection}>
            <View style={[styles.idCard, { flexDirection: isWeb ? 'row' : 'column', backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                <View style={styles.idMainInfo}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.fullName, { color: theme.colors.text }]}>
                            {profile?.user?.first_name || user?.first_name} {profile?.user?.last_name || user?.last_name}
                        </Text>
                        <MaterialIcons name="verified" size={20} color={theme.colors.secondary} />
                    </View>
                    <Text style={[styles.ninText, { color: theme.colors.textSecondary }]}>NIN: {profile?.nin || user?.patient_profile?.nin || 'Verifying...'}</Text>
                    <View style={[styles.idBadge, { backgroundColor: theme.colors.clinical.bg }]}>
                        <Text style={[styles.idBadgeText, { color: theme.colors.clinical.primary }]}>PRIMARY ID: {profile?.nin || user?.patient_profile?.nin}</Text>
                    </View>
                </View>

                <View style={[styles.qrContainer, { marginTop: isWeb ? 0 : 20 }]}>
                    <View style={[styles.qrPlaceholder, { backgroundColor: theme.colors.background, borderColor: theme.colors.outline }]}>
                        <MaterialCommunityIcons name="qrcode-scan" size={48} color={theme.colors.text} />
                    </View>
                    <Text style={[styles.qrLabel, { color: theme.colors.textSecondary }]}>SCAN FOR ACCESS</Text>
                </View>
            </View>
        </Animated.View>
    );

    const LifeSaverCard = () => (
        <Animated.View entering={FadeInDown.delay(400)} style={[styles.lifeSaverSection, { backgroundColor: isDarkMode ? theme.colors.surface : '#fffafb', borderColor: isDarkMode ? theme.colors.outline : '#fee2e2' }]}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="emergency" size={20} color={theme.colors.error} />
                <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>CRITICAL MEDICAL SNAPSHOT</Text>
            </View>

            <View style={styles.snapGrid}>
                <View style={[styles.snapItem, { borderLeftColor: theme.colors.primary, backgroundColor: isDarkMode ? theme.colors.background : 'white' }]}>
                    <Text style={styles.snapLabel}>BLOOD GROUP</Text>
                    <Text style={[styles.snapValue, { color: theme.colors.text }]}>{profile?.blood_group || user?.patient_profile?.blood_group || 'N/A'}</Text>
                    <Text style={styles.snapSub}>GENOTYPE: {profile?.genotype || user?.patient_profile?.genotype || 'N/A'}</Text>
                </View>
                <View style={[styles.snapItem, { borderLeftColor: theme.colors.error, backgroundColor: isDarkMode ? theme.colors.background : 'white' }]}>
                    <Text style={styles.snapLabel}>ACTIVE ALLERGIES</Text>
                    <Text style={[styles.snapValue, { color: theme.colors.error, fontSize: 16 }]}>
                        {profile?.allergies || user?.patient_profile?.allergies || 'NONE RECORDED'}
                    </Text>
                    <Text style={styles.snapSub}>VERIFIED RECORDS ONLY</Text>
                </View>
            </View>

            <View style={[styles.medsCard, { backgroundColor: isDarkMode ? theme.colors.background : 'white' }]}>
                <View style={styles.medsHeader}>
                    <MaterialCommunityIcons name="pill" size={18} color={theme.colors.secondary} />
                    <Text style={[styles.medsTitle, { color: theme.colors.secondary }]}>CURRENT MEDICATIONS</Text>
                </View>
                <View style={styles.medList}>
                    <Text style={[styles.medItem, { color: theme.colors.text }]}>• No active prescriptions found in vault.</Text>
                </View>
            </View>

            <TouchableOpacity style={[styles.emergencyContact, { backgroundColor: isDarkMode ? theme.colors.background : 'white', borderColor: theme.colors.outline }]}>
                <View>
                    <Text style={styles.contactLabel}>EMERGENCY CONTACT (NOK)</Text>
                    <Text style={[styles.contactName, { color: theme.colors.text }]}>Contact Support to setup NOK</Text>
                </View>
                <View style={[styles.callButton, { backgroundColor: theme.colors.primary }]}>
                    <MaterialIcons name="call" size={20} color={isDarkMode ? theme.colors.background : "white"} />
                    <Text style={[styles.callText, { color: isDarkMode ? theme.colors.background : "white" }]}>CALL</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const VitalsMonitor = () => (
        <Animated.View entering={FadeInDown.delay(600)} style={styles.vitalsSection}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="pulse" size={20} color={theme.colors.error} />
                <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>VITAL SIGNS & MONITORING</Text>
            </View>

            <View style={styles.vitalsGrid}>
                <View style={[styles.vitalBox, { backgroundColor: theme.colors.glass, borderColor: theme.colors.glassBorder, borderWidth: 1 }]}>
                    <Text style={styles.vitalLabel}>BLOOD PRESSURE</Text>
                    <Text style={[styles.vitalValue, { color: theme.colors.text }]}>120/80</Text>
                    <Text style={[styles.vitalStatus, { color: theme.colors.success }]}>STABLE</Text>
                </View>
                <View style={[styles.vitalBox, { backgroundColor: theme.colors.glass, borderColor: theme.colors.glassBorder, borderWidth: 1 }]}>
                    <Text style={styles.vitalLabel}>BODY TEMP</Text>
                    <Text style={[styles.vitalValue, { color: theme.colors.text }]}>36.5°C</Text>
                    <Text style={[styles.vitalStatus, { color: theme.colors.success }]}>NORMAL</Text>
                </View>
            </View>
        </Animated.View>
    );

    const ActivityTree = () => (
        <Animated.View entering={FadeInDown.delay(800)} style={styles.timelineSection}>
            <View style={styles.sectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialIcons name="account-tree" size={20} color={theme.colors.primary} />
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>CLINICAL TIMELINE</Text>
                </View>
                <TouchableOpacity
                    style={styles.addEventBtn}
                    onPress={() => setShowEventModal(true)}
                >
                    <MaterialIcons name="add" size={16} color="white" />
                    <Text style={styles.addEventText}>Add Event</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.timelineContainer}>
                <View style={[styles.timelineLine, { backgroundColor: theme.colors.outline }]} />

                {auditLogs.length > 0 ? auditLogs.map((log) => (
                    <View key={log.id} style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: log.action.includes('UPLOAD') ? theme.colors.success : theme.colors.secondary }]}>
                            <MaterialIcons name={log.action.includes('UPLOAD') ? "add" : "visibility"} size={10} color="white" />
                        </View>
                        <View style={[styles.timelineCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                            <View style={styles.cardTop}>
                                <Text style={[styles.timelineDate, { color: theme.colors.textSecondary }]}>
                                    {new Date(log.timestamp).toLocaleString().toUpperCase()}
                                </Text>
                                <View style={[styles.facilityTag, { backgroundColor: theme.colors.clinical.bg }]}>
                                    <Text style={[styles.facilityText, { color: theme.colors.clinical.primary }]}>
                                        {log.actor_name || 'H0 SYSTEM'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.activitySummary, { color: theme.colors.text }]}>
                                {log.action.replace(/_/g, ' ')}
                            </Text>
                        </View>
                    </View>
                )) : (
                    <Text style={{ marginLeft: 30, color: theme.colors.textSecondary }}>No audit activity recorded.</Text>
                )}
            </View>
        </Animated.View>
    );

    const HealthVaultSummary = () => (
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.vaultSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="folder-special" size={20} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>DIGITAL HEALTH VAULT</Text>
            </View>

            <View style={styles.folderRow}>
                <TouchableOpacity onPress={() => navigation.navigate('Vault')} style={[styles.folderCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                    <MaterialCommunityIcons name="folder-text" size={24} color={theme.colors.secondary} />
                    <Text style={[styles.folderName, { color: theme.colors.text }]}>Vault Assets</Text>
                    <Text style={styles.folderCount}>{recentRecords.length} Recent Files</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.subSubtitle, { color: theme.colors.textSecondary }]}>RECENT UPLOADS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewScroll}>
                {recentRecords.length > 0 ? recentRecords.map((item) => (
                    <View key={item.id} style={[styles.docPreview, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                        <View style={[styles.docThumbnail, { backgroundColor: theme.colors.background }]}>
                            <MaterialCommunityIcons
                                name={item.record_type === 'IMAGE' ? "image" : "file-pdf-box"}
                                size={32}
                                color={item.record_type === 'IMAGE' ? theme.colors.secondary : theme.colors.error}
                            />
                        </View>
                        <Text numberOfLines={1} style={[styles.docName, { color: theme.colors.text }]}>{item.title}</Text>
                        <View style={[styles.unverifiedTag, { backgroundColor: theme.colors.background }]}>
                            <Text style={[styles.unverifiedText, { color: theme.colors.primary }]}>SECURE</Text>
                        </View>
                    </View>
                )) : (
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>No recent uploads.</Text>
                )}
            </ScrollView>
        </Animated.View>
    );

    const SharingCenter = () => (
        <Animated.View entering={FadeInDown.delay(1200)} style={styles.sharingSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="share" size={20} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>SHARING & PAYMENTS (INTERSWITCH POV)</Text>
            </View>

            <View style={styles.actionGrid}>
                {/* INTERSWITCH WEBPAY POC */}
                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.secondary, borderWidth: 1.5 }]}
                    onPress={() => Alert.alert("Interswitch Webpay", "Initiating secure hospital bill payment via Interswitch...")}
                >
                    <MaterialIcons name="payment" size={24} color={theme.colors.secondary} />
                    <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Pay Medical Bills</Text>
                </TouchableOpacity>

                {/* INTERSWITCH CREDIT POC */}
                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.accent, borderWidth: 1.5 }]}
                    onPress={() => Alert.alert("Interswitch Credit", "Applying for emergency health credit via Interswitch Lending...")}
                >
                    <MaterialCommunityIcons name="finance" size={24} color={theme.colors.accent} />
                    <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Request Health Credit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}
                    onPress={() => navigation.navigate('Sharing')}
                >
                    <MaterialIcons name="email" size={24} color={theme.colors.primary} />
                    <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Secure PDF Hub</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.otpButton, { backgroundColor: theme.colors.text }]}>
                <View style={styles.otpLeft}>
                    <Text style={styles.otpLabel}>ONE-TIME ACCESS CODE (OTP)</Text>
                    <Text style={[styles.otpValue, { color: theme.colors.background }]}>GENERATED: 882 109</Text>
                </View>
                <MaterialIcons name="refresh" size={20} color={theme.colors.background} />
            </TouchableOpacity>
        </Animated.View>
    );

    const PrivacyAudit = () => (
        <Animated.View entering={FadeInDown.delay(1400)} style={styles.auditSection}>
            <View style={styles.sectionHeader}>
                <MaterialIcons name="security" size={20} color={theme.colors.secondary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>ACCESS & PRIVACY AUDIT</Text>
            </View>

            <View style={[styles.auditList, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                <View style={[styles.auditItem, { borderBottomColor: theme.colors.background }]}>
                    <View style={styles.auditInfo}>
                        <Text style={[styles.auditUser, { color: theme.colors.text }]}>General Hospital - Dr. Tunde</Text>
                        <Text style={styles.auditType}>Full Profile View</Text>
                    </View>
                    <Text style={styles.auditTime}>2h ago</Text>
                </View>
                <View style={[styles.auditItem, { borderBottomColor: theme.colors.background }]}>
                    <View style={styles.auditInfo}>
                        <Text style={[styles.auditUser, { color: theme.colors.text }]}>Lagoon Pharmacy</Text>
                        <Text style={styles.auditType}>Prescription Verification</Text>
                    </View>
                    <Text style={styles.auditTime}>Yesterday</Text>
                </View>
            </View>

            <TouchableOpacity style={[styles.revokeButton, { backgroundColor: theme.colors.error + '15', borderColor: theme.colors.error, borderWidth: 1, borderRadius: 12 }]}>
                <Text style={[styles.revokeText, { color: theme.colors.error, fontWeight: '800' }]}>REVOKE ALL EXTERNAL ACCESS</Text>
            </TouchableOpacity>
        </Animated.View>
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
                <Animated.View
                    entering={FadeIn.duration(200)}
                    style={[styles.profileMenu, isWeb && styles.webProfileMenu, { backgroundColor: theme.colors.surface }]}
                >
                    <View style={[styles.menuHeader, { borderBottomColor: theme.colors.outline }]}>
                        <Text style={[styles.menuUserName, { color: theme.colors.text }]}>
                            {profile?.user?.first_name || user?.first_name} {profile?.user?.last_name || user?.last_name}
                        </Text>
                        <Text style={[styles.menuUserEmail, { color: theme.colors.textSecondary }]}>{profile?.user?.email || user?.email}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowProfileMenu(false);
                            navigation.navigate('Profile');
                        }}
                    >
                        <MaterialIcons name="person-outline" size={22} color={theme.colors.primary} />
                        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Edit Profile</Text>
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
                                <MaterialCommunityIcons name="view-dashboard-variant" size={22} color={theme.colors.secondary} />
                                <Text style={[styles.menuItemText, { color: theme.colors.secondary }]}>Admin Dashboard</Text>
                            </TouchableOpacity>
                            <View style={[styles.menuDivider, { backgroundColor: theme.colors.outline }]} />
                        </>
                    )}

                    <TouchableOpacity style={styles.menuItem}>
                        <MaterialIcons name="settings" size={22} color={theme.colors.textSecondary} />
                        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Account Settings</Text>
                    </TouchableOpacity>

                    <View style={[styles.menuDivider, { backgroundColor: theme.colors.outline }]} />

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            toggleTheme();
                        }}
                    >
                        <MaterialIcons name={isDarkMode ? "light-mode" : "dark-mode"} size={22} color={theme.colors.warning} />
                        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </Text>
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
                </Animated.View>
            </Pressable>
        </Modal>
    );

    const AddEventModal = () => (
        <Modal
            visible={showEventModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowEventModal(false)}
        >
            <View style={styles.modalOverlayFull}>
                <Animated.View
                    entering={FadeInUp}
                    style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Log Health Event</Text>
                        <TouchableOpacity onPress={() => setShowEventModal(false)}>
                            <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>EVENT TITLE</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDarkMode ? theme.colors.background : '#f8fafc', color: theme.colors.text, borderColor: theme.colors.outline }]}
                            placeholder="e.g. Annual Medical Checkup"
                            value={eventTitle}
                            onChangeText={setEventTitle}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>EVENT DATE</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDarkMode ? theme.colors.background : '#f8fafc', color: theme.colors.text, borderColor: theme.colors.outline }]}
                            placeholder="YYYY-MM-DD"
                            value={eventDate}
                            onChangeText={setEventDate}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>MEDICAL FACILITY</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDarkMode ? theme.colors.background : '#f8fafc', color: theme.colors.text, borderColor: theme.colors.outline }]}
                            placeholder="e.g. St. Nicholas Hospital"
                            value={eventFacility}
                            onChangeText={setEventFacility}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>ADDITIONAL NOTES</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDarkMode ? theme.colors.background : '#f8fafc', color: theme.colors.text, borderColor: theme.colors.outline, height: 100, textAlignVertical: 'top' }]}
                            placeholder="Brief details about the visit..."
                            multiline
                            value={eventNote}
                            onChangeText={setEventNote}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: theme.colors.clinical.primary }]}
                        onPress={handleAddEvent}
                        disabled={isSubmittingEvent}
                    >
                        {isSubmittingEvent ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitBtnText}>Add to Clinical Record</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );

    // --- Main Layout ---

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    return (
        <PageWrapper
            header={<Header />}
            contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                <IdentityHeader />
                <LifeSaverCard />
                <VitalsMonitor />
                <ActivityTree />
                <HealthVaultSummary />
                <SharingCenter />
                <PrivacyAudit />
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Action FAB */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('Vault')}
            >
                <MaterialIcons name="add-a-photo" size={28} color={isDarkMode ? theme.colors.background : 'white'} />
            </TouchableOpacity>

            {renderProfileMenu()}
            {AddEventModal()}
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
    webHeader: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.xl,
        borderBottomWidth: 1,
    },
    mobileHeader: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.md,
        borderBottomWidth: 1,
    },
    brandText: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    clinicalBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
    },
    clinicalBadgeText: {
        fontSize: 9,
        fontWeight: '800',
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
        borderRadius: 4,
        borderWidth: 2,
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
    modalOverlayFull: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    profileMenu: {
        width: 250,
        borderRadius: 16,
        padding: 8,
        ...Theme.shadows.lg,
    },
    webProfileMenu: {
        width: 280,
    },
    menuHeader: {
        padding: 16,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    menuUserName: {
        fontSize: 16,
        fontWeight: '800',
    },
    menuUserEmail: {
        fontSize: 12,
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
    },
    menuDivider: {
        height: 1,
        marginVertical: 8,
    },
    idSection: {
        marginBottom: Theme.spacing.lg,
    },
    idCard: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Theme.shadows.sm,
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
    },
    ninText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    idBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Theme.borderRadius.full,
    },
    idBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    qrContainer: {
        alignItems: 'center',
    },
    qrPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: Theme.borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 8,
    },
    qrLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    lifeSaverSection: {
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        borderWidth: 2,
        marginBottom: Theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    snapGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Theme.spacing.md,
    },
    snapItem: {
        flex: 1,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderLeftWidth: 4,
        ...Theme.shadows.sm,
    },
    snapLabel: {
        fontSize: 9,
        fontWeight: '800',
        marginBottom: 4,
    },
    snapValue: {
        fontSize: 20,
        fontWeight: '800',
    },
    snapSub: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    medsCard: {
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
    },
    medList: {
        gap: 4,
    },
    medItem: {
        fontSize: 13,
        fontWeight: '500',
    },
    emergencyContact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
    },
    contactLabel: {
        fontSize: 9,
        fontWeight: '800',
        marginBottom: 2,
    },
    contactName: {
        fontSize: 15,
        fontWeight: '700',
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Theme.borderRadius.md,
    },
    callText: {
        fontSize: 12,
        fontWeight: '800',
    },
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
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
    },
    vitalLabel: {
        fontSize: 9,
        fontWeight: '800',
        marginBottom: 4,
    },
    vitalValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    vitalStatus: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 2,
    },
    timelineSection: {
        marginBottom: Theme.spacing.lg,
    },
    addEventBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    addEventText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '700',
    },
    timelineContainer: {
        paddingLeft: Theme.spacing.lg,
        marginTop: Theme.spacing.md,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 24,
        top: 0,
        bottom: 0,
        width: 2,
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
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    timelineCard: {
        flex: 1,
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        ...Theme.shadows.sm,
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
    },
    facilityTag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    facilityText: {
        fontSize: 8,
        fontWeight: '800',
    },
    activitySummary: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
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
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
        alignItems: 'center',
        gap: 4,
    },
    folderName: {
        fontSize: 12,
        fontWeight: '700',
    },
    folderCount: {
        fontSize: 10,
    },
    subSubtitle: {
        fontSize: 10,
        fontWeight: '800',
        marginBottom: 12,
        letterSpacing: 1,
    },
    previewScroll: {
        flexDirection: 'row',
        gap: 12,
    },
    docPreview: {
        width: 140,
        padding: 10,
        borderRadius: Theme.borderRadius.md,
        borderWidth: 1,
        marginRight: 12,
    },
    docThumbnail: {
        height: 80,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    docName: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
    },
    unverifiedTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    unverifiedText: {
        fontSize: 8,
        fontWeight: '800',
    },
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
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1.5,
        alignItems: 'center',
        gap: 8,
    },
    actionLabel: {
        fontSize: 10,
        fontWeight: '700',
        textAlign: 'center',
    },
    otpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.lg,
    },
    otpLeft: {
        gap: 2,
    },
    otpLabel: {
        fontSize: 9,
        fontWeight: '800',
    },
    otpValue: {
        fontSize: 16,
        fontWeight: '800',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    auditSection: {
        marginBottom: Theme.spacing.xxl,
    },
    auditList: {
        borderRadius: Theme.borderRadius.lg,
        borderWidth: 1,
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
    },
    auditInfo: {
        gap: 2,
    },
    auditUser: {
        fontSize: 13,
        fontWeight: '700',
    },
    auditType: {
        fontSize: 10,
    },
    auditTime: {
        fontSize: 10,
        fontWeight: '600',
    },
    revokeButton: {
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: Theme.borderRadius.md,
    },
    revokeText: {
        fontSize: 10,
        fontWeight: '800',
    },
    bottomNav: {
        height: 70,
        flexDirection: 'row',
        borderTopWidth: 1,
    },
    navTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'web' ? 30 : 100,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        minHeight: 500,
        ...Theme.shadows.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 11,
        fontWeight: '900',
        marginBottom: 8,
        letterSpacing: 1,
    },
    input: {
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    submitBtn: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginTop: 20,
        ...Theme.shadows.md,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
    },
    TextInput: {
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    ActivityIndicator: {
        marginVertical: 20,
    },
});
