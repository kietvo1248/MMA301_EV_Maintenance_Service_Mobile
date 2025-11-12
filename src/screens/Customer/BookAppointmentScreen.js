import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getMyVehiclesForAppointment,
  getServiceTypes,
  getServiceCenters,
  getAvailableSlots,
  createAppointment,
} from '../../services/apiService';

const BookAppointmentScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    // Kiểm tra nếu có xe được chọn từ navigation params
    if (route.params?.selectedVehicle) {
      setSelectedVehicle(route.params.selectedVehicle);
    }
  }, []);

  useEffect(() => {
    if (selectedCenter && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedCenter, selectedDate]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [vehiclesRes, servicesRes, centersRes] = await Promise.all([
        getMyVehiclesForAppointment(),
        getServiceTypes(),
        getServiceCenters(),
      ]);
      
      setVehicles(vehiclesRes.data || vehiclesRes);
      setServiceTypes(servicesRes.data || servicesRes);
      setServiceCenters(centersRes.data || centersRes);
      
      // Nếu có xe được chọn từ params, tìm và set lại sau khi load dữ liệu
      if (route.params?.selectedVehicle) {
        const foundVehicle = (vehiclesRes.data || vehiclesRes).find(
          v => v.id === route.params.selectedVehicle.id
        );
        if (foundVehicle) {
          setSelectedVehicle(foundVehicle);
        }
      }
      
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedCenter) return;

    try {
      setFetchingSlots(true);
      const date = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await getAvailableSlots(selectedCenter.id, date);
      setAvailableSlots(response.data || response);
    } catch (error) {
      console.error('Lỗi tải khung giờ:', error);
      setAvailableSlots([]);
    } finally {
      setFetchingSlots(false);
    }
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) {
      setSelectedDate(selected);
      setSelectedSlot(null); // Reset khung giờ đã chọn
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedVehicle || !selectedServiceType || !selectedCenter || !selectedSlot) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn đầy đủ thông tin lịch hẹn');
      return;
    }

    try {
      setLoading(true);
      
      const appointmentData = {
        vehicleId: selectedVehicle.id,
        serviceTypeId: selectedServiceType.id,
        serviceCenterId: selectedCenter.id,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedSlot,
        notes: notes.trim(),
      };

      console.log('📤 Sending appointment data:', appointmentData);
      const response = await createAppointment(appointmentData);
      
      // Log toàn bộ response để debug
      console.log('📥 Full API Response:', JSON.stringify(response, null, 2));
      
      // ✅ FIX: API trả về response.appointment.id
      const newAppointmentId = 
        response?.appointment?.id ||    // ✅ Format của API bạn
        response?.data?.appointment?.id || // Nếu có wrapper data
        response?.data?.id ||           // Thường gặp
        response?.id ||                 // Nếu data đã được unwrap
        response?.data?._id ||          // MongoDB
        response?._id ||                // MongoDB unwrapped
        response?.data?.appointmentId || // Custom field
        response?.appointmentId ||      // Custom field unwrapped
        response?.data?.bookingId ||    // Alternative name
        response?.bookingId;            // Alternative unwrapped
      
      console.log('🎯 Extracted appointmentId:', newAppointmentId);
      console.log('🔍 ID Type:', typeof newAppointmentId);
      
      if (!newAppointmentId) {
        console.error('❌ Không tìm thấy ID trong response!');
        console.error('Response structure:', Object.keys(response));
        if (response?.data) {
          console.error('Response.data structure:', Object.keys(response.data));
        }
        if (response?.appointment) {
          console.error('Response.appointment structure:', Object.keys(response.appointment));
        }
      }
      
      Alert.alert(
        'Thành công',
        'Đặt lịch bảo dưỡng thành công!',
        [
          {
            text: 'Xem chi tiết',
            onPress: () => {
              if (newAppointmentId) {
                console.log('🚀 Navigating to detail with ID:', newAppointmentId);
                navigation.navigate('AppointmentStack', { 
                  screen: 'AppointmentDetail', 
                  params: { appointmentId: String(newAppointmentId) }
                });

              } else {
                console.warn('⚠️ No ID available, going back instead');
                Alert.alert(
                  'Thông báo',
                  'Đặt lịch thành công nhưng không thể xem chi tiết. Vui lòng kiểm tra trong lịch sử.',
                  [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
              }
            },
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      
    } catch (error) {
      console.error('❌ Lỗi đặt lịch:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Không thể đặt lịch. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderVehicleItem = (vehicle) => {
    const vehicleName = vehicle.model || vehicle.name || 'Xe của tôi';
    const isSelected = selectedVehicle?.id === vehicle.id;
    
    return (
      <TouchableOpacity
        key={vehicle.id}
        style={[styles.selectionItem, isSelected && styles.selectedItem]}
        onPress={() => setSelectedVehicle(vehicle)}
      >
        <View style={styles.itemContent}>
          <Icon 
            name="directions-car" 
            size={24} 
            color={isSelected ? '#3498db' : '#6b7280'}
          />
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, isSelected && styles.selectedText]}>
              {vehicleName}
            </Text>
            <Text style={[styles.itemSubtitle, isSelected && styles.selectedText]}>
              Biển số: {vehicle.licensePlate || vehicle.plate}
            </Text>
          </View>
        </View>
        {isSelected && <Icon name="check-circle" size={24} color="#3498db" />}
      </TouchableOpacity>
    );
  };

  const renderServiceItem = (service) => {
    const isSelected = selectedServiceType?.id === service.id;
    
    return (
      <TouchableOpacity
        key={service.id}
        style={[styles.selectionItem, isSelected && styles.selectedItem]}
        onPress={() => setSelectedServiceType(service)}
      >
        <View style={styles.itemContent}>
          <Icon 
            name="build" 
            size={24} 
            color={isSelected ? '#3498db' : '#6b7280'}
          />
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, isSelected && styles.selectedText]}>
              {service.name || service.typeName}
            </Text>
            <Text style={[styles.itemSubtitle, isSelected && styles.selectedText]}>
              {service.description || 'Dịch vụ bảo dưỡng'}
            </Text>
          </View>
        </View>
        {isSelected && <Icon name="check-circle" size={24} color="#3498db" />}
      </TouchableOpacity>
    );
  };

  const renderCenterItem = (center) => {
    const isSelected = selectedCenter?.id === center.id;
    
    return (
      <TouchableOpacity
        key={center.id}
        style={[styles.selectionItem, isSelected && styles.selectedItem]}
        onPress={() => setSelectedCenter(center)}
      >
        <View style={styles.itemContent}>
          <Icon 
            name="home-repair-service" 
            size={24} 
            color={isSelected ? '#3498db' : '#6b7280'}
          />
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, isSelected && styles.selectedText]}>
              {center.name}
            </Text>
            <Text style={[styles.itemSubtitle, isSelected && styles.selectedText]}>
              {center.address}
            </Text>
          </View>
        </View>
        {isSelected && <Icon name="check-circle" size={24} color="#3498db" />}
      </TouchableOpacity>
    );
  };

  const renderTimeSlot = (slot) => {
    const isSelected = selectedSlot === slot;
    const isAvailable = !slot.isBooked;
    
    return (
      <TouchableOpacity
        key={slot.time || slot}
        style={[
          styles.timeSlot,
          !isAvailable && styles.timeSlotDisabled,
          isSelected && styles.timeSlotSelected,
        ]}
        onPress={() => isAvailable && setSelectedSlot(slot)}
        disabled={!isAvailable}
      >
        <Text style={[
          styles.timeSlotText,
          !isAvailable && styles.timeSlotTextDisabled,
          isSelected && styles.timeSlotTextSelected,
        ]}>
          {slot.time || slot}
        </Text>
        {!isAvailable && (
          <Text style={styles.timeSlotStatus}>Đã đặt</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đặt lịch bảo dưỡng</Text>
          <Text style={styles.headerSubtitle}>Chọn thông tin lịch hẹn của bạn</Text>
        </View>

        {/* Chọn xe */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="directions-car" size={20} color="#3498db" />
            <Text style={styles.sectionTitle}>Chọn xe</Text>
          </View>
          {vehicles.map(renderVehicleItem)}
        </View>

        {/* Chọn dịch vụ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="build" size={20} color="#3498db" />
            <Text style={styles.sectionTitle}>Chọn dịch vụ</Text>
          </View>
          {serviceTypes.map(renderServiceItem)}
        </View>

        {/* Chọn trung tâm dịch vụ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="home-repair-service" size={20} color="#3498db" />
            <Text style={styles.sectionTitle}>Chọn trung tâm</Text>
          </View>
          {serviceCenters.map(renderCenterItem)}
        </View>

        {/* Chọn ngày */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar-today" size={20} color="#3498db" />
            <Text style={styles.sectionTitle}>Chọn ngày</Text>
          </View>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="event" size={20} color="#3498db" />
            <Text style={styles.datePickerText}>
              {selectedDate.toLocaleDateString('vi-VN')}
            </Text>
            <Icon name="arrow-drop-down" size={20} color="#3498db" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Chọn giờ */}
        {selectedCenter && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="access-time" size={20} color="#3498db" />
              <Text style={styles.sectionTitle}>Chọn giờ</Text>
            </View>
            {fetchingSlots ? (
              <ActivityIndicator size="small" color="#3498db" />
            ) : (
              <View style={styles.timeSlotsContainer}>
                {availableSlots.map(renderTimeSlot)}
              </View>
            )}
          </View>
        )}

        {/* Ghi chú */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="note" size={20} color="#3498db" />
            <Text style={styles.sectionTitle}>Ghi chú (tùy chọn)</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder="Nhập ghi chú cho lịch hẹn..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Nút đặt lịch */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedVehicle || !selectedServiceType || !selectedCenter || !selectedSlot) &&
              styles.bookButtonDisabled,
          ]}
          onPress={handleBookAppointment}
          disabled={!selectedVehicle || !selectedServiceType || !selectedCenter || !selectedSlot}
        >
          <Text style={styles.bookButtonText}>Đặt lịch bảo dưỡng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  scrollView: {
    flex: 1,
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
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  selectedItem: {
    borderColor: '#3498db',
    backgroundColor: '#f0f9ff',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedText: {
    color: '#3498db',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  datePickerText: {
    fontSize: 14,
    color: '#1a1a1a',
    marginLeft: 8,
    flex: 1,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    marginRight: 8,
    marginBottom: 8,
  },
  timeSlotDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  timeSlotSelected: {
    borderColor: '#3498db',
    backgroundColor: '#f0f9ff',
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  timeSlotTextDisabled: {
    color: '#9ca3af',
  },
  timeSlotTextSelected: {
    color: '#3498db',
  },
  timeSlotStatus: {
    fontSize: 10,
    color: '#ef4444',
    marginTop: 2,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    minHeight: 80,
  },
  bookButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default BookAppointmentScreen;