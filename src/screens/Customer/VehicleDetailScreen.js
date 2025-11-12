import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getVehicleDetails } from '../../services/apiService';

const VehicleDetailScreen = ({ navigation, route }) => {
  const { vehicleId } = route.params;
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tự động refresh khi màn hình được focus (quay lại từ màn hình khác)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchVehicleDetails();
    });

    return unsubscribe;
  }, [navigation]);

  // Load dữ liệu lần đầu
  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVehicleDetails(vehicleId);
      setVehicle(response.data || response);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết xe:', err);
      setError('Không thể tải thông tin chi tiết xe.');
      setMockVehicleData();
    } finally {
      setLoading(false);
    }
  };

  const setMockVehicleData = () => {
    const mockData = {
      id: vehicleId,
      vin: 'VF8ABC12345678901',
      vehicleModel: {
        name: 'VF8',
        brand: 'VinFast'
      },
      model: 'VinFast VF8', // fallback cho trường hợp không có vehicleModel
      brand: 'VinFast',
      year: 2023,
      licensePlate: '51A-12345',
      color: 'Đỏ',
      currentMileage: 15000,
      battery: {
        name: 'Pin LFP 87.7kWh',
        capacity: 87.7,
        type: 'LFP',
        warrantyExpiry: '2028-12-31',
      },
      lastMaintenance: {
        date: '2024-03-01',
        mileage: 12000,
        location: 'VinFast Service Center Q7',
        services: ['Thay dầu', 'Kiểm tra pin', 'Cập nhật phần mềm'],
      },
      nextMaintenance: {
        date: '2024-06-01',
        mileage: 20000,
        estimatedCost: '1,200,000 VND',
      },
      owner: {
        name: 'Nguyễn Văn A',
        email: 'customer@example.com',
        phone: '0901234567',
      },
      warranty: {
        startDate: '2023-01-15',
        endDate: '2028-01-15',
        status: 'Còn hiệu lực',
      },
      status: 'active',
    };
    setVehicle(mockData);
  };

  const getStatusColor = (status) => {
    if (!status) return '#95a5a6';
    switch (status) {
      case 'active':
        return '#27ae60';
      case 'maintenance':
        return '#f39c12';
      case 'inactive':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    if (!status) return '';
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'maintenance':
        return 'Bảo trì';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status; // Hiển thị giá trị gốc nếu không khớp
    }
  };

  const handleBookMaintenance = () => {
    navigation.navigate('BookAppointmentStack', { 
      screen: 'BookAppointmentMain',
      params: { selectedVehicle: vehicle }
    });
  };

  const handleUpdateVehicle = () => {
    navigation.navigate('UpdateVehicle', { vehicleId: vehicle.id, vehicleData: vehicle });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải thông tin xe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={60} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVehicleDetails}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header thông tin trạng thái */}
        <View style={styles.header}>
          {vehicle?.status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
              <Text style={styles.statusText}>{getStatusText(vehicle.status)}</Text>
            </View>
          )}
        </View>

        {/* Thông tin cơ bản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <View style={styles.infoRow}>
            <Icon name="directions-car" size={20} color="#3498db" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Mẫu xe</Text>
              <Text style={styles.infoValue}>
                {vehicle?.vehicleModel?.brand || vehicle?.brand} {vehicle?.vehicleModel?.name || vehicle?.model}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="confirmation-number" size={20} color="#3498db" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Biển số</Text>
              <Text style={styles.infoValue}>{vehicle?.licensePlate}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={20} color="#3498db" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Năm sản xuất</Text>
              <Text style={styles.infoValue}>{vehicle?.year}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="color-lens" size={20} color="#3498db" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Màu sắc</Text>
              <Text style={styles.infoValue}>{vehicle?.color}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="speed" size={20} color="#3498db" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Số km hiện tại</Text>
              <Text style={styles.infoValue}>{vehicle?.currentMileage?.toLocaleString()} km</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="vpn-key" size={20} color="#3498db" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Số VIN</Text>
              <Text style={styles.infoValue}>{vehicle?.vin}</Text>
            </View>
          </View>
        </View>

        {/* Thông tin pin */}
        {vehicle?.battery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin pin</Text>

            <View style={styles.infoRow}>
              <Icon name="battery-charging-full" size={20} color="#27ae60" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Loại pin</Text>
                <Text style={styles.infoValue}>{vehicle.battery.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="flash-on" size={20} color="#27ae60" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Dung lượng</Text>
                <Text style={styles.infoValue}>{vehicle.battery.capacity} kWh</Text>
              </View>
            </View>

            {vehicle.battery.warrantyExpiry && (
              <View style={styles.infoRow}>
                <Icon name="shield" size={20} color="#27ae60" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Bảo hành pin</Text>
                  <Text style={styles.infoValue}>Đến {vehicle.battery.warrantyExpiry}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Lịch sử bảo trì */}
        {vehicle?.lastMaintenance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lịch sử bảo trì gần nhất</Text>

            <View style={styles.infoRow}>
              <Icon name="build" size={20} color="#f39c12" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Ngày bảo trì</Text>
                <Text style={styles.infoValue}>{vehicle.lastMaintenance.date}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="speed" size={20} color="#f39c12" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Số km khi bảo trì</Text>
                <Text style={styles.infoValue}>{vehicle.lastMaintenance.mileage?.toLocaleString()} km</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color="#f39c12" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Địa điểm</Text>
                <Text style={styles.infoValue}>{vehicle.lastMaintenance.location}</Text>
              </View>
            </View>

            {vehicle.lastMaintenance.services && (
              <View style={styles.servicesContainer}>
                <Text style={styles.servicesTitle}>Dịch vụ đã thực hiện:</Text>
                {vehicle.lastMaintenance.services.map((service, index) => (
                  <Text key={index} style={styles.serviceItem}>• {service}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Bảo trì kế tiếp */}
        {vehicle?.nextMaintenance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bảo trì kế tiếp</Text>

            <View style={styles.infoRow}>
              <Icon name="schedule" size={20} color="#e74c3c" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Dự kiến ngày</Text>
                <Text style={styles.infoValue}>{vehicle.nextMaintenance.date}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="speed" size={20} color="#e74c3c" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Số km dự kiến</Text>
                <Text style={styles.infoValue}>{vehicle.nextMaintenance.mileage?.toLocaleString()} km</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="attach-money" size={20} color="#e74c3c" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Chi phí ước tính</Text>
                <Text style={styles.infoValue}>{vehicle.nextMaintenance.estimatedCost}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Nút hành động */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleBookMaintenance}>
            <Icon name="event" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Đặt lịch bảo trì</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleUpdateVehicle}>
            <Icon name="edit" size={20} color="#3498db" />
            <Text style={styles.secondaryButtonText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
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
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  servicesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  serviceItem: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 4,
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    borderRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VehicleDetailScreen;