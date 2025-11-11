import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
      <StatusBar style="light" />
    </AuthProvider>
  );
}