import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../services/apiService'; // Dùng API service
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAuth } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login successful:', result);

      const { token, user } = result;

      await loginAuth(token, user);

      Alert.alert(
        'Đăng nhập thành công!',
        `Chào mừng ${user.name || user.email} - ${user.role}`,
        [
          {
            text: 'OK',
          
          },
        ]
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Email hoặc mật khẩu không đúng';

      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm điền demo (giữ lại để test nhanh)
  const fillDemoCredentials = () => {
    setEmail('staff.hcm@evservice.com');
    setPassword('staff123');
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
            <Text style={styles.logo}>Lightning Bolt</Text>
            <Text style={styles.title}>EV Maintenance</Text>
            <Text style={styles.subtitle}>Hệ thống bảo dưỡng xe điện</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Nhập email của bạn"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </TouchableOpacity>

            {/* Nút demo (chỉ để dev) */}
            <TouchableOpacity style={styles.demoButton} onPress={fillDemoCredentials}>
              <Text style={styles.demoButtonText}>Điền thông tin demo</Text>
            </TouchableOpacity>

            <View style={styles.demoInfo}>
              <Text style={styles.demoInfoTitle}>Demo (dev only):</Text>
              <Text style={styles.demoInfoText}>Email: staff.hcm@evservice.com</Text>
              <Text style={styles.demoInfoText}>Pass: staff123</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  keyboardView: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 40, marginBottom: 10, color: '#27ae60', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center' },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputError: { borderColor: '#e74c3c', backgroundColor: '#fdf2f2' },
  errorText: { color: '#e74c3c', fontSize: 14, marginTop: 5, marginLeft: 5 },
  loginButton: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    elevation: 6,
  },
  loginButtonDisabled: { backgroundColor: '#95a5a6', elevation: 2 },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  demoButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  demoButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  demoInfo: { backgroundColor: '#ecf0f1', borderRadius: 10, padding: 15, marginTop: 20 },
  demoInfoTitle: { fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  demoInfoText: { fontSize: 12, color: '#7f8c8d', marginBottom: 2 },
});

export default LoginScreen;