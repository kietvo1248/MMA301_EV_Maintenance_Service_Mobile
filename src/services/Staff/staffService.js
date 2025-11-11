
import api from '../../config/api';

// GET TECHNICIANS
export const getTechnicians = async (userId) => {
  const response = await api.get(`/staff/technicians`);
  return response.data;
};

// PUT: Xác nhận & phân công lịch hẹn (PENDING → CONFIRMED)
export const confirmAppointment = async (appointmentId, technicianId) => {
  const response = await api.put(
    `/staff/appointments/${appointmentId}/confirm`,
    { technicianId } 
  );
  return response.data;
};

// Danh sách trạng thái hợp lệ (tránh lỗi typo)
export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// GET: Lấy danh sách lịch hẹn theo trạng thái (tùy chọn)
export const getAppointments = async (status = APPOINTMENT_STATUS.PENDING) => {
  try {
    // Kiểm tra status hợp lệ
    const validStatuses = Object.values(APPOINTMENT_STATUS);
    if (!validStatuses.includes(status)) {
      console.warn(`Status không hợp lệ: ${status}. Mặc định dùng PENDING.`);
      status = APPOINTMENT_STATUS.PENDING;
    }

    const response = await api.get('/staff/appointments', {
      params: { status }, // → ?status=PENDING, ?status=CONFIRMED, ...
    });

    return response.data; // Mảng appointments
  } catch (error) {
    console.error('Lỗi lấy danh sách lịch hẹn:', error);
    throw error;
  }
};

// GET: Lấy chi tiết lịch hẹn theo ID
export const getAppointmentDetails = async (appointmentId) => {
  const response = await api.get(`/staff/appointments/${appointmentId}`);
  return response.data;
};
