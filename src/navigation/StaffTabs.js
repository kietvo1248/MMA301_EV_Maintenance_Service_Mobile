// src/navigation/StaffTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import TechnicianListScreen from '../screens/Staff/TechnicianListScreen';

const Tab = createBottomTabNavigator();

export default function StaffTabs() {
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
        name="HomeMain"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Technicians"
        component={TechnicianListScreen}
        options={{
          title: 'Danh sách kỹ thuật viên',
          tabBarLabel: 'Kỹ thuật viên',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={HomeScreen}
        options={{
          title: 'Hồ sơ',
          tabBarLabel: 'Tôi',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}