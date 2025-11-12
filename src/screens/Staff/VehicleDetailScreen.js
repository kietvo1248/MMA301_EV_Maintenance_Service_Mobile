// screens/Staff/VehicleDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { getCustomerVehicles } from '../../services/Staff/staffService';

const VehicleDetailScreen = ({ route, navigation }) => {
  const { vehicleId, customer } = route.params;
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Tải chi tiết xe
  useEffect(() => {
    loadVehicleDetails();
  }, [vehicleId, customer?.id]);

  const loadVehicleDetails = async () => {
    if (!customer?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin khách hàng');
      return;
    }

    setLoading(true);
    try {
      // Gọi API lấy danh sách xe của khách hàng
      const vehicles = await getCustomerVehicles(customer.id);
      
      // Tìm xe có ID trùng với vehicleId
      const foundVehicle = vehicles.find(v => v.id === vehicleId);
      
      if (foundVehicle) {
        setVehicle(foundVehicle);
        // Tải lịch sử dịch vụ
        loadServiceHistory();
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin xe');
      }
    } catch (error) {
      console.error('Lỗi tải chi tiết xe:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin xe');
    } finally {
      setLoading(false);
    }
  };

  const loadServiceHistory = async () => {
    setLoadingHistory(true);
    try {
      // Tạm thời để trống vì không có API lịch sử dịch vụ
      // Có thể lấy từ appointments nếu có
      setServiceHistory([]);
    } catch (error) {
      console.error('Lỗi tải lịch sử dịch vụ:', error);
      setServiceHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCreateAppointment = () => {
    navigation.navigate('CreateAppointment', {
      customer,
      selectedVehicle: vehicle,
    });
  };

  const handleEditVehicle = () => {
    Alert.alert('Thông báo', 'Tính năng chỉnh sửa xe đang phát triển');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text style={styles.loadingText}>Đang tải thông tin xe...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin xe</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header với thông tin khách hàng */}
      <View style={styles.customerSection}>
        <Text style={styles.customerName}>{customer?.fullName}</Text>
        <Text style={styles.customerPhone}>SĐT: {customer?.phoneNumber}</Text>
      </View>

      {/* Thông tin cơ bản của xe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Hãng xe</Text>
            <Text style={styles.infoValue}>{vehicle.brand || vehicle.vehicleModel?.brand || 'Chưa có thông tin'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dòng xe</Text>
            <Text style={styles.infoValue}>{vehicle.model || vehicle.vehicleModel?.name || vehicle.name || 'Chưa có thông tin'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Biển số</Text>
            <Text style={styles.infoValue}>{vehicle.licensePlate || 'Chưa có thông tin'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Màu sắc</Text>
            <Text style={styles.infoValue}>{vehicle.color || 'Chưa có thông tin'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Số khung (VIN)</Text>
            <Text style={styles.infoValue}>{vehicle.vin || 'Chưa có thông tin'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Năm sản xuất</Text>
            <Text style={styles.infoValue}>{vehicle.year || 'Chưa có thông tin'}</Text>
          </View>
        </View>
      </View>

      {/* Thông số kỹ thuật */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
        <View style={styles.techSpecs}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Số km hiện tại</Text>
            <Text style={styles.specValue}>
              {vehicle.currentMileage ? `${vehicle.currentMileage.toLocaleString()} km` : 'Chưa có thông tin'}
            </Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Loại pin</Text>
            <Text style={styles.specValue}>{vehicle.battery?.name || vehicle.batteryName || 'Chưa có thông tin'}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Dung lượng pin</Text>
            <Text style={styles.specValue}>
              {vehicle.battery?.capacityKwh || vehicle.batteryCapacity ? 
                `${vehicle.battery?.capacityKwh || vehicle.batteryCapacity} kWh` : 
                'Chưa có thông tin'}
            </Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Ngày đăng ký</Text>
            <Text style={styles.specValue}>
              {vehicle.createdAt ? 
                new Date(vehicle.createdAt).toLocaleDateString('vi-VN') : 
                'Chưa có thông tin'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Thông tin pin */}
      {vehicle.battery && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin Pin</Text>
          <View style={styles.techSpecs}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Tên pin</Text>
              <Text style={styles.specValue}>{vehicle.battery.name || 'Chưa có thông tin'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Dung lượng</Text>
              <Text style={styles.specValue}>
                {vehicle.battery.capacityKwh ? `${vehicle.battery.capacityKwh} kWh` : 'Chưa có thông tin'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Điện áp</Text>
              <Text style={styles.specValue}>
                {vehicle.battery.voltage ? `${vehicle.battery.voltage} V` : 'Chưa có thông tin'}
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Mô tả</Text>
              <Text style={styles.specValue}>{vehicle.battery.description || 'Không có mô tả'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Lịch sử dịch vụ */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch sử dịch vụ</Text>
          {loadingHistory && <ActivityIndicator size="small" color="#27ae60" />}
        </View>
        
        {serviceHistory.length > 0 ? (
          <View style={styles.serviceHistory}>
            {serviceHistory.map((service, index) => (
              <View key={service.id} style={styles.serviceItem}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceDate}>
                    {new Date(service.date || service.appointmentDate).toLocaleDateString('vi-VN')}
                  </Text>
                  <Text style={[
                    styles.serviceStatus,
                    (service.status === 'COMPLETED' || service.status === 'completed') ? styles.completed : styles.pending
                  ]}>
                    {(service.status === 'COMPLETED' || service.status === 'completed') ? 'Hoàn thành' : 'Đang xử lý'}
                  </Text>
                </View>
                <Text style={styles.serviceType}>{service.serviceType || service.serviceName || 'Dịch vụ'}</Text>
                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceDetail}>
                    Số km: {service.mileage ? service.mileage.toLocaleString() : service.currentMileage?.toLocaleString() || 'N/A'}
                  </Text>
                  <Text style={styles.serviceDetail}>
                    Kỹ thuật viên: {service.technician || service.technicianName || 'Không xác định'}
                  </Text>
                  {service.cost > 0 && (
                    <Text style={styles.serviceCost}>
                      Chi phí: {service.cost.toLocaleString('vi-VN')} đ
                    </Text>
                  )}
                </View>
                {index < serviceHistory.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noHistoryText}>
            {loadingHistory ? 'Đang tải...' : 'Chưa có lịch sử dịch vụ'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  customerSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    elevation: 2,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  techSpecs: {},
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  specLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  maintenanceInfo: {},
  maintenanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  maintenanceLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  maintenanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  nextService: {
    color: '#e67e22',
  },
  serviceHistory: {},
  serviceItem: {
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  serviceStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  completed: {
    backgroundColor: '#d5f4e6',
    color: '#27ae60',
  },
  pending: {
    backgroundColor: '#fdebd0',
    color: '#e67e22',
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  serviceDetails: {},
  serviceDetail: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  serviceCost: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginTop: 12,
  },
  noHistoryText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  actionSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VehicleDetailScreen;