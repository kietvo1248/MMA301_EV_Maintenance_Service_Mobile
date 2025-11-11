// screens/Staff/SearchCustomerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  FlatList,
} from 'react-native';
import { searchCustomer, createCustomer, searchAppointmentsByPhone } from '../../services/Staff/staffService';

const SearchCustomerScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // === TÌM KHÁCH + TÌM LỊCH HẸN ===
  const handleSearch = async () => {
    if (!phone || phone.length < 9) {
      return Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
    }

    Keyboard.dismiss();
    setLoading(true);
    setCustomer(null);
    setShowCreateForm(false);
    setAppointments([]);
    setLoadingAppointments(false);

    try {
      const result = await searchCustomer(phone);
      if (result) {
        setCustomer(result);
        // Tìm lịch hẹn ngay khi có khách
        loadAppointments(result.phoneNumber);
      } else {
        Alert.alert(
          'Không tìm thấy',
          `SĐT ${phone} chưa có trong hệ thống.\nBạn muốn tạo khách hàng mới?`,
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Tạo mới', onPress: () => setShowCreateForm(true) },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tìm kiếm khách hàng');
    } finally {
      setLoading(false);
    }
  };

  // === TẢI LỊCH HẸN ===
  const loadAppointments = async (customerPhone) => {
    setLoadingAppointments(true);
    try {
      const results = await searchAppointmentsByPhone(customerPhone);
      setAppointments(results);
    } catch (error) {
      console.error('Lỗi tải lịch hẹn:', error);
      // Không hiện lỗi nếu không có lịch
    } finally {
      setLoadingAppointments(false);
    }
  };

  // === TẠO KHÁCH MỚI ===
  const handleCreateCustomer = async () => {
    if (!fullName.trim()) {
      return Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
    }

    setLoading(true);
    try {
      const result = await createCustomer({
        fullName,
        phoneNumber: phone,
        email: email || null,
      });

      const newCustomer = result.user;
      setCustomer(newCustomer);
      setShowCreateForm(false);
      setAppointments([]); // Khách mới → chưa có lịch

      Alert.alert(
        'Thành công',
        `Tạo khách thành công!\nMật khẩu tạm: ${result.temporaryPassword}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      const msg = error.response?.data?.message || 'Không thể tạo khách';
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (text) => setPhone(text.replace(/[^0-9]/g, ''));

  // === HÀM RENDER LỊCH HẸN ===
  const renderAppointment = ({ item }) => (
    <TouchableOpacity
      style={styles.apptCard}
      onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
    >
      <Text style={styles.apptTime}>
        {new Date(item.appointmentDate).toLocaleString('vi-VN', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <Text style={styles.apptInfo}>
        {item.vehicle.brand} {item.vehicle.model} - {item.vehicle.licensePlate}
      </Text>
      <Text style={[styles.apptStatus, { color: item.status === 'CONFIRMED' ? '#27ae60' : '#f39c12' }]}>
        {item.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang chờ'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm khách & Lịch hẹn</Text>
      <Text style={styles.subtitle}>Nhập SĐT để tra cứu</Text>

      {/* Ô tìm kiếm */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại *"
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="numeric"
          maxLength={11}
          editable={!loading}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.searchBtnText}>Tìm</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Form tạo mới */}
      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>Tạo khách hàng mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ tên *"
            value={fullName}
            onChangeText={setFullName}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email (tùy chọn)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowCreateForm(false)}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={handleCreateCustomer}
              disabled={loading}
            >
              <Text style={styles.createBtnText}>Tạo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Kết quả khách hàng */}
      {customer && (
        <>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Thông tin khách hàng</Text>
            <Text style={styles.resultText}>Tên: <Text style={styles.bold}>{customer.fullName}</Text></Text>
            <Text style={styles.resultText}>SĐT: <Text style={styles.bold}>{customer.phoneNumber}</Text></Text>
            {customer.email && (
              <Text style={styles.resultText}>Email: <Text style={styles.bold}>{customer.email}</Text></Text>
            )}
          </View>

          {/* Danh sách lịch hẹn */}
          <View style={styles.appointmentsSection}>
            <Text style={styles.sectionTitle}>Lịch hẹn</Text>

            {loadingAppointments ? (
              <ActivityIndicator size="small" color="#27ae60" />
            ) : appointments.length > 0 ? (
              <FlatList
                data={appointments}
                keyExtractor={item => item.id}
                renderItem={renderAppointment}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noAppointment}>
                <Text style={styles.noAppointmentText}>Chưa có lịch hẹn</Text>
                <TouchableOpacity
                  style={styles.createApptBtn}
                //   onPress={() => navigation.navigate('CreateAppointment', { customer })}
                >
                  <Text style={styles.createApptBtnText}>Tạo lịch hẹn</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 20 },

  searchSection: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  searchBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  createForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  formButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelBtnText: { color: '#95a5a6', fontWeight: '600' },
  createBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createBtnText: { color: '#fff', fontWeight: 'bold' },

  resultCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 16,
  },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  resultText: { fontSize: 15, color: '#34495e', marginBottom: 6 },
  bold: { fontWeight: '600', color: '#27ae60' },

  appointmentsSection: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  apptCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  apptTime: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  apptInfo: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  apptStatus: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },

  noAppointment: {
    alignItems: 'center',
    padding: 20,
  },
  noAppointmentText: {
    fontSize: 16,
    color: '#95a5a6',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  createApptBtn: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createApptBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default SearchCustomerScreen;