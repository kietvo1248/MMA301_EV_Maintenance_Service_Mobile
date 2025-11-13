import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function TechnicianHomeScreen({ navigation }) {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header với gradient background */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.welcomeText}>
              {user?.fullName || user?.name || "Kỹ thuật viên"}
            </Text>
            <Text style={styles.subText}>
              Hôm nay là ngày tốt để hoàn thành công việc !
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user?.avatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
            />
            <View style={styles.activeIndicator} />
          </View>
        </View>
      </View>

      {/* Quick Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
            <MaterialIcons name="build" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statLabel}>Công việc</Text>
          <Text style={styles.statValue}>Hôm nay</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#D1FAE5" }]}>
            <MaterialIcons name="check-circle" size={24} color="#10B981" />
          </View>
          <Text style={styles.statLabel}>Hoàn thành</Text>
          <Text style={styles.statValue}>Tuần này</Text>
        </View>
      </View>

      {/* Thông tin của bạn */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="person" size={22} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Thông tin của bạn</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#DBEAFE" }]}>
              <MaterialIcons name="email" size={18} color="#3B82F6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoText}>
                {user?.email || "Chưa cập nhật"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#D1FAE5" }]}>
              <MaterialIcons name="phone" size={18} color="#10B981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Số điện thoại</Text>
              <Text style={styles.infoText}>
                {user?.phone || "Chưa có số điện thoại"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#FEF3C7" }]}>
              <MaterialIcons name="badge" size={18} color="#F59E0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Vai trò</Text>
              <Text style={styles.infoText}>
                {user?.role || "Technician"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Các hành động nhanh */}
      <View style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Hành động nhanh</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("TechTasks")}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="assignment" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Xem công việc</Text>
              <Text style={styles.actionSubtitle}>
                Quản lý và cập nhật tiến độ
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {/* Navigate to profile or settings */}}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="history" size={24} color="#10B981" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Lịch sử công việc</Text>
              <Text style={styles.actionSubtitle}>
                Xem các công việc đã hoàn thành
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
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
    paddingBottom: 40,
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
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  greetingText: {
    fontSize: 14,
    color: "#E0E7FF",
    fontWeight: "500",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#E0E7FF",
    fontWeight: "500",
    lineHeight: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
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
  actionsCard: {
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
  actionsTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  actionDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 60,
    marginVertical: 4,
  },
});