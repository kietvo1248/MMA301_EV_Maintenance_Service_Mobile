
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthLogoutCallback } from '../config/api'; // ← import hàm
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      setUser(userInfo ? JSON.parse(userInfo) : null);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // === ĐĂNG KÝ CALLBACK KHI COMPONENT MOUNT ===
  useEffect(() => {
    // Gọi logout từ interceptor → gọi hàm này
    setAuthLogoutCallback(() => {
      logout();
    });

    // Cleanup khi unmount (tùy chọn)
    return () => {
      setAuthLogoutCallback(null);
    };
  }, []);

  const loginAuth = async (token, userData) => {
    const normalizedUser = { ...userData, role: userData.role?.trim().toUpperCase() };
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userInfo']);
    setUser(null);
    Alert.alert('Phiên hết hạn', 'Vui lòng đăng nhập lại');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAuth, logout, reload: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);