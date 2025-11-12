import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMyVehicles, deleteVehicle } from '../../services/apiService';

const VehicleManagementScreen = ({ navigation }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchVehicles();
    }, [])
  );

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyVehicles();
      setVehicles(response.data || response);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách xe:', err);
      setError('Không thể tải danh sách xe. Vui lòng thử lại.');
      setMockVehicles();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setMockVehicles = () => {
    const mockData = [
      {
        id: 1,
        model: 'VinFast VF8',
        licensePlate: '51A-12345',
        year: '2023',
      },
      {
        id: 2,
        model: 'VinFast VF5',
        licensePlate: '81B-032.52',
        year: '2025',
      },
    ];
    setVehicles(mockData);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  const handleDeleteVehicle = (vehicleId, vehicleModel) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa xe ${vehicleModel}?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteVehicle(vehicleId);
              Alert.alert('Thành công', 'Xe đã được xóa khỏi danh sách');
              fetchVehicles();
            } catch (error) {
              console.error('Lỗi khi xóa xe:', error);
              Alert.alert('Lỗi', 'Không thể xóa xe. Vui lòng thử lại.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderVehicleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
    >
      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleTitleContainer}>
            <Text style={styles.vehicleModel}>{item.model}</Text>
            <View style={styles.vehicleBadge}>
              <Text style={styles.vehicleBadgeText}>XE ĐIỆN</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteVehicle(item.id, item.vehicleModel.brand + ' ' + item.vehicleModel.name);
            }}
          >
            <View style={styles.deleteButtonContainer}>
              <Icon name="delete-outline" size={22} color="#e74c3c" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.vehicleDetailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="directions-car" size={16} color="#3498db" style={styles.detailIcon} />
            <Text style={styles.vehiclePlate}>{item.licensePlate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color="#27ae60" style={styles.detailIcon} />
            <Text style={styles.vehicleDetail}>Năm sản xuất: {item.year}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.quickBookButton}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('BookAppointmentStack', { 
                screen: 'BookAppointmentMain',
                params: { selectedVehicle: item }
              });
            }}
          >
            <Icon name="calendar-today" size={14} color="#ffffff" />
            <Text style={styles.quickBookButtonText}>Đặt lịch bảo dưỡng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải danh sách xe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Quản lý xe của tôi</Text>
            <Text style={styles.headerSubtitle}>{vehicles.length} xe đã đăng ký</Text>
          </View>
          <TouchableOpacity
            style={styles.bookAppointmentButton}
            onPress={() => navigation.navigate('BookAppointmentStack', { screen: 'BookAppointmentMain' })}
          >
            <Icon name="calendar-today" size={20} color="#ffffff" />
            <Text style={styles.bookAppointmentButtonText}>Đặt lịch</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('CreateVehicle')}
      >
        <Icon name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookAppointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bookAppointmentButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  vehicleInfo: {
    padding: 20,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  vehicleModel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2, // giảm khoảng cách giữa model và badge
  },
  vehicleBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  vehicleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#27ae60',
    letterSpacing: 0.5,
  },
  vehicleDetailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
    width: 16,
  },
  vehiclePlate: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
  },
  vehicleDetail: {
    fontSize: 14,
    color: '#5f6c7b',
    fontWeight: '400',
  },
  quickBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  quickBookButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonContainer: {
    backgroundColor: '#fdeaea',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});

export default VehicleManagementScreen;
