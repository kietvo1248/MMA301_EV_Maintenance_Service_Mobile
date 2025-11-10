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

// TODO(stagewise): Replace with real authentication service
const MOCK_STAFF_DATA = {
  email: 'staff@evmaintenance.com',
  password: 'staff123',
  name: 'Nguyễn Văn A',
  role: 'staff',
  id: 'ST001'
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      isValid = false;
    }

    // Validate password
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
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // TODO(stagewise): Replace with real API call
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check against mock data
      if (email === MOCK_STAFF_DATA.email && password === MOCK_STAFF_DATA.password) {
        Alert.alert(
          'Đăng nhập thành công!',
          `Chào mừng ${MOCK_STAFF_DATA.name} - ${MOCK_STAFF_DATA.role}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to main app
                if (navigation && navigation.replace) {
                  navigation.replace('Home');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Lỗi đăng nhập', 'Email hoặc mật khẩu không chính xác');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const fillStaffCredentials = () => {
    setEmail(MOCK_STAFF_DATA.email);
    setPassword(MOCK_STAFF_DATA.password);
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
            <Text style={styles.logo}>⚡</Text>
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
                importantForAutofill="yes"
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
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                importantForAutofill="yes"
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading ? styles.loginButtonDisabled : null]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={fillStaffCredentials}
              activeOpacity={0.8}
            >
              <Text style={styles.demoButtonText}>Điền thông tin Staff demo</Text>
            </TouchableOpacity>

            <View style={styles.demoInfo}>
              <Text style={styles.demoInfoTitle}>Thông tin đăng nhập demo:</Text>
              <Text style={styles.demoInfoText}>Email: {MOCK_STAFF_DATA.email}</Text>
              <Text style={styles.demoInfoText}>Password: {MOCK_STAFF_DATA.password}</Text>
              <Text style={styles.demoInfoText}>Role: {MOCK_STAFF_DATA.role}</Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
    minHeight: 50,
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    minHeight: 55,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#27ae60',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginButtonDisabled: {
    backgroundColor: '#95a5a6',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 15,
    minHeight: 45,
    justifyContent: 'center',
  },
  demoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  demoInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  demoInfoText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
});

export default LoginScreen;