// src/navigation/TechnicianTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TechnicianHomeScreen from '../screens/Technician/HomeScreen';
import TechnicianProfileScreen from '../screens/Technician/TechnicianProfileScreen';
import TechnicianTaskStack from './TechnicianTaskStack';


const Tab = createBottomTabNavigator();

export default function TechnicianTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2e7fe9ff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, 
      }}
    >
      <Tab.Screen
        name="TechHome"
        component={TechnicianHomeScreen}
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="TechTasks"
        component={TechnicianTaskStack} 
        options={{
          title: 'Công việc',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="TechProfile"
        component={TechnicianProfileScreen}
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
