import { Platform } from 'react-native';

export const Theme = {
    colors: {
        primary: '#0F172A', // Deep Midnight Blue
        primaryLight: '#334155',
        secondary: '#3B82F6', // Medical Blue
        accent: '#8B5CF6', // Clinical Purple
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
        textSecondary: '#64748B',
        outline: '#E2E8F0',
        glass: 'rgba(255, 255, 255, 0.7)',
        clinical: {
            primary: '#0284c7', // Sky Blue
            secondary: '#0ea5e9',
            accent: '#0369a1',
            bg: '#f0f9ff',
            border: '#bae6fd',
        }
    },
    gradients: {
        primary: ['#1E293B', '#0F172A'],
        medical: ['#60A5FA', '#3B82F6'],
        emergency: ['#FCA5A5', '#EF4444'],
        surface: ['#FFFFFF', '#F1F5F9'],
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
        xxl: 32,
        full: 9999,
    },
    shadows: {
        sm: Platform.select({
            web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
            }
        }),
        md: Platform.select({
            web: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
            }
        }),
        lg: Platform.select({
            web: { boxShadow: '0 10px 15px rgba(0,0,0,0.15)' },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
            }
        }),
    }
};
