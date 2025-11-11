import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getAppointments,
  APPOINTMENT_STATUS,
  getTechnicians,
  confirmAppointment,
  startAppointment, // ← IMPORT
} from '../../services/Staff/staffService';

const AppointmentScreen = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [appointments, setAppointments] = useState([]);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal phân công
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  // Modal bắt đầu dịch vụ
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [mileageInput, setMileageInput] = useState('');

  // === MỞ MODAL PHÂN CÔNG ===
  const openAssignModal = async (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
    setLoadingTechnicians(true);
    try {
      const data = await getTechnicians();
      setTechnicians(data);
      if (data.length > 0) setSelectedTechnician(data[0].id);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải kỹ thuật viên');
    } finally {
      setLoadingTechnicians(false);
    }
  };

  // === XÁC NHẬN PHÂN CÔNG ===
  const handleConfirmAssign = async () => {
    if (!selectedTechnician) return Alert.alert('Lỗi', 'Chọn kỹ thuật viên');
    try {
      await confirmAppointment(selectedAppointment.id, selectedTechnician);
      Alert.alert('Thành công', 'Đã phân công!');
      setModalVisible(false);
      removeAppointmentFromList(selectedAppointment.id, selectedAppointment.status);
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể phân công');
    }
  };

  // === MỞ MODAL BẮT ĐẦU DỊCH VỤ ===
  const openStartModal = (appointment) => {
    setSelectedAppointment(appointment);
    setMileageInput('');
    setStartModalVisible(true);
  };

  // === XÁC NHẬN BẮT ĐẦU DỊCH VỤ ===
  const handleStartService = async () => {
    const mileage = parseInt(mileageInput);
    if (isNaN(mileage) || mileage < 0) {
      return Alert.alert('Lỗi', 'Nhập số km hợp lệ');
    }
    try {
      await startAppointment(selectedAppointment.id, mileage);
      Alert.alert('Thành công', 'Đã check-in xe, bắt đầu dịch vụ!');
      setStartModalVisible(false);
      removeAppointmentFromList(selectedAppointment.id, selectedAppointment.status);
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể bắt đầu');
    }
  };

  // === XÓA KHỎI DANH SÁCH SAU KHI XỬ LÝ ===
  const removeAppointmentFromList = (id, status) => {
    setCache(prev => ({
      ...prev,
      [status]: prev[status]?.filter(a => a.id !== id) || [],
    }));
    if (selectedStatus === 'ALL') {
      setAppointments(prev => prev.filter(a => a.id !== id));
    } else if (selectedStatus === status) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  // === LOAD APPOINTMENTS ===
  const fetchAndCache = async (status, isRefresh = false) => {
    if (cache[status] && !isRefresh) return cache[status];
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getAppointments(status);
      setCache(prev => ({ ...prev, [status]: data }));
      return data;
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
      return [];
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedStatus === 'ALL') {
      setAppointments(Object.values(cache).flat());
    } else {
      fetchAndCache(selectedStatus).then(setAppointments);
    }
  }, [selectedStatus]);

  const onRefresh = useCallback(() => {
    setCache({});
    if (selectedStatus === 'ALL') {
      Promise.all(Object.values(APPOINTMENT_STATUS).map(s => fetchAndCache(s, true)))
        .then(results => {
          const all = results.flat();
          setAppointments(all);
          const newCache = Object.fromEntries(
            Object.keys(APPOINTMENT_STATUS).map((k, i) => [k, results[i]])
          );
          setCache(newCache);
        });
    } else {
      fetchAndCache(selectedStatus, true).then(setAppointments);
    }
  }, [selectedStatus]);

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

  const renderAppointment = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('Appointments', {
          screen: 'AppointmentDetail',
          params: { appointmentId: item.id },
        })
      }
    >
      <View style={styles.header}>
        <Text style={[styles.statusBadge, getStatusColor(item.status)]}>
          {item.status}
        </Text>
        <Text style={styles.time}>{formatDate(item.appointmentDate)}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.customerName}>
          {item.customer?.fullName || 'Khách vãng lai'}
        </Text>
        {item.customer?.phoneNumber && (
          <Text style={styles.phone}>ĐT: {item.customer.phoneNumber}</Text>
        )}
        <View style={styles.vehicleInfo}>
          <Text style={styles.licensePlate}>
            Biển số: {item.vehicle?.licensePlate || 'N/A'}
          </Text>
          <Text style={styles.vehicleModel}>
            {item.vehicle?.vehicleModel?.brand} {item.vehicle?.vehicleModel?.name}
          </Text>
        </View>
      </View>

      {/* NÚT PHÂN CÔNG */}
      {item.status === 'PENDING' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={(e) => {
              e.stopPropagation();
              openAssignModal(item);
            }}
          >
            <Text style={styles.confirmButtonText}>Phân công</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* NÚT BẮT ĐẦU DỊCH VỤ */}
      {item.status === 'CONFIRMED' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={(e) => {
              e.stopPropagation();
              openStartModal(item);
            }}
          >
            <Text style={styles.startButtonText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f39c12',
      CONFIRMED: '#27ae60',
      PENDING_APPROVAL: '#3498db',
      IN_PROGRESS: '#9b59b6',
      COMPLETED: '#2ecc71',
      CANCELLED: '#e74c3c',
    };
    return { backgroundColor: colors[status] || '#95a5a6' };
  };

  return (
    <View style={styles.container}>
      {/* Filter */}
      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>Lọc theo trạng thái:</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedStatus} onValueChange={setSelectedStatus} style={styles.picker}>
            <Picker.Item label="Tất cả" value="ALL" />
            <Picker.Item label="Đang chờ" value={APPOINTMENT_STATUS.PENDING} />
            <Picker.Item label="Đã xác nhận" value={APPOINTMENT_STATUS.CONFIRMED} />
            <Picker.Item label="Chờ duyệt" value={APPOINTMENT_STATUS.PENDING_APPROVAL} />
            <Picker.Item label="Đang thực hiện" value={APPOINTMENT_STATUS.IN_PROGRESS} />
            <Picker.Item label="Hoàn thành" value={APPOINTMENT_STATUS.COMPLETED} />
            <Picker.Item label="Đã hủy" value={APPOINTMENT_STATUS.CANCELLED} />
          </Picker>
        </View>
      </View>

      {/* Danh sách */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#27ae60" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có lịch hẹn</Text>}
          contentContainerStyle={appointments.length === 0 ? { flexGrow: 1, justifyContent: 'center', alignItems: 'center' } : null}
        />
      )}

      {/* === MODAL PHÂN CÔNG === */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Phân công kỹ thuật viên</Text>
            <Text style={styles.modalSubtitle}>
              {selectedAppointment?.customer?.fullName} - {selectedAppointment?.vehicle?.licensePlate}
            </Text>
            {loadingTechnicians ? (
              <ActivityIndicator size="small" color="#27ae60" />
            ) : technicians.length === 0 ? (
              <Text style={styles.noTechText}>Không có kỹ thuật viên</Text>
            ) : (
              <View style={styles.pickerWrapper}>
                <Picker selectedValue={selectedTechnician} onValueChange={setSelectedTechnician}>
                  {technicians.map(tech => (
                    <Picker.Item key={tech.id} label={`${tech.fullName} (${tech.employeeCode})`} value={tech.id} />
                  ))}
                </Picker>
              </View>
            )}
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleConfirmAssign}>
                <Text style={styles.confirmBtnText}>Xác nhận</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* === MODAL BẮT ĐẦU DỊCH VỤ === */}
      <Modal visible={startModalVisible} transparent animationType="fade" onRequestClose={() => setStartModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Check-in xe</Text>
            <Text style={styles.modalSubtitle}>Nhập số km hiện tại</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 25800"
              keyboardType="numeric"
              value={mileageInput}
              onChangeText={setMileageInput}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelBtn} onPress={() => setStartModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleStartService}>
                <Text style={styles.confirmBtnText}>Bắt đầu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  filterBar: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  filterLabel: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  pickerContainer: { flex: 1, marginLeft: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  picker: { height: 55 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#7f8c8d', fontSize: 16 },
  emptyText: { color: '#95a5a6', fontSize: 16, fontStyle: 'italic' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  time: { fontSize: 14, color: '#7f8c8d' },
  body: { marginBottom: 12 },
  customerName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  phone: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  vehicleInfo: { marginTop: 8 },
  licensePlate: { fontSize: 16, fontWeight: '600', color: '#27ae60' },
  vehicleModel: { fontSize: 14, color: '#34495e', marginTop: 2 },
  actionRow: { marginTop: 12, alignItems: 'flex-end' },
  confirmButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  startButton: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 16 },
  noTechText: { textAlign: 'center', color: '#e74c3c', fontStyle: 'italic' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  cancelBtnText: { color: '#95a5a6', fontWeight: '600' },
  confirmBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default AppointmentScreen;