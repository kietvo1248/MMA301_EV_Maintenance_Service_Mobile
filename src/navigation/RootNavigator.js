// src/navigation/RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import StaffTabs from './StaffTabs';
import TechnicianTabs from './TechnicianTabs';
import AdminTabs from './AdminTabs'; // Nếu có

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user && <LoginScreen />}

      {user && user.role === 'STAFF' && <StaffTabs />}
      {user && user.role === 'TECHNICIAN' && <TechnicianTabs />}
      {user && user.role === 'ADMIN' && <AdminTabs />}
    </NavigationContainer>
  );
}
