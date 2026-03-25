import React, { useState } from 'react';
import { View, Platform, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from './src/theme/Theme';

// Patient Screens
import PatientDashboard from './src/screens/PatientDashboard';
import VaultScreen from './src/screens/VaultScreen';
import SharingScreen from './src/screens/SharingScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

import ClinicalDashboard from './src/screens/hospital/ClinicalDashboard';
import PatientSearch from './src/screens/hospital/PatientSearch';
import EMRSummary from './src/screens/hospital/EMRSummary';
import OperationsScreen from './src/screens/hospital/OperationsScreen';
import HospitalAnalytics from './src/screens/hospital/HospitalAnalytics';
import DiagnosticPortal from './src/screens/hospital/DiagnosticPortal';
import ComplianceScreen from './src/screens/hospital/ComplianceScreen';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function PatientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Overview') iconName = 'dashboard';
          else if (route.name === 'Vault') iconName = 'folder';
          else if (route.name === 'Sharing') iconName = 'share';
          else if (route.name === 'Privacy') iconName = 'security';
          else if (route.name === 'Vitals') iconName = 'insights';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.colors.secondary,
        tabBarInactiveTintColor: Theme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Command') iconName = 'monitor-dashboard';
          else if (route.name === 'Gateway') iconName = 'account-search';
          else if (route.name === 'Clinical') iconName = 'clipboard-pulse';
          else if (route.name === 'Ops') iconName = 'calendar-month';
          else if (route.name === 'Intelligence') iconName = 'shield-check';

          const IconComponent = MaterialCommunityIcons;
          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.colors.clinical.primary,
        tabBarInactiveTintColor: Theme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
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
  const [role, setRole] = useState('patient');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* Dev Role Switcher */}
      {!user && (
        <View style={styles.devBanner}>
          <Text style={styles.devText}>Health0 Dev Mode: Viewing as </Text>
          <TouchableOpacity
            onPress={() => setRole(role === 'patient' ? 'hospital' : 'patient')}
            style={[styles.roleBtn, { backgroundColor: role === 'patient' ? Theme.colors.secondary : Theme.colors.clinical.primary }]}
          >
            <Text style={styles.roleBtnText}>{role.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      )}

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            user.role === 'PATIENT' ? (
              <Stack.Screen name="PatientTabs" component={PatientNavigator} />
            ) : (
              <Stack.Screen name="HospitalTabs" component={HospitalNavigator} />
            )
          ) : (
            role === 'patient' ? (
              <Stack.Screen name="Auth" component={AuthNavigator} />
            ) : (
              <Stack.Screen name="HospitalTabs" component={HospitalNavigator} />
            )
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.outline,
    ...Platform.select({
      web: { boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' },
      default: Theme.shadows.lg,
    })
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    zIndex: 100,
  },
  devText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  roleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBtnText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  }
});
