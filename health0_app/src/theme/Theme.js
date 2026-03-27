import { Platform } from 'react-native';

const sharedTokens = {
    spacing: {
        xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
    },
    borderRadius: {
        sm: 4, md: 8, lg: 12, xl: 20, xxl: 32, full: 9999,
    },
    typography: {
        fontFamilyRegular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        fontFamilyMedium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
        fontFamilyBold: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    },
    gradients: {
        medical: ['#0EA5E9', '#2563EB'],
        primary: ['#0F172A', '#1E293B'],
        emergency: ['#F43F5E', '#E11D48'],
        success: ['#10B981', '#059669'],
        glass: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)'],
        clinical: ['#0284C7', '#0369A1'],
    }
};

export const LightTheme = {
    ...sharedTokens,
    dark: false,
    colors: {
        primary: '#0F172A',
        primaryLight: '#334155',
        secondary: '#3B82F6',
        accent: '#8B5CF6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#64748B',
        outline: '#E2E8F0',
        glass: 'rgba(255, 255, 255, 0.7)',
        glassBorder: 'rgba(255, 255, 255, 0.3)',
        clinical: {
            primary: '#0284c7',
            secondary: '#0ea5e9',
            accent: '#0369a1',
            bg: '#f0f9ff',
            border: '#bae6fd',
        }
    },
    shadows: {
        sm: Platform.select({
            web: { boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
            default: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
        }),
        md: Platform.select({
            web: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
            default: { elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 }
        }),
        lg: Platform.select({
            web: { boxShadow: '0 12px 24px rgba(0,0,0,0.12)' },
            default: { elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 }
        }),
        xl: Platform.select({
            web: { boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
            default: { elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 24 }
        }),
    }
};

export const DarkTheme = {
    ...sharedTokens,
    dark: true,
    colors: {
        primary: '#F1F5F9',
        primaryLight: '#CBD5E1',
        secondary: '#60A5FA',
        accent: '#A78BFA',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        outline: '#334155',
        glass: 'rgba(30, 41, 59, 0.7)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        clinical: {
            primary: '#0ea5e9',
            secondary: '#38bdf8',
            accent: '#7dd3fc',
            bg: '#0c4a6e',
            border: '#075985',
        }
    },
    shadows: {
        sm: { elevation: 0 },
        md: { elevation: 0 },
        lg: { elevation: 0 },
    }
};

// For backward compatibility while refactoring
export const Theme = LightTheme;
