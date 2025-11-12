// src/navigation/HomeTabs.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StaffTabs from './StaffTabs';
import TechnicianTabs from './TechnicianTabs';
import CustomerTabs from './CustomerTabs';

const Stack = createNativeStackNavigator();

export default function HomeTabs({ role }) {
  const normalizedRole = role?.trim().toUpperCase();

  const renderTabs = () => {
    switch (normalizedRole) {
      case 'STAFF':
        return <StaffTabs />;
      case 'TECHNICIAN':
        return <TechnicianTabs />;
      case 'CUSTOMER':
        return <CustomerTabs />;
      default:
        return <StaffTabs />; // Mặc định là Staff nếu không có role
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main">
        {renderTabs}
      </Stack.Screen>
    </Stack.Navigator>
  );
}