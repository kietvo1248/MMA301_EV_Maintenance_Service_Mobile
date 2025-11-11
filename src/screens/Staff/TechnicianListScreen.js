import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTechnicians } from '../../services/Staff/staffService'; // Import API

const TechnicianListScreen = () => {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [workDescription, setWorkDescription] = useState('');
  const [viewScheduleModalVisible, setViewScheduleModalVisible] = useState(false);
  const [selectedTechnicianSchedules, setSelectedTechnicianSchedules] = useState([]);

  // Load technicians from API
  const loadTechnicians = useCallback(async () => {
    try {
      setError(null);
      const data = await getTechnicians();
      setTechnicians(data);
      setFilteredTechnicians(data);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Không thể tải danh sách kỹ thuật viên';
      setError(message);
      Alert.alert('Lỗi', message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  // Filter on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTechnicians(technicians);
      return;
    }

    const filtered = technicians.filter(tech =>
      tech.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTechnicians(filtered);
  }, [searchQuery, technicians]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTechnicians();
  };

  const handleTechnicianPress = (technician) => {
    Alert.alert(
      'Tùy chọn',
      `Chọn hành động cho ${technician.fullName}`,
      [
        { text: 'Xem chi tiết', onPress: () => showTechnicianDetails(technician) },
        { text: 'Lịch làm việc', onPress: () => openScheduleModal(technician) },
        { text: 'Xem lịch', onPress: () => viewTechnicianSchedule(technician) },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };

  const showTechnicianDetails = (tech) => {
    Alert.alert(
      'Thông tin kỹ thuật viên',
      `Họ tên: ${tech.fullName}\nMã NV: ${tech.employeeCode}\nEmail: ${tech.email}`,
      [{ text: 'OK' }]
    );
  };

  const openScheduleModal = (tech) => {
    setSelectedTechnician(tech);
    const now = new Date();
    setScheduleDate(now);
    setStartTime(now);
    setEndTime(new Date(now.getTime() + 60 * 60 * 1000)); // +1 giờ
    setWorkDescription('');
    setScheduleModalVisible(true);
  };

  const viewTechnicianSchedule = (tech) => {
    setSelectedTechnician(tech);
    setSelectedTechnicianSchedules(tech.schedules || []);
    setViewScheduleModalVisible(true);
  };

  const handleScheduleSubmit = () => {
    if (!workDescription.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả công việc');
      return;
    }
    if (startTime >= endTime) {
      Alert.alert('Lỗi', 'Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }

    const newSchedule = {
      id: Date.now().toString(),
      date: scheduleDate.toISOString().split('T')[0],
      startTime: startTime.toTimeString().split(' ')[0],
      endTime: endTime.toTimeString().split(' ')[0],
      description: workDescription,
    };

    const updated = technicians.map(t =>
      t.id === selectedTechnician.id
        ? { ...t, schedules: [...(t.schedules || []), newSchedule] }
        : t
    );

    setTechnicians(updated);
    setFilteredTechnicians(updated);
    setScheduleModalVisible(false);
    Alert.alert('Thành công', `Đã thêm lịch cho ${selectedTechnician.fullName}`);
  };

  const deleteSchedule = (scheduleId) => {
    Alert.alert('Xóa lịch', 'Bạn có chắc muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const updated = technicians.map(t =>
            t.id === selectedTechnician.id
              ? { ...t, schedules: t.schedules.filter(s => s.id !== scheduleId) }
              : t
          );
          setTechnicians(updated);
          setFilteredTechnicians(updated);
          setSelectedTechnicianSchedules(prev => prev.filter(s => s.id !== scheduleId));
        },
      },
    ]);
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formatted = hour % 12 || 12;
    return `${formatted}:${m} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderTechnicianItem = ({ item }) => (
    <TouchableOpacity style={styles.technicianItem} onPress={() => handleTechnicianPress(item)}>
      <View style={styles.avatarContainer}>
        <Icon name="person" size={24} color="#666" />
      </View>
      <View style={styles.technicianInfo}>
        <Text style={styles.fullName}>{item.fullName}</Text>
        <Text style={styles.employeeCode}>{item.employeeCode}</Text>
        <Text style={styles.email}>{item.email}</Text>
        {item.schedules?.length > 0 && (
          <View style={styles.scheduleBadge}>
            <Text style={styles.scheduleBadgeText}>
              {item.schedules.length} ca làm
            </Text>
          </View>
        )}
      </View>
      <Icon name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải kỹ thuật viên...</Text>
      </View>
    );
  }

  if (error && technicians.length === 0) {
    return (
      <View style={styles.center}>
        <Icon name="error-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTechnicians}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kỹ thuật viên..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Kỹ thuật viên ({filteredTechnicians.length})</Text>
      </View>

      <FlatList
        data={filteredTechnicians}
        renderItem={renderTechnicianItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Không tìm thấy kỹ thuật viên</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Schedule Modal */}
      <Modal
        visible={scheduleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Schedule Work for {selectedTechnician?.fullName}
              </Text>
              <TouchableOpacity
                onPress={() => setScheduleModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Date Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{scheduleDate.toDateString()}</Text>
                  <Icon name="calendar-today" size={20} color="#666" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={scheduleDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setScheduleDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* Start Time Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Start Time</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text>{startTime.toLocaleTimeString()}</Text>
                  <Icon name="access-time" size={20} color="#666" />
                </TouchableOpacity>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowStartTimePicker(false);
                      if (selectedTime) {
                        setStartTime(selectedTime);
                      }
                    }}
                  />
                )}
              </View>

              {/* End Time Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>End Time</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text>{endTime.toLocaleTimeString()}</Text>
                  <Icon name="access-time" size={20} color="#666" />
                </TouchableOpacity>
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowEndTimePicker(false);
                      if (selectedTime) {
                        setEndTime(selectedTime);
                      }
                    }}
                  />
                )}
              </View>

              {/* Work Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Work Description</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Enter work description..."
                  value={workDescription}
                  onChangeText={setWorkDescription}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setScheduleModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleScheduleSubmit}
              >
                <Text style={styles.submitButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Schedule Modal */}
      <Modal
        visible={viewScheduleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setViewScheduleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedTechnician?.fullName}'s Schedule
              </Text>
              <TouchableOpacity
                onPress={() => setViewScheduleModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.scheduleListContainer}>
              {selectedTechnicianSchedules.length > 0 ? (
                <FlatList
                  data={selectedTechnicianSchedules}
                  renderItem={renderScheduleItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyScheduleContainer}>
                  <Icon name="schedule" size={64} color="#ccc" />
                  <Text style={styles.emptyScheduleText}>No schedules found</Text>
                </View>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButtonFull}
                onPress={() => setViewScheduleModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: '#333',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  technicianItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  technicianInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  employeeCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#007AFF',
  },
  scheduleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  scheduleBadgeText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  // Input Styles
  inputGroup: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Button Styles
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginLeft: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  closeButtonFull: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  // Schedule List Styles
  scheduleListContainer: {
    maxHeight: 400,
    padding: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#333',
  },
  deleteScheduleButton: {
    padding: 8,
  },
  emptyScheduleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyScheduleText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default TechnicianListScreen;