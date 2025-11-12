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
  ScrollView,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import {
  searchCustomer,
  createCustomer,
  searchAppointmentsByPhone,
  getCustomerVehicles,
  addVehicleForCustomer,
  createWalkInAppointment,
  startAppointment,
  getTechnicians,
} from '../../services/Staff/staffService';

import {
  getVehicleModels,
  getBatteries,
} from '../../services/Staff/vehicleService';

import { getServiceTypes } from '../../services/Staff/appointmentsService';

const SearchCustomerScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // === THÊM XE ===
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingBatteries, setLoadingBatteries] = useState(false);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedBatteryId, setSelectedBatteryId] = useState('');
  const [vin, setVin] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [color, setColor] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [submittingVehicle, setSubmittingVehicle] = useState(false);

  // === CHECK-IN (LỊCH CÓ SẴN) ===
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [mileageInput, setMileageInput] = useState('');

  // === WALK-IN (TẠO MỚI) ===
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInVehicle, set_walkInVehicle] = useState(null);
  const [walkInTechnicianId, setWalkInTechnicianId] = useState('');
  const [walkInNotes, setWalkInNotes] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // === DỊCH VỤ MỚI ===
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  // === TẢI DỊCH VỤ ===
  const loadServiceTypes = async () => {
    setLoadingServices(true);
    try {
      const services = await getServiceTypes();
      setServiceTypes(services || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách dịch vụ');
      setServiceTypes([]);
    } finally {
      setLoadingServices(false);
    }
  };

  // === TẢI DÒNG XE ===
  const loadVehicleModels = async () => {
    setLoadingModels(true);
    try {
      const models = await getVehicleModels();
      setVehicleModels(models || []);
      if (models.length > 0) {
        setSelectedModelId(models[0].id);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách dòng xe');
    } finally {
      setLoadingModels(false);
    }
  };

  // === TẢI PIN KHI CHỌN MODEL ===
  useEffect(() => {
    if (selectedModelId && showAddVehicle) {
      const loadBatteriesForModel = async () => {
        setLoadingBatteries(true);
        try {
          const bats = await getBatteries(selectedModelId);
          setBatteries(bats || []);
          if (bats.length > 0) {
            setSelectedBatteryId(bats[0].id);
          }
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể tải danh sách pin');
        } finally {
          setLoadingBatteries(false);
        }
      };
      loadBatteriesForModel();
    }
  }, [selectedModelId, showAddVehicle]);

  // === MỞ FORM THÊM XE ===
  const openAddVehicle = () => {
    setShowAddVehicle(true);
    loadVehicleModels();
    setVin('');
    setYear('');
    setLicensePlate('');
    setColor('');
    setCurrentMileage('');
  };

  // === ĐÓNG FORM ===
  const closeAddVehicle = () => {
    setShowAddVehicle(false);
    setVehicleModels([]);
    setBatteries([]);
    setSelectedModelId('');
    setSelectedBatteryId('');
  };

  // === THÊM XE ===
  const handleAddVehicle = async () => {
    if (!vin.trim() || !year || !licensePlate.trim() || !color.trim() || !currentMileage) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    }

    const yearNum = parseInt(year);
    const mileageNum = parseFloat(currentMileage);

    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      return Alert.alert('Lỗi', 'Năm sản xuất không hợp lệ');
    }

    if (isNaN(mileageNum) || mileageNum < 0) {
      return Alert.alert('Lỗi', 'Số km phải là số không âm');
    }

    setSubmittingVehicle(true);
    try {
      await addVehicleForCustomer(customer.id, {
        vin: vin.trim(),
        year: yearNum,
        vehicleModelId: selectedModelId,
        batteryId: selectedBatteryId,
        licensePlate: licensePlate.trim().toUpperCase(),
        color: color.trim(),
        currentMileage: mileageNum,
      });

      Alert.alert('Thành công', 'Thêm xe thành công!', [
        {
          text: 'OK',
          onPress: () => {
            closeAddVehicle();
            loadCustomerData(customer.id, customer.phoneNumber);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể thêm xe');
    } finally {
      setSubmittingVehicle(false);
    }
  };

  // === TÌM KHÁCH ===
  const handleSearch = async () => {
    if (!phone || phone.length < 9) {
      return Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
    }

    Keyboard.dismiss();
    setLoading(true);
    setCustomer(null);
    setVehicles([]);
    setShowCreateForm(false);
    setAppointments([]);
    setLoadingAppointments(false);
    setLoadingVehicles(false);

    try {
      const result = await searchCustomer(phone);
      if (result) {
        setCustomer(result);
        loadCustomerData(result.id, result.phoneNumber);
      } else {
        Alert.alert(
          'Không tìm thấy',
          `SĐT ${phone} chưa có trong hệ thống.\nBạn muốn tạo khách hàng mới?`,
          [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Tạo mới',
              onPress: () => {
                resetCreateForm();
                setShowCreateForm(true);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tìm kiếm khách hàng');
    } finally {
      setLoading(false);
    }
  };

  // === TẢI DỮ LIỆU KHÁCH ===
  const loadCustomerData = async (customerId, customerPhone) => {
    setLoadingVehicles(true);
    try {
      const vehicleList = await getCustomerVehicles(customerId);
      setVehicles(Array.isArray(vehicleList) ? vehicleList : []);
    } catch (error) {
      console.error('Lỗi tải danh sách xe:', error);
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }

    setLoadingAppointments(true);
    try {
      const results = await searchAppointmentsByPhone(customerPhone);
      setAppointments(results || []);
    } catch (error) {
      console.error('Lỗi tải lịch hẹn:', error);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // === TẠO KHÁCH MỚI ===
  const resetCreateForm = () => {
    setFullName('');
    setEmail('');
  };

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
      setVehicles([]);
      setAppointments([]);

      Alert.alert(
        'Thành công',
        `Tạo khách thành công!\nMật khẩu tạm: ${result.temporaryPassword}`,
        [{
          text: 'OK',
          onPress: () => {
            setPhone(newCustomer.phoneNumber);
            handleSearch();
          }
        }]
      );
    } catch (error) {
      const msg = error.response?.data?.message || 'Không thể tạo khách';
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (text) => setPhone(text.replace(/[^0-9]/g, ''));

  // === TẢI KỸ THUẬT VIÊN ===
  const loadTechnicians = async () => {
    setLoadingTechnicians(true);
    try {
      const techs = await getTechnicians();
      setTechnicians(Array.isArray(techs) ? techs : []);
      if (techs.length > 0) {
        setWalkInTechnicianId(techs[0].id);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách kỹ thuật viên');
    } finally {
      setLoadingTechnicians(false);
    }
  };

  // === MỞ MODAL CHECK-IN (LỊCH CÓ SẴN) ===
  const openStartModal = (appointment) => {
    setSelectedAppointment(appointment);
    setMileageInput('');
    setShowStartModal(true);
  };

  // === XỬ LÝ CHECK-IN ===
  const handleStartAppointment = async () => {
    const mileage = parseFloat(mileageInput);
    if (isNaN(mileage) || mileage < 0) {
      return Alert.alert('Lỗi', 'Số km không hợp lệ');
    }

    setSubmitting(true);
    try {
      await startAppointment(selectedAppointment.id, mileage);
      Alert.alert(
        'Thành công',
        'Check-in xe thành công! Bắt đầu dịch vụ.',
        [{
          text: 'OK',
          onPress: () => {
            setShowStartModal(false);
            loadCustomerData(customer.id, customer.phoneNumber);
          }
        }]
      );
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể check-in');
    } finally {
      setSubmitting(false);
    }
  };

  // === MỞ MODAL WALK-IN ===
  const openWalkInModal = () => {
    if (vehicles.length === 0) {
      return Alert.alert('Lỗi', 'Khách chưa có xe. Vui lòng thêm xe trước.');
    }
    set_walkInVehicle(vehicles[0]);
    setWalkInNotes('');
    setSelectedServices([]); // Reset dịch vụ đã chọn
    loadTechnicians();
    loadServiceTypes(); // Tải danh sách dịch vụ
    setShowWalkInModal(true);
  };

  // === XỬ LÝ CHỌN/BỎ CHỌN DỊCH VỤ ===
  const toggleServiceSelection = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        // Nếu đã chọn thì bỏ chọn
        return prev.filter(id => id !== serviceId);
      } else {
        // Nếu chưa chọn thì thêm vào
        return [...prev, serviceId];
      }
    });
  };

  // === XỬ LÝ WALK-IN ===
  const handleWalkIn = async () => {
    if (!walkInVehicle) return Alert.alert('Lỗi', 'Chọn xe');
    if (!walkInTechnicianId) return Alert.alert('Lỗi', 'Chọn kỹ thuật viên');
    if (selectedServices.length === 0) return Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 dịch vụ');

    setSubmitting(true);
    try {
      const payload = {
        customerId: customer.id,
        vehicleId: walkInVehicle.id,
        appointmentDate: new Date().toISOString(),
        requestedServices: selectedServices,
        technicianId: walkInTechnicianId,
        customerNotes: walkInNotes,
      };

      const result = await createWalkInAppointment(payload);

      Alert.alert(
        'Thành công',
        'Tạo lịch Walk-in & bắt đầu dịch vụ!',
        [{
          text: 'Xem chi tiết',
          onPress: () => {
            setShowWalkInModal(false);
            navigation.navigate('AppointmentDetail', {
              appointmentId: result.appointment.id,
            });
          }
        }]
      );
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo Walk-in');
    } finally {
      setSubmitting(false);
    }
  };

  // === RENDER DỊCH VỤ ===
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.serviceItem,
        selectedServices.includes(item.id) && styles.serviceItemSelected
      ]}
      onPress={() => toggleServiceSelection(item.id)}
    >
      <Text style={[
        styles.serviceName,
        selectedServices.includes(item.id) && styles.serviceNameSelected
      ]}>
        {item.name}
      </Text>
      {item.description && (
        <Text style={styles.serviceDescription}>{item.description}</Text>
      )}
    </TouchableOpacity>
  );

  // === RENDER XE ===
  const renderVehicle = ({ item }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => {
       
        navigation.navigate('VehicleDetail', {
          vehicleId: item.id,
          customer: customer,
        });
      }}
    >
      <Text style={styles.vehicleTitle}>
        {item.brand} - {item.model}
      </Text>
      <Text style={styles.vehicleInfo}>Biển số: {item.licensePlate}</Text>
      <Text style={styles.vehicleInfo}>Màu: {item.color}</Text>
      <Text style={styles.vehicleInfo}>KM hiện tại: {item.currentMileage.toLocaleString()} km</Text>

      <Text style={styles.vehicleBattery}>
        Pin: {item.batteryName} - ({item.batteryCapacity} kWh)
      </Text>

    </TouchableOpacity>
  );

  // === RENDER LỊCH HẸN ===
  const renderAppointment = ({ item }) => (
    <TouchableOpacity
      style={styles.apptCard}
      onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.apptTime}>
            {new Date(item.appointmentDate).toLocaleString('vi-VN', {
              weekday: 'short', day: '2-digit', month: '2-digit',
              hour: '2-digit', minute: '2-digit',
            })}
          </Text>
          <Text style={styles.apptInfo}>
            {item.vehicle?.brand} {item.vehicle?.model} - {item.vehicle?.licensePlate}
          </Text>
          <Text style={[styles.apptStatus, { color: '#27ae60' }]}>
            {item.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang chờ'}
          </Text>
        </View>

        {/* NÚT CHECK-IN */}
        {item.status === 'CONFIRMED' && (
          <TouchableOpacity
            style={styles.checkInBtn}
            onPress={(e) => {
              e.stopPropagation();
              openStartModal(item);
            }}
          >
            <Text style={styles.checkInBtnText}>Check-in</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
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

        {/* Form tạo khách mới */}
        {showCreateForm && (
          <View style={styles.createForm}>
            <Text style={styles.formTitle}>Tạo khách hàng mới</Text>
            <TextInput style={styles.input} placeholder="Họ tên *" value={fullName} onChangeText={setFullName} editable={!loading} />
            <TextInput style={styles.input} placeholder="Email (tùy chọn)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCreateForm(false)} disabled={loading}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreateCustomer} disabled={loading}>
                <Text style={styles.createBtnText}>Tạo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Kết quả khách */}
        {customer && (
          <>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Thông tin khách hàng</Text>
              <Text style={styles.resultText}>Tên: <Text style={styles.bold}>{customer.fullName}</Text></Text>
              <Text style={styles.resultText}>SĐT: <Text style={styles.bold}>{customer.phoneNumber}</Text></Text>
              {customer.email && <Text style={styles.resultText}>Email: <Text style={styles.bold}>{customer.email}</Text></Text>}
            </View>

            {/* Danh sách xe + nút thêm */}
            <View style={styles.vehiclesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Xe của khách</Text>
                <TouchableOpacity style={styles.addVehicleBtn} onPress={openAddVehicle}>
                  <Text style={styles.addVehicleBtnText}>+ Thêm xe</Text>
                </TouchableOpacity>
              </View>

              {loadingVehicles ? (
                <ActivityIndicator size="small" color="#27ae60" />
              ) : vehicles.length > 0 ? (
                <FlatList
                  data={vehicles}
                  keyExtractor={item => item.id}
                  renderItem={renderVehicle}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  style={{ marginBottom: 16 }}
                />
              ) : (
                <View style={styles.noData}>
                  <Text style={styles.noDataText}>Chưa có xe nào</Text>
                  <TouchableOpacity style={styles.addVehicleBtnInline} onPress={openAddVehicle}>
                    <Text style={styles.addVehicleBtnText}>+ Thêm xe đầu tiên</Text>
                  </TouchableOpacity>
                </View>
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
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noAppointment}>
                  <Text style={styles.noAppointmentText}>Chưa có lịch hẹn</Text>
                  <TouchableOpacity
                    style={styles.createApptBtn}
                    onPress={openWalkInModal}
                  >
                    <Text style={styles.createApptBtnText}>Tạo lịch hẹn ngay</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* === MODAL THÊM XE === */}
      <Modal visible={showAddVehicle} animationType="slide" transparent={true} onRequestClose={closeAddVehicle}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <Text style={styles.modalTitle}>Thêm xe mới</Text>

              {loadingModels ? (
                <ActivityIndicator size="small" color="#27ae60" />
              ) : (
                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>Dòng xe *</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedModelId}
                      onValueChange={setSelectedModelId}
                      style={styles.picker}
                      dropdownIconColor="#27ae60"
                    >
                      {vehicleModels.map(model => (
                        <Picker.Item
                          key={model.id}
                          label={`${model.brand} -  ${model.name}`}
                          value={model.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              {loadingBatteries ? (
                <ActivityIndicator size="small" color="#27ae60" />
              ) : (
                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>Pin *</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedBatteryId}
                      onValueChange={setSelectedBatteryId}
                      style={styles.picker}
                      dropdownIconColor="#27ae60"
                    >
                      {batteries.map(bat => (
                        <Picker.Item
                          key={bat.id}
                          label={`${bat.name} - (${bat.capacityKwh} kWh)`}
                          value={bat.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              <TextInput style={styles.input} placeholder="Số khung (VIN) *" value={vin} onChangeText={setVin} />
              <TextInput style={styles.input} placeholder="Năm sản xuất *" value={year} onChangeText={setYear} keyboardType="numeric" />
              <TextInput style={styles.input} placeholder="Biển số *" value={licensePlate} onChangeText={setLicensePlate} />
              <TextInput style={styles.input} placeholder="Màu sắc *" value={color} onChangeText={setColor} />
              <TextInput style={styles.input} placeholder="Số km hiện tại *" value={currentMileage} onChangeText={setCurrentMileage} keyboardType="numeric" />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeAddVehicle} disabled={submittingVehicle}>
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleAddVehicle} disabled={submittingVehicle}>
                {submittingVehicle ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.createBtnText}>Thêm xe</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* === MODAL CHECK-IN (LỊCH CÓ SẴN) === */}
      <Modal visible={showStartModal} transparent animationType="fade" onRequestClose={() => setShowStartModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <Text style={styles.modalTitle}>Check-in xe</Text>
              <Text style={styles.modalSubtitle}>Nhập số km hiện tại</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 25800"
                keyboardType="numeric"
                value={mileageInput}
                onChangeText={setMileageInput}
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowStartModal(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleStartAppointment}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.createBtnText}>Bắt đầu</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* === MODAL WALK-IN (TẠO MỚI) === */}
      <Modal visible={showWalkInModal} animationType="slide" transparent onRequestClose={() => setShowWalkInModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <Text style={styles.modalTitle}>Tạo lịch hẹn ngay</Text>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Xe *</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={walkInVehicle?.id}
                    onValueChange={(id) => set_walkInVehicle(vehicles.find(v => v.id === id))}
                  >
                    {vehicles.map(v => (
                      <Picker.Item
                        key={v.id}
                        label={`${v.brand} - ${v.model} - ${v.licensePlate}`}
                        value={v.id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {loadingTechnicians ? (
                <ActivityIndicator size="small" color="#27ae60" />
              ) : technicians.length > 0 ? (
                <View style={styles.pickerContainer}>
                  <Text style={styles.label}>Kỹ thuật viên *</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={walkInTechnicianId}
                      onValueChange={setWalkInTechnicianId}
                    >
                      {technicians.map(t => (
                        <Picker.Item key={t.id} label={t.fullName} value={t.id} />
                      ))}
                    </Picker>
                  </View>
                </View>
              ) : null}

              {/* DANH SÁCH DỊCH VỤ */}
              <View style={styles.servicesSection}>
                <Text style={styles.label}>Dịch vụ *</Text>
                {loadingServices ? (
                  <ActivityIndicator size="small" color="#27ae60" />
                ) : serviceTypes.length > 0 ? (
                  <FlatList
                    data={serviceTypes}
                    keyExtractor={item => item.id}
                    renderItem={renderServiceItem}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.servicesList}
                  />
                ) : (
                  <Text style={styles.noServicesText}>Không có dịch vụ nào</Text>
                )}
                <Text style={styles.selectedServicesText}>
                  Đã chọn: {selectedServices.length} dịch vụ
                </Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Ghi chú (tùy chọn)"
                value={walkInNotes}
                onChangeText={setWalkInNotes}
                multiline
              />
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowWalkInModal(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleWalkIn}
                disabled={submitting || selectedServices.length === 0}
              >
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.createBtnText}>Check-in ngay</Text>}
              </TouchableOpacity>
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
  title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 8, paddingHorizontal: 20 },
  subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },

  searchSection: { paddingHorizontal: 20, marginBottom: 20 },
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

  createForm: { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2, marginHorizontal: 20, marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  formButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelBtnText: { color: '#95a5a6', fontWeight: '600' },
  createBtn: { backgroundColor: '#27ae60', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  createBtnText: { color: '#fff', fontWeight: 'bold' },

  resultCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, elevation: 3, marginHorizontal: 20, marginBottom: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  resultText: { fontSize: 15, color: '#34495e', marginBottom: 6 },
  bold: { fontWeight: '600', color: '#27ae60' },

  // === XE ===
  vehiclesSection: { marginBottom: 16, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  addVehicleBtn: { backgroundColor: '#3498db', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addVehicleBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  addVehicleBtnInline: { marginTop: 8, backgroundColor: '#3498db', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  vehicleCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  vehicleTitle: { fontSize: 17, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  vehicleInfo: { fontSize: 14, color: '#555', marginBottom: 2 },
  vehicleBattery: { fontSize: 13, color: '#27ae60', fontStyle: 'italic', marginTop: 4 },

  // === LỊCH HẸN ===
  appointmentsSection: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  apptCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  apptTime: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
  apptInfo: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  apptStatus: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },

  checkInBtn: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  checkInBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  noData: { alignItems: 'center', padding: 16 },
  noDataText: { fontSize: 15, color: '#95a5a6', fontStyle: 'italic' },

  noAppointment: { alignItems: 'center', padding: 20 },
  noAppointmentText: { fontSize: 16, color: '#95a5a6', marginBottom: 16, fontStyle: 'italic' },
  createApptBtn: { backgroundColor: '#27ae60', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  createApptBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // === DỊCH VỤ ===
  servicesSection: { marginBottom: 16 },
  servicesList: { maxHeight: 200 },
  serviceItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  serviceItemSelected: {
    backgroundColor: '#e8f5e8',
    borderColor: '#27ae60',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  serviceNameSelected: {
    color: '#27ae60',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  selectedServicesText: {
    fontSize: 12,
    color: '#27ae60',
    fontStyle: 'italic',
    marginTop: 8,
  },
  noServicesText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },

  // === MODAL ===
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalSubtitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 16 },
  pickerContainer: { marginBottom: 16 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: { height: 50 },
  label: { fontSize: 14, color: '#34495e', marginBottom: 6, fontWeight: '600' },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default SearchCustomerScreen;