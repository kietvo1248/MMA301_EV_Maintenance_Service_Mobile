// src/navigation/HomeTabs.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StaffTabs from './StaffTabs';
import TechnicianTabs from './TechnicianTabs';

const Stack = createNativeStackNavigator();

export default function HomeTabs({ role }) {
  const normalizedRole = role?.trim().toUpperCase();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main">
        {() =>
          normalizedRole === 'STAFF' ? <StaffTabs /> : <TechnicianTabs />
        }
      </Stack.Screen>
    </Stack.Navigator>
  );
}