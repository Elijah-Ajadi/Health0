import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { PageWrapper } from '../components/PageWrapper';
import { Theme } from '../theme/Theme';
import { useAuth } from '../context/AuthContext';
import Config from '../config';

export default function VaultScreen() {
    const { token } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    // New Record Form State
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadType, setUploadType] = useState('PDF');
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: uploadType === 'PDF' ? 'application/pdf' : 'image/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                setSelectedFile(result.assets[0]);
                if (!uploadTitle) {
                    setUploadTitle(result.assets[0].name);
                }
            }
        } catch (err) {
            console.error('Picker error:', err);
            Alert.alert('Error', 'Failed to select file.');
        }
    };

    const fetchRecords = async () => {
        try {
            const response = await fetch(`${Config.BASE_URL}/api/records/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setRecords(data);
            } else {
                console.error('Failed to fetch records:', data);
            }
        } catch (error) {
            console.error('Network error fetching records:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    const handleUpload = async () => {
        if (!selectedFile) {
            Alert.alert('Error', 'Please select a file to upload.');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', uploadTitle);
            formData.append('record_type', uploadType);
            formData.append('description', 'Uploaded via Health0 Vault');

            // Create the file object
            if (Platform.OS === 'web' && selectedFile.file) {
                // Web: browser File object
                formData.append('file', selectedFile.file, selectedFile.name);
            } else {
                // Mobile: React Native file object
                const fileUri = selectedFile.uri;
                const fileName = selectedFile.name;
                const fileType = selectedFile.mimeType || (uploadType === 'PDF' ? 'application/pdf' : 'image/jpeg');

                formData.append('file', {
                    uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
                    name: fileName,
                    type: fileType,
                });
            }

            const response = await fetch(`${Config.BASE_URL}/api/records/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Health record uploaded successfully.');
                setShowUploadModal(false);
                setUploadTitle('');
                setSelectedFile(null);
                fetchRecords();
            } else {
                const errorData = await response.json();
                console.error('Upload Failed Details:', errorData);
                Alert.alert('Upload Failed', JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', 'Failed to upload record. Please check your connection.');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRecords();
    };

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
                <View style={[styles.fileIcon, { backgroundColor: type === 'IMAGE' ? '#e0f2fe' : '#fee2e2' }]}>
                    <MaterialCommunityIcons
                        name={type === 'IMAGE' ? 'image' : 'file-pdf-box'}
                        size={24}
                        color={type === 'IMAGE' ? Theme.colors.secondary : Theme.colors.error}
                    />
                </View>
                <View>
                    <Text style={styles.docTitle}>{name}</Text>
                    <Text style={styles.docSubtitle}>{new Date(date).toLocaleDateString()} • {type}</Text>
                </View>
            </View>
            <View style={styles.verifiedTag}>
                <MaterialIcons name="verified" size={12} color={Theme.colors.primary} />
                <Text style={[styles.verifiedText, { color: Theme.colors.primary }]}>SECURE</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Digital Health Vault</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowUploadModal(true)}
                    >
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
                    <Folder icon="radiology-box" name="Radiology" count={records.filter(r => r.record_type === 'IMAGE').length} color={Theme.colors.secondary} />
                    <Folder icon="test-tube" name="Lab Results" count={records.filter(r => r.record_type === 'PDF').length} color={Theme.colors.accent} />
                    <Folder icon="pill" name="Prescriptions" count="0" color={Theme.colors.success} />
                    <Folder icon="hospital-building" name="Discharge Summary" count="0" color={Theme.colors.warning} />
                </ScrollView>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>RECENT DOCUMENTS</Text>
                    <MaterialIcons name="filter-list" size={20} color={Theme.colors.textSecondary} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={Theme.colors.primary} style={{ marginTop: 40 }} />
                ) : records.length > 0 ? (
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {records.map((item) => (
                            <DocumentItem
                                key={item.id}
                                name={item.title}
                                date={item.created_at}
                                type={item.record_type}
                                verified={item.is_verified}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="folder-open-outline" size={48} color={Theme.colors.outline} />
                        <Text style={styles.emptyText}>No documents found in your vault.</Text>
                    </View>
                )}
            </View>
            {/* Upload Modal */}
            <Modal
                visible={showUploadModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowUploadModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Upload Health Record</Text>
                            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                                <MaterialIcons name="close" size={24} color={Theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Record Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Blood Test Result - Jan 2026"
                                value={uploadTitle}
                                onChangeText={setUploadTitle}
                                placeholderTextColor={Theme.colors.textSecondary}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.typeSelector}>
                                <TouchableOpacity
                                    style={[styles.typeBtn, uploadType === 'PDF' && styles.typeBtnActive]}
                                    onPress={() => setUploadType('PDF')}
                                >
                                    <MaterialCommunityIcons name="file-pdf-box" size={20} color={uploadType === 'PDF' ? 'white' : Theme.colors.textSecondary} />
                                    <Text style={[styles.typeText, uploadType === 'PDF' && styles.typeTextActive]}>Document/PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.typeBtn, uploadType === 'IMAGE' && styles.typeBtnActive]}
                                    onPress={() => setUploadType('IMAGE')}
                                >
                                    <MaterialCommunityIcons name="image-area" size={20} color={uploadType === 'IMAGE' ? 'white' : Theme.colors.textSecondary} />
                                    <Text style={[styles.typeText, uploadType === 'IMAGE' && styles.typeTextActive]}>Imaging/Scan</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.disclaimerContainer}>
                            <MaterialIcons name="info" size={18} color={Theme.colors.secondary} />
                            <Text style={styles.disclaimerText}>
                                By submitting, you confirm that this record is accurate and belongs to you.
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.fileSelector, selectedFile && { borderColor: Theme.colors.success, backgroundColor: Theme.colors.success + '08' }]}
                            onPress={pickDocument}
                        >
                            <MaterialIcons
                                name={selectedFile ? "check-circle" : "cloud-upload"}
                                size={32}
                                color={selectedFile ? Theme.colors.success : Theme.colors.primary}
                            />
                            <Text style={[styles.fileSelectorText, selectedFile && { color: Theme.colors.success }]}>
                                {selectedFile ? selectedFile.name : 'Tap to select medical file'}
                            </Text>
                            {selectedFile && (
                                <Text style={styles.fileSize}>
                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: Theme.colors.primary }]}
                            onPress={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitBtnText}>Submit to Secure Vault</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </PageWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.outline,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: Theme.colors.text,
        letterSpacing: -0.5,
    },
    addButton: {
        width: 44,
        height: 44,
        backgroundColor: Theme.colors.primary,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        ...Theme.shadows.md,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.md,
        borderRadius: Theme.borderRadius.xl,
        gap: 10,
        marginBottom: Theme.spacing.xl,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        ...Theme.shadows.sm,
    },
    searchPlaceholder: {
        color: Theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        marginBottom: Theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: Theme.spacing.md,
        paddingLeft: 4,
    },
    folderScroll: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    folderCard: {
        width: 150,
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xxl,
        marginRight: 16,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        ...Theme.shadows.md,
    },
    folderIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    folderName: {
        fontSize: 16,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    folderCount: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
        marginTop: 4,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    docItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        ...Theme.shadows.sm,
    },
    docLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    fileIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    docTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.text,
    },
    docSubtitle: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
        marginTop: 2,
        fontWeight: '500',
    },
    verifiedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f0fdf4',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dcfce7',
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.success,
    },
    userTag: {
        backgroundColor: '#fefce8',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fef9c3',
    },
    userText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#854d0e',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
        backgroundColor: 'white',
        borderRadius: Theme.borderRadius.xxl,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Theme.colors.outline,
    },
    emptyText: {
        fontSize: 15,
        color: Theme.colors.textSecondary,
        fontWeight: '700',
    },
    disclaimerContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0f2fe',
        padding: 12,
        borderRadius: 12,
        gap: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: '#0369a1',
        fontWeight: '600',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: Theme.spacing.xl,
        paddingBottom: Platform.OS === 'ios' ? 40 : Theme.spacing.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: Theme.colors.text,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        color: Theme.colors.textSecondary,
        marginBottom: 8,
        letterSpacing: 1,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Theme.colors.text,
        fontWeight: '600',
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
        backgroundColor: '#f8fafc',
    },
    typeBtnActive: {
        backgroundColor: Theme.colors.primary,
        borderColor: Theme.colors.primary,
    },
    typeText: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.textSecondary,
    },
    typeTextActive: {
        color: 'white',
    },
    fileSelector: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: Theme.colors.primary + '40',
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        gap: 12,
        marginBottom: 32,
        backgroundColor: Theme.colors.primary + '05',
    },
    fileSelectorText: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.primary,
    },
    fileSize: {
        fontSize: 11,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    submitBtn: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        ...Theme.shadows.md,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
    },
});
