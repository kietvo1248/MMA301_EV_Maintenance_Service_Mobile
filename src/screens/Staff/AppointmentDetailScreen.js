// screens/Staff/AppointmentDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getAppointmentDetails } from '../../services/Staff/staffService';

const AppointmentDetailScreen = ({ route, navigation }) => {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getAppointmentDetails(appointmentId);
        setAppointment(data);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải chi tiết lịch hẹn');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [appointmentId, navigation]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy lịch hẹn</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.statusBadge}>{appointment.status}</Text>
        <Text style={styles.time}>{formatDate(appointment.appointmentDate)}</Text>
      </View>

      {/* Thông tin khách hàng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <Text style={styles.label}>Họ tên: <Text style={styles.value}>{appointment.customer?.fullName || 'N/A'}</Text></Text>
        <Text style={styles.label}>SĐT: <Text style={styles.value}>{appointment.customer?.phoneNumber || 'N/A'}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{appointment.customer?.email || 'N/A'}</Text></Text>
        <Text style={styles.label}>Địa chỉ: <Text style={styles.value}>{appointment.customer?.address || 'N/A'}</Text></Text>
      </View>

      {/* Thông tin xe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe</Text>
        <Text style={styles.label}>Biển số: <Text style={styles.value}>{appointment.vehicle?.licensePlate || 'N/A'}</Text></Text>
        <Text style={styles.label}>Mẫu xe: <Text style={styles.value}>
          {appointment.vehicle?.vehicleModel?.brand} {appointment.vehicle?.vehicleModel?.name}
        </Text></Text>
        <Text style={styles.label}>Màu: <Text style={styles.value}>{appointment.vehicle?.color || 'N/A'}</Text></Text>
        <Text style={styles.label}>Số VIN: <Text style={styles.value}>{appointment.vehicle?.vin || 'N/A'}</Text></Text>
        <Text style={styles.label}>Năm sản xuất: <Text style={styles.value}>{appointment.vehicle?.year || 'N/A'}</Text></Text>
        <Text style={styles.label}>Số km hiện tại: <Text style={styles.value}>{appointment.vehicle?.currentMileage || 'N/A'}</Text></Text>
        {appointment.vehicle?.battery && (
          <Text style={styles.label}>Pin: <Text style={styles.value}>
            {appointment.vehicle.battery.name} ({appointment.vehicle.battery.capacityKwh} kWh)
          </Text></Text>
        )}
      </View>

      {/* Dịch vụ yêu cầu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dịch vụ yêu cầu</Text>
        {appointment.requestedServices?.length > 0 ? (
          appointment.requestedServices.map((svc, idx) => (
            <View key={svc.id} style={styles.serviceItem}>
              <Text style={styles.serviceName}>{idx + 1}. {svc.name}</Text>
              <Text style={styles.serviceDesc}>{svc.description}</Text>
              <Text style={styles.servicePrice}>Giá: {svc.price.toLocaleString('vi-VN')} VNĐ</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>Chưa có dịch vụ</Text>
        )}
      </View>

      {/* Ghi chú khách hàng */}
      {appointment.customerNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú khách hàng</Text>
          <Text style={styles.notes}>{appointment.customerNotes}</Text>
        </View>
      )}

      {/* Báo giá (nếu có) */}
      {appointment.quotation && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Báo giá</Text>
          <Text style={styles.label}>Chi phí ước tính: <Text style={styles.value}>
            {appointment.quotation.estimatedCost.toLocaleString('vi-VN')} VNĐ
          </Text></Text>
          <Text style={styles.label}>Ngày lập: <Text style={styles.value}>
            {formatDate(appointment.quotation.creationDate)}
          </Text></Text>
        </View>
      )}

      {/* Trung tâm dịch vụ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trung tâm dịch vụ</Text>
        <Text style={styles.value}>{appointment.serviceCenterName || 'N/A'}</Text>
      </View>

      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#7f8c8d' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  statusBadge: {
    backgroundColor: '#f39c12',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  time: { fontSize: 14, color: '#7f8c8d' },

  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  label: { fontSize: 15, color: '#34495e', marginBottom: 6 },
  value: { fontWeight: '600', color: '#27ae60' },
  notes: { fontSize: 15, color: '#2c3e50', fontStyle: 'italic', lineHeight: 22 },
  noData: { color: '#95a5a6', fontStyle: 'italic' },

  serviceItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
  },
  serviceName: { fontWeight: '600', color: '#2c3e50' },
  serviceDesc: { color: '#7f8c8d', fontSize: 13 },
  servicePrice: { color: '#e67e22', fontWeight: '600', marginTop: 4 },

  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AppointmentDetailScreen;