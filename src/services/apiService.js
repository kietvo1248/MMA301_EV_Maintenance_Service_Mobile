import api from '../config/api';

// POST - Đăng nhập
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

// GET - Lấy danh sách dòng xe (hỗ trợ)
export const getVehicleModels = async () => {
    const response = await api.get('/vehicle/models');
    return response.data;
};

// GET - Lấy danh sách Pin tương thích theo modelId
export const getVehicleBatteries = async (modelId) => {
    const response = await api.get(`/vehicle/models/${modelId}/batteries`);
    return response.data;
};

// POST - Thêm xe mới (CRUD)
export const addVehicle = async (vehicleData) => {
    const response = await api.post('/vehicle/add-vehicle', vehicleData);
    return response.data;
};

// GET - Lấy danh sách xe của tôi (CRUD)
export const getMyVehicles = async () => {
    const response = await api.get('/vehicle/my-vehicles');
    return response.data;
};

// GET - Lấy chi tiết một xe
export const getVehicleDetails = async (id) => {
    const response = await api.get(`/vehicle/vehicle-details/${id}`);
    return response.data;
};

// PUT - Cập nhật thông tin xe
export const updateVehicle = async (id, vehicleData) => {
    const response = await api.put(`/vehicle/update-vehicle/${id}`, vehicleData);
    return response.data;
};

// DELETE - Xóa (xóa mềm) một xe
export const deleteVehicle = async (id) => {
    const response = await api.delete(`/vehicle/delete-vehicle/${id}`);
    return response.data;
};

// ==============================
// 📅 APPOINTMENT API (Lịch hẹn)
// ==============================

// L1.2 - Lấy danh sách xe của tôi (dành cho chọn lịch)
export const getMyVehiclesForAppointment = async () => {
  const response = await api.get('/appointments/my-vehicles');
  return response.data;
};

// L1.3 - Lấy danh sách loại dịch vụ
export const getServiceTypes = async () => {
  const response = await api.get('/appointments/service-types');
  return response.data;
};

// L1.3b - Lấy gợi ý dịch vụ theo xe đã lưu
export const getServiceSuggestions = async () => {
  const response = await api.get('/appointments/suggestions');
  return response.data;
};

// L1.4 - Lấy danh sách trung tâm dịch vụ
export const getServiceCenters = async () => {
  const response = await api.get('/service-centers');
  return response.data;
};

// L1.5 - Lấy các khung giờ trống theo ngày (để chọn đặt lịch)
export const getAvailableSlots = async (id, date) => {
  const response = await api.get(`/service-centers/${id}/available-slots`, {
    params: { date }, // thêm query param date
  });
  return response.data;
};


// L1.6 - Xác nhận & tạo lịch hẹn mới
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments/create-appointment', appointmentData);
  return response.data;
};

// L1.7 - Xem chi tiết lịch hẹn
export const getAppointmentDetails = async (appointmentId) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return response.data;
};

// L1.8 - Phản hồi báo giá (Duyệt/Từ chối)
export const respondQuotation = async (appointmentId, payload) => {
  const response = await api.put(`/appointments/${appointmentId}/respond-quotation`, payload);
  return response.data;
};

// L1.9 - Lấy lịch sử lịch hẹn
export const getAppointmentHistory = async () => {
  const response = await api.get('/appointments/history');
  return response.data;
};

// ==============================
// 👤 AUTH PROFILE API
// ==============================

// Lấy thông tin cá nhân (My Profile)
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Cập nhật thông tin cá nhân
export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/update-profile', profileData);
  return response.data;
};
