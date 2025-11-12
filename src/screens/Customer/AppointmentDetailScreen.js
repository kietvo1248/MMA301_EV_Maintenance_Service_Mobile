import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAppointmentDetails, cancelAppointment } from '../../services/apiService';

const AppointmentDetailScreen = ({ navigation, route }) => {
  console.log('📍 AppointmentDetailScreen mounted');
  console.log('📋 Route params:', route?.params);
  
  const appointmentId = route?.params?.appointmentId;
  console.log('🆔 Extracted appointmentId:', appointmentId);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    console.log('🔄 useEffect triggered, appointmentId:', appointmentId);
    loadAppointmentDetail();
  }, [appointmentId]);

  const loadAppointmentDetail = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading appointment detail for ID:', appointmentId);
      
      if (!appointmentId) {
        console.error('❌ Không có appointmentId để tải chi tiết');
        Alert.alert('Lỗi', 'Không tìm thấy mã lịch hẹn');
        return;
      }
      
      const response = await getAppointmentDetails(appointmentId);
      console.log('📦 Appointment detail response:', response.data);
      
      // Xử lý response có thể là response.data hoặc response trực tiếp
    //   const appointmentData = response.data || response;
      setAppointment(response.data);
    } catch (error) {
      console.error('❌ Lỗi tải chi tiết lịch hẹn:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      Alert.alert(
        'Lỗi',
        'Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy lịch hẹn này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy lịch',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await cancelAppointment(appointmentId);
              Alert.alert(
                'Thành công',
                'Đã hủy lịch hẹn thành công',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Lỗi hủy lịch hẹn:', error);
              Alert.alert('Lỗi', 'Không thể hủy lịch hẹn. Vui lòng thử lại.');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0₫';
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: '#FF9800',
      CONFIRMED: '#4CAF50',
      CANCELLED: '#F44336',
      COMPLETED: '#2196F3',
      QUOTATION_PENDING: '#9C27B0',
      IN_PROGRESS: '#00BCD4',
    };
    return statusColors[status] || '#757575';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      PENDING: 'schedule',
      CONFIRMED: 'check-circle',
      CANCELLED: 'cancel',
      COMPLETED: 'done-all',
      QUOTATION_PENDING: 'receipt',
      IN_PROGRESS: 'build',
    };
    return statusIcons[status] || 'info';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      CANCELLED: 'Đã hủy',
      COMPLETED: 'Hoàn thành',
      QUOTATION_PENDING: 'Chờ báo giá',
      IN_PROGRESS: 'Đang thực hiện',
    };
    return statusTexts[status] || status;
  };

  const formatAppointmentId = (id) => {
    if (!id) return 'N/A';
    const idStr = String(id);
    if (idStr.length > 10) {
      return `#${idStr.substring(0, 8)}...`;
    }
    return `#${idStr}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Icon name="error-outline" size={64} color="#F44336" />
          <Text style={styles.errorText}>Không tìm thấy lịch hẹn</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const canCancel = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chi tiết lịch hẹn</Text>
          <Text style={styles.headerSubtitle}>
            {formatAppointmentId(appointment.id)}
          </Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(appointment.status) },
            ]}
          >
            <Icon
              name={getStatusIcon(appointment.status)}
              size={32}
              color="#FFFFFF"
            />
          </View>
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(appointment.status) },
            ]}
          >
            {getStatusText(appointment.status)}
          </Text>
          <Text style={styles.statusDate}>
            Đặt lúc: {formatDate(appointment.createdAt)}
          </Text>
        </View>

        {/* Appointment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin lịch hẹn</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="event" size={20} color="#2196F3" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ngày hẹn</Text>
                <Text style={styles.infoValue}>
                  {formatDate(appointment.appointmentDate)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Icon name="schedule" size={20} color="#4CAF50" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Giờ hẹn</Text>
                <Text style={styles.infoValue}>
                  {appointment.timeSlot || formatTime(appointment.appointmentDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle Info */}
        {appointment.vehicle && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin xe</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Icon name="directions-car" size={20} color="#9C27B0" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Biển số xe</Text>
                  <Text style={styles.infoValue}>
                    {appointment.vehicle.licensePlate || 'N/A'}
                  </Text>
                </View>
              </View>
              
              {appointment.vehicle.model && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Icon name="info" size={20} color="#FF9800" />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Dòng xe</Text>
                      <Text style={styles.infoValue}>
                        {appointment.vehicle.model}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* Service Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ</Text>
          <View style={styles.infoCard}>
            {appointment.requestedServices && appointment.requestedServices.length > 0 ? (
              appointment.requestedServices.map((service, index) => (
                <View key={index}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.serviceItem}>
                    <Icon name="build" size={20} color="#FF9800" />
                    <Text style={styles.serviceName}>
                      {service.serviceType?.name || service.name || 'Dịch vụ'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Icon name="build" size={20} color="#FF9800" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoValue}>Chưa có dịch vụ cụ thể</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Service Center Info */}
        {appointment.serviceCenterName && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trung tâm dịch vụ</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Icon name="location-on" size={20} color="#F44336" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoValue}>
                    {appointment.serviceCenterName}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Customer Notes */}
        {appointment.customerNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <View style={styles.infoCard}>
              <Text style={styles.notesText}>{appointment.customerNotes}</Text>
            </View>
          </View>
        )}

        {/* Total Price */}
        {appointment.totalPrice && (
          <View style={styles.priceSection}>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Tổng chi phí</Text>
              <Text style={styles.priceValue}>
                {formatCurrency(appointment.totalPrice)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {canCancel && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelAppointment}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="cancel" size={20} color="#FFFFFF" />
                <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    color: '#424242',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statusBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  serviceName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },
  notesText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  priceSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  priceCard: {
    backgroundColor: '#2196F3',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomActions: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AppointmentDetailScreen;