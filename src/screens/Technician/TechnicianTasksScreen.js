import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getTechnicianTasks } from "../../services/apiService";
import { useNavigation } from "@react-navigation/native";

export default function TechnicianTasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("WAITING_APPROVAL");
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const statusOptions = [
    "PENDING",
    "DIAGNOSING",
    "WAITING_APPROVAL",
    "WAITING_PARTS",
    "REPAIRING",
    "QUALITY_CHECK",
    "COMPLETED",
    "CANCELLED",
  ];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "#F59E0B",
      DIAGNOSING: "#3B82F6",
      WAITING_APPROVAL: "#8B5CF6",
      WAITING_PARTS: "#EC4899",
      REPAIRING: "#06B6D4",
      QUALITY_CHECK: "#10B981",
      COMPLETED: "#22C55E",
      CANCELLED: "#EF4444",
    };
    return colors[status] || "#6B7280";
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Chờ xử lý",
      DIAGNOSING: "Đang chẩn đoán",
      WAITING_APPROVAL: "Chờ duyệt",
      WAITING_PARTS: "Chờ phụ tùng",
      REPAIRING: "Đang sửa chữa",
      QUALITY_CHECK: "Kiểm tra chất lượng",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return labels[status] || status;
  };

  const loadTasks = async (status) => {
    try {
      setLoading(true);
      const res = await getTechnicianTasks(status);
      setTasks(res);
      setError(null);
    } catch (err) {
      setError("Không thể tải công việc. Vui lòng thử lại!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(selectedStatus);
  }, [selectedStatus]);

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("TaskDetail", { task: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {getStatusLabel(item.status)}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={styles.dateText}>
            {new Date(item.appointment.appointmentDate).toLocaleDateString(
              "vi-VN"
            )}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>👤</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Khách hàng</Text>
          <Text style={styles.infoText}>
            {item.appointment.customer.fullName}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🚗</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Xe</Text>
          <Text style={styles.infoText}>
            {item.appointment.vehicle.vehicleModel.brand}{" "}
            {item.appointment.vehicle.vehicleModel.name}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔢</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Biển số</Text>
          <Text style={styles.plateNumber}>
            {item.appointment.vehicle.licensePlate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧰 Công việc của tôi</Text>
        <Text style={styles.subtitle}>
          Quản lý và theo dõi tiến độ công việc
        </Text>
      </View>

      <View style={styles.filterCard}>
        <Text style={styles.filterLabel}>Lọc theo trạng thái</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStatus}
            style={styles.picker}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            {statusOptions.map((status) => (
              <Picker.Item
                key={status}
                label={getStatusLabel(status)}
                value={status}
              />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadTasks(selectedStatus)}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : tasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>
            Không có công việc nào trong trạng thái này
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    fontWeight: "500",
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 10,
  },
  pickerWrapper: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
  },
  plateNumber: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "700",
    letterSpacing: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 15,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    fontWeight: "500",
  },
});