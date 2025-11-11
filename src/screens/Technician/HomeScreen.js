import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout(); // ← Context tự cập nhật user = null
            // RootNavigator tự chuyển về LoginScreen
        } catch (error) {
            console.warn('Lỗi logout:', error);
        }
    };

    return (
        <View>
            <Text>HomeScreen</Text>
            <View style={{ margin: 20, padding: 10, backgroundColor: '#f00' }}>

                <TouchableOpacity onPress={() => handleLogout()} >
                    <Text style={{ textAlign: "center", color: "white" }}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}