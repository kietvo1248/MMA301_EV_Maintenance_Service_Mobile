import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function TechnicianProfileScreen() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header với gradient background */}
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
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
          <Text style={styles.name}>{user?.fullName || user?.name || "Kỹ thuật viên"}</Text>
          <View style={styles.roleBadge}>
            <MaterialIcons name="badge" size={14} color="#3B82F6" />
            <Text style={styles.roleText}>{user?.role || "TECHNICIAN"}</Text>
          </View>
        </View>
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="person" size={22} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
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
                {user?.phone || "Chưa cập nhật"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: "#FEF3C7" }]}>
              <MaterialIcons name="location-on" size={18} color="#F59E0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Địa chỉ</Text>
              <Text style={styles.infoText}>
                {user?.address || "Chưa có thông tin"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cài đặt và hành động */}
      <View style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Cài đặt</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {/* Navigate to edit profile */}}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="edit" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Chỉnh sửa thông tin</Text>
              <Text style={styles.actionSubtitle}>
                Cập nhật thông tin cá nhân
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {/* Navigate to change password */}}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="lock" size={24} color="#10B981" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Đổi mật khẩu</Text>
              <Text style={styles.actionSubtitle}>
                Thay đổi mật khẩu đăng nhập
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {/* Navigate to settings */}}
          activeOpacity={0.7}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="settings" size={24} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.actionTitle}>Cài đặt ứng dụng</Text>
              <Text style={styles.actionSubtitle}>
                Tùy chỉnh ứng dụng
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* Nút đăng xuất */}
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={logout}
        activeOpacity={0.8}
      >
        <MaterialIcons name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 16,
  },
});