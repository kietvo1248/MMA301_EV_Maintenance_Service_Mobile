import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const menuItems = [
    { id: 1, title: 'Lịch bảo dưỡng', icon: 'calendar', iconSet: 'FontAwesome', color: '#e74c3c' },
    { id: 2, title: 'Kĩ thuật viên', icon: 'people', iconSet: 'Ionicons', color: '#9b59b6' },
    { id: 3, title: 'Kiểm tra khách hàng', icon: 'account-check', iconSet: 'MaterialCommunityIcons', color: '#9b59b6' },
    { id: 4, title: 'Đăng xuất', icon: 'logout', iconSet: 'MaterialIcons', color: '#e67e22' },
  ];

  const { logout } = useAuth();

  const handleMenuPress = (item) => {
    if (item.title === 'Đăng xuất') {
      handleLogout();
    } else if (item.title === 'Lịch bảo dưỡng') {
      navigation.navigate('Appointments');
    } else if (item.title === 'Kĩ thuật viên') {
      navigation.navigate('Technicians');
    } else if (item.title === 'Kiểm tra khách hàng') {
      navigation.navigate('SearchCustomer');
    } else {
      console.log(`Pressed: ${item.title}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.warn('Lỗi logout:', error);
    }
  };

  const renderIcon = (iconSet, icon, color) => {
    const iconProps = { size: 32, color: '#ffffff' };

    switch (iconSet) {
      case 'Ionicons':
        return <Ionicons name={icon} {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icon} {...iconProps} />;
      case 'FontAwesome':
        return <FontAwesome name={icon} {...iconProps} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={icon} {...iconProps} />;
      default:
        return <Ionicons name="help-circle" {...iconProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Chào mừng đến với</Text>
          <Text style={styles.appName}>EV Maintenance System</Text>
          <Text style={styles.subtitle}>Hệ thống quản lý bảo dưỡng xe điện</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              onPress={() => handleMenuPress(item)}
            >
              {renderIcon(item.iconSet, item.icon, item.color)}
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  menuTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default HomeScreen;