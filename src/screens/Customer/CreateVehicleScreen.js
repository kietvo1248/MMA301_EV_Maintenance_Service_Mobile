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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getVehicleModels, getVehicleBatteries, addVehicle } from '../../services/apiService';

const CreateVehicleScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    vin: '',
    year: new Date().getFullYear().toString(),
    vehicleModelId: '',
    batteryId: '',
    licensePlate: '',
    color: '',
    currentMileage: ''
  });

  const [vehicleModels, setVehicleModels] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadVehicleModels();
  }, []);

  useEffect(() => {
    if (formData.vehicleModelId) {
      loadBatteries(formData.vehicleModelId);
    }
  }, [formData.vehicleModelId]);

  const loadVehicleModels = async () => {
    try {
      const response = await getVehicleModels();
      
      // Debug để xem cấu trúc response
      console.log('Vehicle Models Response:', response);
      
      // Xử lý response có thể có cấu trúc { data: [...] } hoặc trực tiếp là mảng
      const models = Array.isArray(response) ? response : (response.data || []);
      
      setVehicleModels(models);
      if (models.length > 0) {
        setFormData(prev => ({ ...prev, vehicleModelId: models[0].id }));
      }
    } catch (error) {
      console.error('Lỗi tải mẫu xe:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách mẫu xe');
    }
  };

  const loadBatteries = async (modelId) => {
    try {
      const response = await getVehicleBatteries(modelId);
      
      // Debug để xem cấu trúc response
      console.log('Batteries Response:', response);
      
      // Xử lý response có thể có cấu trúc { data: [...] } hoặc trực tiếp là mảng
      const batteryList = Array.isArray(response) ? response : (response.data || []);
      
      setBatteries(batteryList);
      if (batteryList.length > 0) {
        setFormData(prev => ({ ...prev, batteryId: batteryList[0].id }));
      } else {
        setFormData(prev => ({ ...prev, batteryId: '' }));
      }
    } catch (error) {
      console.error('Lỗi tải pin:', error);
      setBatteries([]);
      setFormData(prev => ({ ...prev, batteryId: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vin.trim()) {
      newErrors.vin = 'Vui lòng nhập VIN';
    } else if (formData.vin.length < 17) {
      newErrors.vin = 'VIN phải có ít nhất 17 ký tự';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Vui lòng nhập năm sản xuất';
    } else {
      const year = parseInt(formData.year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.year = `Năm phải từ 1900 đến ${currentYear + 1}`;
      }
    }

    if (!formData.vehicleModelId) {
      newErrors.vehicleModelId = 'Vui lòng chọn mẫu xe';
    }

    if (!formData.batteryId) {
      newErrors.batteryId = 'Vui lòng chọn loại pin';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Vui lòng nhập biển số xe';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Vui lòng nhập màu sắc';
    }

    if (!formData.currentMileage.trim()) {
      newErrors.currentMileage = 'Vui lòng nhập số km hiện tại';
    } else {
      const mileage = parseInt(formData.currentMileage);
      if (isNaN(mileage) || mileage < 0) {
        newErrors.currentMileage = 'Số km phải lớn hơn hoặc bằng 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        currentMileage: parseInt(formData.currentMileage)
      };

      const result = await addVehicle(vehicleData);
      
      Alert.alert(
        'Thành công',
        'Xe đã được thêm thành công!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Lỗi thêm xe:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể thêm xe. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Thêm xe mới</Text>
            <Text style={styles.subtitle}>Nhập thông tin xe của bạn</Text>
          </View>

          <View style={styles.form}>
            {/* VIN */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số VIN *</Text>
              <TextInput
                style={[styles.input, errors.vin && styles.inputError]}
                placeholder="Nhập số VIN (17 ký tự)"
                placeholderTextColor="#999"
                value={formData.vin}
                onChangeText={(text) => updateFormData('vin', text.toUpperCase())}
                autoCapitalize="characters"
              />
              {errors.vin && <Text style={styles.errorText}>{errors.vin}</Text>}
            </View>

            {/* Năm sản xuất */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Năm sản xuất *</Text>
              <TextInput
                style={[styles.input, errors.year && styles.inputError]}
                placeholder="Nhập năm sản xuất"
                placeholderTextColor="#999"
                value={formData.year}
                onChangeText={(text) => updateFormData('year', text)}
                keyboardType="numeric"
                maxLength={4}
              />
              {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
            </View>

            {/* Mẫu xe */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mẫu xe *</Text>
              <View style={[styles.pickerContainer, errors.vehicleModelId && styles.inputError]}>
                <Picker
                  selectedValue={formData.vehicleModelId}
                  onValueChange={(value) => updateFormData('vehicleModelId', value)}
                  style={styles.picker}
                >
                  {vehicleModels.length === 0 && (
                    <Picker.Item label="Đang tải..." value="" />
                  )}
                  {vehicleModels.map((model) => (
                    <Picker.Item
                      key={model.id}
                      label={`${model.brand} ${model.name}`}
                      value={model.id}
                    />
                  ))}
                </Picker>
              </View>
              {errors.vehicleModelId && <Text style={styles.errorText}>{errors.vehicleModelId}</Text>}
            </View>

            {/* Pin */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loại pin *</Text>
              <View style={[styles.pickerContainer, errors.batteryId && styles.inputError]}>
                <Picker
                  selectedValue={formData.batteryId}
                  onValueChange={(value) => updateFormData('batteryId', value)}
                  style={styles.picker}
                  enabled={batteries.length > 0}
                >
                  {batteries.length === 0 && (
                    <Picker.Item label="Chọn mẫu xe trước" value="" />
                  )}
                  {batteries.map((battery) => (
                    <Picker.Item
                      key={battery.id}
                      label={`${battery.name} (${battery.capacityKwh}kWh)`}
                      value={battery.id}
                    />
                  ))}
                </Picker>
              </View>
              {errors.batteryId && <Text style={styles.errorText}>{errors.batteryId}</Text>}
              {batteries.length === 0 && formData.vehicleModelId && (
                <Text style={styles.infoText}>Không có pin tương thích cho mẫu xe này</Text>
              )}
            </View>

            {/* Biển số */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Biển số xe *</Text>
              <TextInput
                style={[styles.input, errors.licensePlate && styles.inputError]}
                placeholder="VD: 81K-123.45"
                placeholderTextColor="#999"
                value={formData.licensePlate}
                onChangeText={(text) => updateFormData('licensePlate', text.toUpperCase())}
                autoCapitalize="characters"
              />
              {errors.licensePlate && <Text style={styles.errorText}>{errors.licensePlate}</Text>}
            </View>

            {/* Màu sắc */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Màu sắc *</Text>
              <TextInput
                style={[styles.input, errors.color && styles.inputError]}
                placeholder="Nhập màu sắc xe"
                placeholderTextColor="#999"
                value={formData.color}
                onChangeText={(text) => updateFormData('color', text)}
              />
              {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
            </View>

            {/* Số km hiện tại */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số km hiện tại *</Text>
              <TextInput
                style={[styles.input, errors.currentMileage && styles.inputError]}
                placeholder="Nhập số km"
                placeholderTextColor="#999"
                value={formData.currentMileage}
                onChangeText={(text) => updateFormData('currentMileage', text)}
                keyboardType="numeric"
              />
              {errors.currentMileage && <Text style={styles.errorText}>{errors.currentMileage}</Text>}
            </View>

            {/* Nút submit */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Đang thêm xe...' : 'Thêm xe'}
              </Text>
            </TouchableOpacity>

            {/* Nút hủy */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  keyboardView: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20
  },
  header: {
    marginBottom: 30,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center'
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa'
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5
  },
  infoText: {
    color: '#3498db',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%'
  },
  submitButton: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    elevation: 6
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
    elevation: 2
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 15
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CreateVehicleScreen