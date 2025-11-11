// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFocusEffect } from '@react-navigation/native';

// import LoginScreen from '../screens/LoginScreen';
// import HomeScreen from '../screens/HomeScreen';
// import TechnicianListScreen from '../screens/Staff/TechnicianListScreen';
// import TechnicianHomeScreen from '../screens/Technician/HomeScreen'; // Tạm dùng HomeScreen

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // Component: Tab cho STAFF
// function StaffTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#27ae60',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: {
//           backgroundColor: 'white',
//           borderTopWidth: 1,
//           borderTopColor: '#f0f0f0',
//         },
//         headerStyle: { backgroundColor: '#27ae60' },
//         headerTintColor: '#fff',
//         headerTitleStyle: { fontWeight: 'bold' },
//       }}
//     >
//       <Tab.Screen
//         name="HomeMain"
//         component={HomeScreen}
//         options={{
//           title: 'Trang chủ',
//           tabBarLabel: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Technicians"
//         component={TechnicianListScreen}
//         options={{
//           title: 'Danh sách kỹ thuật viên',
//           tabBarLabel: 'Kỹ thuật viên',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="people-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={HomeScreen} // Thay bằng ProfileScreen sau
//         options={{
//           title: 'Hồ sơ',
//           tabBarLabel: 'Tôi',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Component: Tab cho TECHNICIAN (giao diện giống STAFF, nhưng nội dung khác)
// function TechnicianTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#27ae60',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: {
//           backgroundColor: 'white',
//           borderTopWidth: 1,
//           borderTopColor: '#f0f0f0',
//         },
//         headerStyle: { backgroundColor: '#27ae60' },
//         headerTintColor: '#fff',
//         headerTitleStyle: { fontWeight: 'bold' },
//       }}
//     >
//       <Tab.Screen
//         name="TechHome"
//         component={TechnicianHomeScreen} // Tạm dùng HomeScreen
//         options={{
//           title: 'Lịch làm việc',
//           tabBarLabel: 'Lịch',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="calendar-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="TechTasks"
//         component={TechnicianHomeScreen} // Tạm dùng
//         options={{
//           title: 'Công việc',
//           tabBarLabel: 'Công việc',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="briefcase-outline" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="TechProfile"
//         component={TechnicianHomeScreen} // Tạm dùng
//         options={{
//           title: 'Hồ sơ',
//           tabBarLabel: 'Tôi',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Main App Navigation
// export default function AppNavigation() {
//   const [userRole, setUserRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkUserRole = async () => {
//       try {
//         const userInfo = await AsyncStorage.getItem('userInfo');
//         if (userInfo) {
//           const user = JSON.parse(userInfo);
//           setUserRole(user.role); // Giả sử API trả về: { role: 'STAFF' | 'TECHNICIAN' }
//         }
//       } catch (error) {
//         console.warn('Lỗi đọc role:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUserRole();
//   }, []);

//   if (loading) {
//     return null; // Hoặc SplashScreen
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName={userRole ? 'Home' : 'Login'}
//         screenOptions={{
//           headerStyle: { backgroundColor: '#27ae60' },
//           headerTintColor: '#fff',
//           headerTitleStyle: { fontWeight: 'bold' },
//         }}
//       >
//         {/* Login Screen */}
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />

//         {/* Home dựa trên role */}
//         <Stack.Screen
//           name="Home"
//           options={{ headerShown: false }}
//         >
//           {() => (userRole === 'STAFF' ? <StaffTabs /> : <TechnicianTabs />)}
//         </Stack.Screen>

//         {/* Các màn hình riêng (nếu cần navigate từ ngoài) */}
//         <Stack.Screen
//           name="TechnicianList"
//           component={TechnicianListScreen}
//           options={{ title: 'Danh sách kỹ thuật viên' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// src/navigation/AppNavigation.js
import React from 'react';
import RootNavigator from './RootNavigator';

export default function AppNavigation() {
  return <RootNavigator />;
}