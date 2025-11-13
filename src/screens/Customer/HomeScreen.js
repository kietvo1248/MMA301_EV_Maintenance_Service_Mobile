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
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const menuItems = [
    { id: 1, title: 'Quản lý xe', icon: 'car', iconSet: 'Ionicons', color: '#3498db' },
    { id: 2, title: 'Đặt lịch', icon: 'calendar', iconSet: 'FontAwesome', color: '#e74c3c' },
    // { id: 3, title: 'Lịch sử bảo dưỡng', icon: 'list-alt', iconSet: 'FontAwesome', color: '#f39c12' },
    // { id: 4, title: 'Tài khoản', icon: 'person', iconSet: 'Ionicons', color: '#34495e' },
    { id: 3, title: 'Đăng xuất', icon: 'logout', iconSet: 'MaterialIcons', color: '#e67e22' },
    { id: 4, title: 'Lịch sử lịch hẹn', icon: 'history', iconSet: 'FontAwesome', color: '#1abc9c' },
  ];

  const { logout } = useAuth();

  const handleMenuPress = (item) => {
    if (item.title === 'Đăng xuất') {
      handleLogout();
    } else if (item.title === 'Quản lý xe') {
      navigation.navigate('VehicleManagement');
    } else if (item.title === 'Đặt lịch') {
      navigation.navigate('BookAppointmentStack', { screen: 'BookAppointmentMain' });
    } else if (item.title === 'Lịch sử lịch hẹn') {
      navigation.navigate('AppointmentStack', { screen: 'AppointmentHistory' });
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
      default:
        return <Ionicons name="help-circle" {...iconProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Chào mừng quý khách</Text>
            <Text style={styles.appName}>EV Maintenance System</Text>
            <Text style={styles.subtitle}>Dịch vụ bảo dưỡng xe điện chuyên nghiệp</Text>
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
  contentContainer: {
    flex: 1,
  },
  welcomeSection: {
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
    color: '#3498db',
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
    color: '#3498db',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default HomeScreen;