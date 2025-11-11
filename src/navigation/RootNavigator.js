// src/navigation/RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeTabs from './HomeTabs';

export default function RootNavigator() {
  const { user, loading } = useAuth(); // ← LẤY user TỪ CONTEXT

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
      {user ? <HomeTabs role={user.role} /> : <LoginScreen />}
    </NavigationContainer>
  );
}