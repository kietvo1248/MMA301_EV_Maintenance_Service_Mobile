import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function TechnicianProfileScreen() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27ae60" />
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              user.avatarUrl ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.fullName || user.name || "Kỹ thuật viên"}</Text>
        <Text style={styles.role}>{user.role || "TECHNICIAN"}</Text>
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.infoCard}>
        <InfoRow icon="email" label="Email" value={user.email} />
        <InfoRow icon="phone" label="Số điện thoại" value={user.phone || "Chưa cập nhật"} />
        <InfoRow icon="location-on" label="Địa chỉ" value={user.address || "Chưa có thông tin"} />
      </View>

      {/* Nút đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <MaterialIcons name="logout" size={22} color="#fff" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={20} color="#27ae60" style={{ width: 26 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#27ae60",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  role: {
    color: "#27ae60",
    fontWeight: "500",
    marginTop: 4,
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#777",
  },
  value: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 30,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
  },
  errorText: {
    color: "#e74c3c",
    fontWeight: "500",
  },
});
