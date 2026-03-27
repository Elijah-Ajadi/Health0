import React, { useState, useEffect } from 'react';
import { View, Platform, Text, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeIn, FadeOut, Layout } from 'react-native-reanimated';

// Contexts & Theme
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Patient Screens
import PatientDashboard from './src/screens/PatientDashboard';
import ProfileScreen from './src/screens/ProfileScreen';
import VaultScreen from './src/screens/VaultScreen';
import SharingScreen from './src/screens/SharingScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

// Hospital Screens
import ClinicalDashboard from './src/screens/hospital/ClinicalDashboard';
import PatientSearch from './src/screens/hospital/PatientSearch';
import EMRSummary from './src/screens/hospital/EMRSummary';
import OperationsScreen from './src/screens/hospital/OperationsScreen';
import HospitalAnalytics from './src/screens/hospital/HospitalAnalytics';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

function CustomTabButton({ children, onPress, accessibilityState, activeColor, inactiveColor }) {
  const focused = accessibilityState?.selected;
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
    translateY.value = withSpring(focused ? -4 : 0);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }]
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.tabButtonContainer}
    >
      <Animated.View style={[styles.tabButtonContent, animatedStyle]}>
        {children}
      </Animated.View>
      {focused && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.tabIndicator, { backgroundColor: activeColor }]}
        />
      )}
    </TouchableOpacity>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function PatientNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: (props) => (
          <CustomTabButton
            {...props}
            activeColor={theme.colors.secondary}
            inactiveColor={theme.colors.textSecondary}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Overview') iconName = 'dashboard';
          else if (route.name === 'Vault') iconName = 'folder';
          else if (route.name === 'Sharing') iconName = 'share';
          else if (route.name === 'Privacy') iconName = 'security';
          else if (route.name === 'Vitals') iconName = 'insights';
          return <MaterialIcons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }],
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Overview" component={PatientDashboard} />
      <Tab.Screen name="Vault" component={VaultScreen} />
      <Tab.Screen name="Vitals" component={AnalyticsScreen} />
      <Tab.Screen name="Sharing" component={SharingScreen} />
      <Tab.Screen name="Privacy" component={PrivacyScreen} />
    </Tab.Navigator>
  );
}

function HospitalNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarButton: (props) => (
          <CustomTabButton
            {...props}
            activeColor={theme.colors.clinical.primary}
            inactiveColor={theme.colors.textSecondary}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Command') iconName = 'monitor-dashboard';
          else if (route.name === 'Gateway') iconName = 'account-search';
          else if (route.name === 'Clinical') iconName = 'clipboard-pulse';
          else if (route.name === 'Ops') iconName = 'calendar-month';
          else if (route.name === 'Intelligence') iconName = 'shield-check';

          return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.clinical.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline }],
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Command" component={ClinicalDashboard} />
      <Tab.Screen name="Gateway" component={PatientSearch} />
      <Tab.Screen name="Clinical" component={EMRSummary} />
      <Tab.Screen name="Ops" component={OperationsScreen} />
      <Tab.Screen name="Intelligence" component={HospitalAnalytics} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, isLoading } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />



      <NavigationContainer theme={{
        ...(isDarkMode ? NavigationDarkTheme : NavigationDefaultTheme),
        colors: {
          ...(isDarkMode ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
          primary: theme.colors.secondary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.outline,
          notification: theme.colors.error,
        }
      }}>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
          presentation: 'card'
        }}>
          {user ? (
            user.role === 'PATIENT' ? (
              <Stack.Screen name="PatientTabs" component={PatientNavigator} />
            ) : (
              <Stack.Screen name="HospitalTabs" component={HospitalNavigator} />
            )
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    borderTopWidth: 1,
    ...Platform.select({
      web: { boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' },
      default: { elevation: 10 },
    })
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonContent: {
    alignItems: 'center',
    padding: 4,
  },
  tabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  themeToggle: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    borderWidth: 1,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      default: { elevation: 5 },
    })
  }
});
