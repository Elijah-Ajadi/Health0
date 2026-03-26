import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../theme/Theme';
import { useAuth } from '../context/AuthContext';
import Config from '../config';
import { PageWrapper } from '../components/PageWrapper';

export default function ProfileScreen({ navigation }) {
    const { user, token, login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone_number: user?.patient_profile?.phone_number || '',
        address: user?.patient_profile?.address || '',
        blood_group: user?.patient_profile?.blood_group || '',
        genotype: user?.patient_profile?.genotype || '',
        allergies: user?.patient_profile?.allergies || '',
        confirmed_health_conditions: user?.patient_profile?.confirmed_health_conditions || '',
        nin: user?.patient_profile?.nin || '',
        dob: user?.patient_profile?.dob || '',
        gender: user?.patient_profile?.gender || ''
    });

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        if (!token) {
            console.log('DEBUG: No token available for fetchProfile');
            setLoading(false);
            return;
        }

        try {
            console.log(`DEBUG: Fetching profile with token length: ${token.length}`);
            const response = await fetch(`${Config.BASE_URL}/api/profile/`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Token ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('DEBUG: Profile data fetched successfully');
                // Merge User and Profile data
                setFormData({
                    first_name: data.user?.first_name || user?.first_name || '',
                    last_name: data.user?.last_name || user?.last_name || '',
                    email: data.user?.email || user?.email || '',
                    phone_number: data.phone_number || '',
                    address: data.address || '',
                    blood_group: data.blood_group || '',
                    genotype: data.genotype || '',
                    allergies: data.allergies || '',
                    confirmed_health_conditions: data.confirmed_health_conditions || '',
                    nin: data.nin || '',
                    dob: data.dob || '',
                    gender: data.gender || ''
                });
            } else {
                console.error(`DEBUG: Fetch failed with status ${response.status}`);
                if (response.status === 401) {
                    Alert.alert("Session Expired", "Please log in again to update your profile.");
                }
            }
        } catch (error) {
            console.error('DEBUG: Profile fetch network error:', error);
            Alert.alert("Error", "Could not load profile details.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!token) {
            Alert.alert("Error", "Authentication token missing. Please log in again.");
            return;
        }

        setSaving(true);
        try {
            console.log('DEBUG: Saving profile changes...');
            const response = await fetch(`${Config.BASE_URL}/api/profile/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Token ' + token
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                // Update local auth context with new user data (if name/email changed)
                const updatedUser = {
                    ...user,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email
                };
                await login(updatedUser, token);
                Alert.alert("Success", "Profile updated successfully.");
            } else {
                Alert.alert("Update Failed", JSON.stringify(result));
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Network Error", "Could not connect to server.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
            </View>
        );
    }

    return (
        <PageWrapper
            header={
                <LinearGradient colors={[Theme.colors.primary, Theme.colors.secondary]} style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                </LinearGradient>
            }
            contentContainerStyle={styles.scrollContent}
        >
            <Section title="Personal Information">
                <Input label="First Name" value={formData.first_name} onChange={(v) => setFormData({ ...formData, first_name: v })} icon="person-outline" />
                <Input label="Last Name" value={formData.last_name} onChange={(v) => setFormData({ ...formData, last_name: v })} icon="person-outline" />
                <Input label="Email Address" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} icon="mail-outline" keyboardType="email-address" />
                <Input label="Phone Number" value={formData.phone_number} onChange={(v) => setFormData({ ...formData, phone_number: v })} icon="phone-iphone" keyboardType="phone-pad" />
                <View style={styles.row}>
                    <Input label="Date of Birth" value={formData.dob} onChange={(v) => setFormData({ ...formData, dob: v })} icon="event" placeholder="YYYY-MM-DD" containerStyle={{ flex: 1, marginRight: 10 }} />
                    <Input label="Gender" value={formData.gender} onChange={(v) => setFormData({ ...formData, gender: v })} icon="wc" containerStyle={{ flex: 1 }} />
                </View>
            </Section>

            <Section title="Identity & Location">
                <Input label="National Identity Number (NIN)" value={formData.nin} icon="fingerprint" editable={false} />
                <Input label="Residential Address" value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} icon="location-on" multiline />
            </Section>

            <Section title="Health Status">
                <View style={styles.row}>
                    <Input label="Blood Group" value={formData.blood_group} onChange={(v) => setFormData({ ...formData, blood_group: v })} icon="opacity" containerStyle={{ flex: 1, marginRight: 10 }} />
                    <Input label="Genotype" value={formData.genotype} onChange={(v) => setFormData({ ...formData, genotype: v })} icon="grain" containerStyle={{ flex: 1 }} />
                </View>
                <Input label="Allergies" value={formData.allergies} onChange={(v) => setFormData({ ...formData, allergies: v })} icon="warning-amber" multiline />
                <Input label="Chronic Conditions" value={formData.confirmed_health_conditions} onChange={(v) => setFormData({ ...formData, confirmed_health_conditions: v })} icon="medical-services" multiline />
            </Section>

            <TouchableOpacity
                style={[styles.saveBtn, saving && styles.disabledBtn]}
                onPress={handleSave}
                disabled={saving}
            >
                {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>SAVE CHANGES</Text>}
            </TouchableOpacity>
        </PageWrapper>
    );
}

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const Input = ({ label, value, onChange, icon, multiline, keyboardType, editable = true, containerStyle }) => (
    <View style={[styles.inputGroup, containerStyle]}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputWrapper, !editable && styles.readOnlyInput]}>
            <MaterialIcons name={icon} size={20} color={!editable ? '#CBD5E1' : Theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
                style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
                value={value}
                onChangeText={onChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor={Theme.colors.textSecondary}
                multiline={multiline}
                keyboardType={keyboardType}
                editable={editable}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Theme.typography.fontFamilyBold,
        color: 'white',
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: Theme.typography.fontFamilyBold,
        color: Theme.colors.primary,
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 12,
        fontFamily: Theme.typography.fontFamilyMedium,
        color: Theme.colors.textSecondary,
        marginBottom: 6,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 12,
    },
    readOnlyInput: {
        backgroundColor: '#F1F5F9',
        borderColor: '#CBD5E1',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: Theme.colors.text,
        fontSize: 15,
        fontFamily: Theme.typography.fontFamilyRegular,
    },
    row: {
        flexDirection: 'row',
    },
    saveBtn: {
        backgroundColor: Theme.colors.primary,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    saveBtnText: {
        color: 'white',
        fontSize: 16,
        fontFamily: Theme.typography.fontFamilyBold,
        letterSpacing: 1,
    }
});
