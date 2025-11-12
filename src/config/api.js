
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// // DÙNG TRỰC TIẾP process.env
// const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_TIMEOUT = process.env.API_TIMEOUT || '15000';

// console.log('EXPO_PUBLIC_API_URL (process.env):', EXPO_PUBLIC_API_URL);

// if (!EXPO_PUBLIC_API_URL) {
//   throw new Error('process.env.EXPO_PUBLIC_API_URL chưa được cấu hình! Kiểm tra .env và babel.config.js');
// }

// const api = axios.create({
//   baseURL: EXPO_PUBLIC_API_URL,
//   timeout: Number(API_TIMEOUT),
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptor: Tự động thêm token vào mọi request
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.warn('Lỗi lấy token:', error);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Interceptor: Xử lý lỗi 401 (token hết hạn)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       // if (error.response?.status === 401 ) {
//       // Optional: Tự động logout
//       AsyncStorage.multiRemove(['userToken', 'userInfo']);
//       // navigation.navigate('Login'); // nếu dùng context
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// === BIẾN TOÀN CỤC ĐỂ LƯU CALLBACK LOGOUT ===
let logoutFromInterceptor = null;

export const setAuthLogoutCallback = (callback) => {
  logoutFromInterceptor = callback;
};

// === CẤU HÌNH API ===
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_TIMEOUT = process.env.API_TIMEOUT || '15000';

if (!EXPO_PUBLIC_API_URL) {
  throw new Error('process.env.EXPO_PUBLIC_API_URL chưa được cấu hình!');
}

const api = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
  timeout: Number(API_TIMEOUT),
  headers: {
    'Content-Type': 'application/json',
  },
});

// === REQUEST: Thêm token ===
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Lỗi lấy token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE: Xử lý 401 → gọi logout ===
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Token hết hạn → Tự động logout');

      // Xóa local
      await AsyncStorage.multiRemove(['userToken', 'userInfo']);

      // GỌI LOGOUT TỪ CONTEXT (nếu đã đăng ký)
      if (typeof logoutFromInterceptor === 'function') {
        logoutFromInterceptor();
      }
    }
    return Promise.reject(error);
  }
);

export default api;