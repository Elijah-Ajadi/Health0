import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PageWrapper } from '../../components/PageWrapper';
import { Theme } from '../../theme/Theme';
import { useAuth } from '../../context/AuthContext';
import Config from '../../config';

export default function PatientSearch({ navigation }) {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setHasSearched(true);
        try {
            const response = await fetch(`${Config.BASE_URL}/api/hospital/search/?q=${searchQuery}`, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setResults(data);
            } else {
                console.error('Search failed:', data);
            }
        } catch (error) {
            console.error('Network error during search:', error);
        } finally {
            setLoading(false);
        }
    };

    const SearchResult = ({ item }) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => navigation.navigate('Clinical', { patientId: item.id })}
        >
            <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.user.first_name} {item.user.last_name}</Text>
                <Text style={styles.resultNin}>NIN: {item.nin}</Text>
                <View style={[styles.kycBadge, { backgroundColor: Theme.colors.success + '15' }]}>
                    <MaterialIcons name="verified" size={12} color={Theme.colors.success} />
                    <Text style={[styles.kycText, { color: Theme.colors.success }]}>
                        INTERSWITCH KYC VERIFIED
                    </Text>
                </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Theme.colors.outline} />
        </TouchableOpacity>
    );

    return (
        <PageWrapper
            header={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Patient Identity Gateway</Text>
                </View>
            }
            contentContainerStyle={styles.container}
        >
            <View style={styles.searchSection}>
                <Text style={styles.label}>SEARCH NATIONAL HEALTH DATABASE</Text>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={24} color={Theme.colors.textSecondary} />
                    <TextInput
                        placeholder="Enter Name or NIN"
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                    />
                    {searchQuery.length > 0 && !loading && (
                        <TouchableOpacity onPress={handleSearch} style={styles.goButton}>
                            <Text style={styles.goText}>PULL RECORDS</Text>
                        </TouchableOpacity>
                    )}
                    {loading && <ActivityIndicator color={Theme.colors.clinical.primary} />}
                </View>
                <View style={styles.filterRow}>
                    <Text style={styles.filterText}>Quick Filters:</Text>
                    <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>NIN</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.chip}><Text style={styles.chipText}>Name</Text></TouchableOpacity>
                </View>
            </View>

            {hasSearched ? (
                <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>{results.length} MATCH{results.length !== 1 ? 'ES' : ''} FOUND</Text>
                    {results.map((item) => (
                        <SearchResult key={item.id} item={item} />
                    ))}
                    {results.length === 0 && !loading && (
                        <Text style={styles.noResults}>No patients found matching "{searchQuery}"</Text>
                    )}
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <View style={styles.illustrationBox}>
                        <MaterialCommunityIcons name="card-search" size={64} color={Theme.colors.outline} />
                    </View>
                    <Text style={styles.emptyTitle}>Secure Patient Lookup</Text>
                    <Text style={styles.emptyDesc}>Enter a patient's Name or NIN to retrieve their verified clinical history from the national Health0 ecosystem.</Text>
                </View>
            )}

            <TouchableOpacity style={styles.emergencyOverride}>
                <LinearGradient
                    colors={['#ef4444', '#dc2626']}
                    style={styles.emergencyInner}
                >
                    <MaterialIcons name="warning" size={24} color="white" />
                    <View>
                        <Text style={styles.emergencyTitle}>EMERGENCY OVERRIDE</Text>
                        <Text style={styles.emergencySub}>No PIN Access (Audit Log Triggered)</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
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
    searchSection: {
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        marginTop: 10,
        ...Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
            default: Theme.shadows.md,
        })
    },
    label: {
        fontSize: 10,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: Theme.borderRadius.lg,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    goButton: {
        backgroundColor: Theme.colors.clinical.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    goText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '900',
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    filterText: {
        fontSize: 12,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: Theme.colors.background,
        borderRadius: Theme.borderRadius.full,
        borderWidth: 1,
        borderColor: Theme.colors.outline,
    },
    chipText: {
        fontSize: 11,
        fontWeight: '700',
        color: Theme.colors.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    illustrationBox: {
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: Theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 300,
    },
    resultsSection: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: Theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: 12,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: Theme.spacing.lg,
        borderRadius: Theme.borderRadius.xl,
        justifyContent: 'space-between',
        marginBottom: 12,
        ...Platform.select({
            web: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
            default: Theme.shadows.sm,
        })
    },
    resultInfo: {
        gap: 4,
    },
    resultName: {
        fontSize: 18,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    resultNin: {
        fontSize: 13,
        color: Theme.colors.textSecondary,
        fontWeight: '600',
    },
    kycBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 4,
    },
    kycText: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    emergencyOverride: {
        marginTop: 40,
        borderRadius: Theme.borderRadius.xl,
        overflow: 'hidden',
        ...Platform.select({
            web: { boxShadow: '0 10px 15px rgba(0,0,0,0.1)' },
            default: Theme.shadows.lg,
        }),
    },
    emergencyInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    emergencyTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    emergencySub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '600',
    },
});
