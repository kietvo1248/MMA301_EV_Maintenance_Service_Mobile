import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getVehicleDetails, getVehicleBatteries, updateVehicle } from '../../services/apiService';

const UpdateVehicleScreen = ({ navigation, route }) => {
  const { vehicleId, vehicleData } = route.params;
  
  const [formData, setFormData] = useState({
    licensePlate: '',
    color: '',
    batteryId: '',
    currentMileage: '',
  });
  
  const [vehicleBatteries, setVehicleBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVehicleData();
  }, [vehicleId]);

  const loadVehicleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Nếu có vehicleData từ route, sử dụng nó
      if (vehicleData) {
        setFormData({
          licensePlate: vehicleData.licensePlate || '',
          color: vehicleData.color || '',
          batteryId: vehicleData.battery?.id || '',
          currentMileage: vehicleData.currentMileage?.toString() || '',
        });
        
        // Load batteries cho vehicle model
        if (vehicleData.vehicleModel?.id) {
          await loadVehicleBatteries(vehicleData.vehicleModel.id);
        }
      } else {
        // Nếu không có vehicleData, gọi API để lấy thông tin
        const response = await getVehicleDetails(vehicleId);
        const vehicle = response.data || response;
        
        setFormData({
          licensePlate: vehicle.licensePlate || '',
          color: vehicle.color || '',
          batteryId: vehicle.battery?.id || '',
          currentMileage: vehicle.currentMileage?.toString() || '',
        });
        
        if (vehicle.vehicleModel?.id) {
          await loadVehicleBatteries(vehicle.vehicleModel.id);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin xe:', err);
      setError('Không thể tải thông tin xe. Vui lòng thử lại.');
      Alert.alert('Lỗi', 'Không thể tải thông tin xe');
    } finally {
      setLoading(false);
    }
  };

  const loadVehicleBatteries = async (modelId) => {
    try {
      const response = await getVehicleBatteries(modelId);
      const batteries = Array.isArray(response) ? response : (response.data || []);
      setVehicleBatteries(batteries);
    } catch (error) {
      console.error('Lỗi tải danh sách pin:', error);
      setVehicleBatteries([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.licensePlate.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập biển số xe');
      return false;
    }
    
    if (!formData.color.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập màu sắc xe');
      return false;
    }
    
    if (!formData.currentMileage.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số km hiện tại');
      return false;
    }
    
    const mileage = parseInt(formData.currentMileage);
    if (isNaN(mileage) || mileage < 0) {
      Alert.alert('Lỗi', 'Số km hiện tại phải là số dương');
      return false;
    }
    
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        licensePlate: formData.licensePlate.trim(),
        color: formData.color.trim(),
        batteryId: formData.batteryId,
        currentMileage: parseInt(formData.currentMileage),
      };

      console.log('Dữ liệu cập nhật:', updateData);
      
      await updateVehicle(vehicleId, updateData);
      
      Alert.alert(
        'Thành công', 
        'Cập nhật thông tin xe thành công!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Quay lại màn hình trước, VehicleDetail sẽ tự động refresh khi focus
              navigation.goBack();
            }
          }
        ]
      );
      
    } catch (err) {
      console.error('Lỗi khi cập nhật xe:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin xe. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.',
      [
        {
          text: 'Tiếp tục chỉnh sửa',
          style: 'cancel'
        },
        {
          text: 'Hủy',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Cập nhật thông tin xe</Text>
            <Text style={styles.subtitle}>Chỉnh sửa thông tin xe của bạn</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Biển số xe */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Biển số xe <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <Icon name="confirmation-number" size={20} color="#7f8c8d" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập biển số xe"
                  value={formData.licensePlate}
                  onChangeText={(text) => handleInputChange('licensePlate', text)}
                />
              </View>
            </View>

            {/* Màu sắc */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Màu sắc <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <Icon name="color-lens" size={20} color="#7f8c8d" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập màu sắc xe"
                  value={formData.color}
                  onChangeText={(text) => handleInputChange('color', text)}
                />
              </View>
            </View>

            {/* Loại pin */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loại pin</Text>
              <View style={styles.pickerContainer}>
                <Icon name="battery-charging-full" size={20} color="#7f8c8d" style={styles.inputIcon} />
                <Picker
                  selectedValue={formData.batteryId}
                  onValueChange={(value) => handleInputChange('batteryId', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn loại pin" value="" />
                  {vehicleBatteries.map((battery) => (
                    <Picker.Item 
                      key={battery.id} 
                      label={`${battery.name} (${battery.capacityKwh || battery.capacity} kWh)`} 
                      value={battery.id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Số km hiện tại */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số km hiện tại <Text style={styles.required}>*</Text></Text>
              <View style={styles.inputContainer}>
                <Icon name="speed" size={20} color="#7f8c8d" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số km hiện tại"
                  value={formData.currentMileage}
                  onChangeText={(text) => handleInputChange('currentMileage', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Nút hành động */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton, saving && styles.disabledButton]} 
                onPress={handleUpdate}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2c3e50',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpdateVehicleScreen;