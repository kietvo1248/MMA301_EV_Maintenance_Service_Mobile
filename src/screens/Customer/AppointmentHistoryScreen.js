import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAppointmentHistory } from '../../services/apiService';

const AppointmentHistoryScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAppointmentHistory();
      console.log('Lịch sử lịch hẹn:', response);
      setAppointments(response.data || response || []);
    } catch (error) {
      console.error('Lỗi tải lịch sử lịch hẹn:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
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
      pending: '#FF9800',
      confirmed: '#4CAF50',
      cancelled: '#F44336',
      completed: '#2196F3',
      quotation_pending: '#9C27B0',
    };
    return statusColors[status] || '#757575';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: 'schedule',
      confirmed: 'check-circle',
      cancelled: 'cancel',
      completed: 'done-all',
      quotation_pending: 'receipt',
    };
    return statusIcons[status] || 'info';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành',
      quotation_pending: 'Chờ báo giá',
    };
    return statusTexts[status] || status;
  };

  const filteredAppointments = appointments.filter(apt =>
    filterStatus === 'all' || apt.status === filterStatus
  );

  const filterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đã xác nhận', value: 'confirmed' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' },
  ];

  const formatAppointmentId = (id) => {
    if (!id) return 'N/A';
    if (typeof id === 'number' || !isNaN(id)) {
      return `#${id}`;
    }
    const idStr = String(id);
    if (idStr.length > 10) {
      return `#${idStr.substring(0, 8)}...`;
    }
    return `#${idStr}`;
  };

  const renderAppointment = (appointment) => (
    <TouchableOpacity
      key={appointment.id}
      style={styles.appointmentCard}
      onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appointment.id })}
      activeOpacity={0.7}
    >
      <View style={[styles.statusBar, { backgroundColor: getStatusColor(appointment.status) }]} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Icon name={getStatusIcon(appointment.status)} size={24} color={getStatusColor(appointment.status)} />
            <View style={styles.headerInfo}>
              <Text style={styles.appointmentId} numberOfLines={1}>
                {formatAppointmentId(appointment.bookingNumber || appointment.id)}
              </Text>
              <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                {getStatusText(appointment.status)}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#BDBDBD" />
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Icon name="event" size={18} color="#2196F3" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Ngày hẹn</Text>
              <Text style={styles.detailValue}>{formatDate(appointment.appointmentDate)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Icon name="schedule" size={18} color="#4CAF50" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Giờ hẹn</Text>
              <Text style={styles.detailValue}>{formatTime(appointment.appointmentDate)}</Text>
            </View>
          </View>

          {appointment.serviceType && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Icon name="build" size={18} color="#FF9800" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Dịch vụ</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {appointment.serviceType.name || appointment.serviceType}
                </Text>
              </View>
            </View>
          )}

          {appointment.serviceCenter && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Icon name="location-on" size={18} color="#F44336" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Trung tâm</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {appointment.serviceCenter.name || appointment.serviceCenter}
                </Text>
              </View>
            </View>
          )}

          {appointment.vehicle && (
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Icon name="directions-car" size={18} color="#9C27B0" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phương tiện</Text>
                <Text style={styles.detailValue}>
                  {appointment.vehicle.licensePlate || appointment.vehicle.model || 'Xe'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {appointment.totalPrice && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Tổng chi phí</Text>
            <Text style={styles.priceValue}>{formatCurrency(appointment.totalPrice)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Lịch sử</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{appointments.length}</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Quản lý lịch hẹn của bạn</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              filterStatus === option.value && styles.filterChipActive
            ]}
            onPress={() => setFilterStatus(option.value)}
          >
            <Text style={[
              styles.filterText,
              filterStatus === option.value && styles.filterTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      >
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Icon name="event-busy" size={80} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyText}>
              {filterStatus === 'all' ? 'Chưa có lịch hẹn nào' : 'Không có lịch hẹn'}
            </Text>
            <Text style={styles.emptySubtext}>
              {filterStatus === 'all' 
                ? 'Hãy đặt lịch bảo dưỡng cho xe của bạn'
                : 'Thử thay đổi bộ lọc để xem lịch hẹn khác'}
            </Text>
            {filterStatus === 'all' && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => navigation.navigate('BookAppointmentStack')}
                activeOpacity={0.8}
              >
                <Icon name="add" size={20} color="#FFF" />
                <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredAppointments.map(renderAppointment)
        )}
      </ScrollView>
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
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
  },
  countBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 4,
    color: '#757575',
    fontSize: 14,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statusBar: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    gap: 2,
  },
  appointmentId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  detailsSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#F8F9FE',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: -16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#424242',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AppointmentHistoryScreen;
