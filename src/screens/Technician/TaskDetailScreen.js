import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;
  const { appointment } = task;
  const { customer, vehicle } = appointment;
  const { vehicleModel } = vehicle;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "hoàn thành":
        return { bg: "#D1FAE5", text: "#10B981", icon: "check-circle" };
      case "in_progress":
      case "đang thực hiện":
        return { bg: "#DBEAFE", text: "#3B82F6", icon: "autorenew" };
      case "pending":
      case "chờ xử lý":
        return { bg: "#FEF3C7", text: "#F59E0B", icon: "pending" };
      default:
        return { bg: "#F1F5F9", text: "#64748B", icon: "info" };
    }
  };

  const statusStyle = getStatusColor(task.status);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết công việc</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <MaterialIcons name={statusStyle.icon} size={20} color={statusStyle.text} />
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {task.status}
          </Text>
        </View>
      </View>

      {/* Customer Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="person" size={22} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#DBEAFE" }]}>
              <MaterialIcons name="account-circle" size={18} color="#3B82F6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tên khách hàng</Text>
              <Text style={styles.infoText}>{customer.fullName}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Vehicle Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="directions-car" size={22} color="#10B981" />
          <Text style={styles.sectionTitle}>Thông tin xe</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#D1FAE5" }]}>
              <MaterialIcons name="directions-car" size={18} color="#10B981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Loại xe</Text>
              <Text style={styles.infoText}>
                {vehicleModel.brand} {vehicleModel.name}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#FEF3C7" }]}>
              <MaterialIcons name="confirmation-number" size={18} color="#F59E0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Biển số xe</Text>
              <Text style={styles.infoText}>{vehicle.licensePlate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Appointment Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="event" size={22} color="#8B5CF6" />
          <Text style={styles.sectionTitle}>Thông tin lịch hẹn</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#EDE9FE" }]}>
              <MaterialIcons name="schedule" size={18} color="#8B5CF6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Ngày & giờ hẹn</Text>
              <Text style={styles.infoText}>
                {new Date(appointment.appointmentDate).toLocaleString("vi-VN", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Notes Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="notes" size={22} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Ghi chú kỹ thuật viên</Text>
        </View>

        <View style={styles.notesContainer}>
          {task.staffNotes ? (
            <Text style={styles.notesText}>{task.staffNotes}</Text>
          ) : (
            <View style={styles.emptyNotes}>
              <MaterialIcons name="note-add" size={32} color="#CBD5E1" />
              <Text style={styles.emptyNotesText}>Chưa có ghi chú</Text>
              <Text style={styles.emptyNotesSubtext}>
                Thêm ghi chú về công việc này
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.primaryBtn]}
          activeOpacity={0.8}
        >
          <MaterialIcons name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.primaryBtnText}>Cập nhật tiến độ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.secondaryBtn]}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add-comment" size={20} color="#3B82F6" />
          <Text style={styles.secondaryBtnText}>Thêm ghi chú</Text>
        </TouchableOpacity>
      </View>

      {/* Spacer at bottom */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  headerWrapper: {
    backgroundColor: "#3B82F6",
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  statusContainer: {
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 10,
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
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
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
  },
  infoContainer: {
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  infoDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 52,
  },
  notesContainer: {
    paddingTop: 4,
  },
  notesText: {
    fontSize: 15,
    color: "#1E293B",
    lineHeight: 22,
  },
  emptyNotes: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyNotesText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 12,
  },
  emptyNotesSubtext: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: "#3B82F6",
    elevation: 2,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3B82F6",
  },
});