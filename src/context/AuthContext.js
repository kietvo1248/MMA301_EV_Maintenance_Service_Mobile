// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const loginAuth = async (token, userData) => {
    const normalizedUser = { ...userData, role: userData.role?.trim().toUpperCase() };
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(normalizedUser));
    setUser(normalizedUser); // ← Cập nhật ngay lập tức
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userInfo']);
    setUser(null); // ← Cập nhật ngay
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAuth, logout, reload: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);