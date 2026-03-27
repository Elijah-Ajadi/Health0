import React from 'react';
import { View, ScrollView, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../theme/Theme';
import { useTheme } from '../context/ThemeContext';

export const PageWrapper = ({ children, style, contentContainerStyle, sidebar = null, header = null, footer = null }) => {
    const { width } = useWindowDimensions();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isWeb = width > 768;

    return (
        <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.layout, { flexDirection: isWeb ? 'row' : 'column' }]}>
                {/* Sidebar for Web */}
                {isWeb && sidebar}

                <View style={[styles.mainContainer, !isWeb && { paddingTop: insets.top }]}>
                    {/* Header */}
                    {header}

                    <View style={styles.scrollWrapper}>
                        <ScrollView
                            style={[styles.scrollView, style]}
                            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                        >
                            <View style={styles.contentInner}>
                                {children}
                            </View>
                            {/* Desktop Spacer */}
                            {isWeb && <View style={{ height: 100 }} />}
                        </ScrollView>
                    </View>

                    {/* Mobile Footer/Tabs */}
                    {!isWeb && footer}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        ...Platform.select({
            web: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            },
            default: {
                width: '100%',
                height: '100%',
            }
        })
    },
    safeArea: {
        flex: 1,
        height: '100%',
    },
    layout: {
        flex: 1,
        height: '100%',
    },
    mainContainer: {
        flex: 1,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
    },
    scrollWrapper: {
        flex: 1,
        height: '100%',
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
        height: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
    contentInner: {
        paddingBottom: 60,
    }
});
