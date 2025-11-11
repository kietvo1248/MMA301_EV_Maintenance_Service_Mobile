// src/navigation/TechnicianTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TechnicianHomeScreen from '../screens/Technician/HomeScreen';

const Tab = createBottomTabNavigator();

export default function TechnicianTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
        headerStyle: { backgroundColor: '#27ae60' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="TechHome"
        component={TechnicianHomeScreen}
        options={{
          title: 'Lịch làm việc',
          tabBarLabel: 'Lịch',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="TechTasks"
        component={TechnicianHomeScreen}
        options={{
          title: 'Công việc',
          tabBarLabel: 'Công việc',
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="TechProfile"
        component={TechnicianHomeScreen}
        options={{
          title: 'Hồ sơ',
          tabBarLabel: 'Tôi',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}