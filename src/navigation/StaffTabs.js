// src/navigation/StaffTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Staff/HomeScreen';
import TechnicianListScreen from '../screens/Staff/TechnicianListScreen';
import AppointmentScreen from '../screens/Staff/AppointmentScreen';
import AppointmentDetailScreen from '../screens/Staff/AppointmentDetailScreen'; // ← IMPORT
import SearchCustomerScreen from '../screens/Staff/SearchCustomerScreen';

const Tab = createBottomTabNavigator();
const AppointmentStack = createNativeStackNavigator(); // ← TẠO STACK RIÊNG

// Stack riêng cho Appointments
function AppointmentStackScreen() {
    return (
        <AppointmentStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#27ae60' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <AppointmentStack.Screen
                name="AppointmentList"
                component={AppointmentScreen}
                options={{ title: 'Danh sách lịch hẹn' }}
            />
            <AppointmentStack.Screen
                name="AppointmentDetail"
                component={AppointmentDetailScreen}
                options={{ title: 'Chi tiết lịch hẹn' }}
            />
        </AppointmentStack.Navigator>
    );
}

export default function StaffTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#27ae60',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
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

            {/* DÙNG STACK CHO APPOINTMENTS */}
            <Tab.Screen
                name="Appointments"
                component={AppointmentStackScreen} // ← DÙNG STACK
                options={{
                    headerShown: false, // Ẩn header của Tab
                    tabBarLabel: 'Lịch hẹn',
                    tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
                }}
            />

            <Tab.Screen
                name="SearchCustomer"
                component={SearchCustomerScreen}
                options={{
                    title: 'Khách hàng',
                    tabBarLabel: 'Tìm khách hàng',
                    tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}