import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 📦 Import các màn hình
import CustomerHomeScreen from '../screens/Customer/HomeScreen';
import VehicleManagementScreen from '../screens/Customer/VehicleManagementScreen';
import CreateVehicleScreen from '../screens/Customer/CreateVehicleScreen';
import VehicleDetailScreen from '../screens/Customer/VehicleDetailScreen';
import UpdateVehicleScreen from '../screens/Customer/UpdateVehicleScreen';
import BookAppointmentScreen from '../screens/Customer/BookAppointmentScreen';
import AppointmentDetailScreen from '../screens/Customer/AppointmentDetailScreen'; // 👈 Thêm màn hình mới
import AppointmentHistoryScreen from '../screens/Customer/AppointmentHistoryScreen'; // 👈 Thêm màn hình mới
import ProfileScreen from '../screens/Customer/ProfileScreen';
import UpdateProfileScreen from '../screens/Customer/UpdateProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 📌 Placeholder cho Notifications
const NotificationsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Thông báo</Text>
    </View>
  );
};

// 🏠 Stack Trang chủ
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerHome"
        component={CustomerHomeScreen}
        options={{
          title: 'Trang chủ',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// 🚗 Stack Quản lý xe
function VehicleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VehicleList"
        component={VehicleManagementScreen}
        options={{
          title: 'Quản lý xe',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="CreateVehicle"
        component={CreateVehicleScreen}
        options={{
          title: 'Thêm xe mới',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="VehicleDetail"
        component={VehicleDetailScreen}
        options={{
          title: 'Chi tiết xe',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="UpdateVehicle"
        component={UpdateVehicleScreen}
        options={{
          title: 'Cập nhật thông tin xe',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// 🧰 Stack Đặt lịch bảo dưỡng
function BookAppointmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookAppointmentMain"
        component={BookAppointmentScreen}
        options={{
          title: 'Đặt lịch bảo dưỡng',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// 📅 Stack Lịch hẹn
function AppointmentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentHistory"
        component={AppointmentHistoryScreen}
        options={{
          title: 'Lịch sử lịch hẹn',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{
          title: 'Chi tiết lịch hẹn',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// 👤 Stack Tài khoản
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: 'Tài khoản',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfileScreen}
        options={{
          title: 'Cập nhật thông tin',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack.Navigator>
  );
}

// 📱 Main Tabs Component
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Trang chủ',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VehicleManagement"
        component={VehicleStack}
        options={{
          title: 'Quản lý xe',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="directions-car" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BookAppointmentStack"
        component={BookAppointmentStack}
        options={{
          title: 'Đặt lịch',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-today" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AppointmentStack"
        component={AppointmentStack}
        options={{
          title: 'Lịch sử',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: 'Tài khoản',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs;
