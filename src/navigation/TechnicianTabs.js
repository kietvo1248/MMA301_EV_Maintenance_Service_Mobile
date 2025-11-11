// src/navigation/TechnicianTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TechnicianHomeScreen from '../screens/Technician/HomeScreen';
import TechnicianTasksScreen from '../screens/Technician/TasksScreen';
import TechnicianProfileScreen from '../screens/Technician/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TechnicianTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: 'gray'
      }}
    >
      <Tab.Screen
        name="TechHome"
        component={TechnicianHomeScreen}
        options={{
          title: 'Lịch làm việc',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="TechTasks"
        component={TechnicianTasksScreen}
        options={{
          title: 'Công việc',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="TechProfile"
        component={TechnicianProfileScreen}
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
