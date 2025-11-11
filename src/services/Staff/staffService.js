
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

/**
 * Bắt đầu dịch vụ - Check-in xe
 * CONFIRMED → IN_PROGRESS
 * @param {string} appointmentId - ID lịch hẹn (uuid)
 * @param {number} currentMileage - Số km hiện tại của xe
 * @returns {Promise<Object>} - Response data
 */
export const startAppointment = async (appointmentId, currentMileage) => {
  if (!appointmentId || currentMileage == null) {
    throw new Error('appointmentId và currentMileage là bắt buộc');
  }

  if (typeof currentMileage !== 'number' || currentMileage < 0) {
    throw new Error('currentMileage phải là số không âm');
  }

  try {
    const response = await api.put(
      `/staff/appointments/${appointmentId}/start`,
      { currentMileage } // Body đúng format
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi bắt đầu dịch vụ:', error);
    throw error;
  }
};

/**
 * Tìm khách hàng theo số điện thoại (Walk-in)
 * @param {string} phone - Số điện thoại (vd: 0123456789)
 * @returns {Promise<Object|null>} - Thông tin khách hàng hoặc null nếu không tìm thấy
 */
export const searchCustomer = async (phone) => {
  if (!phone || phone.trim() === '') {
    throw new Error('Số điện thoại là bắt buộc');
  }

  // Chuẩn hóa số điện thoại (loại bỏ khoảng trắng, dấu -)
  const cleanPhone = phone.replace(/[\s-]/g, '');

  try {
    const response = await api.get('/staff/customers/search', {
      params: { phone: cleanPhone },
    });

    // API trả về mảng → lấy phần tử đầu tiên (nếu có)
    const customers = response.data;
    return Array.isArray(customers) && customers.length > 0 ? customers[0] : null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Không tìm thấy → trả null (không lỗi)
    }
    console.error('Lỗi tìm khách hàng:', error);
    throw error;
  }
};

/**
 * Tạo khách hàng mới (Walk-in) - Khi không tìm thấy
 * @param {Object} customerData
 * @param {string} customerData.fullName
 * @param {string} customerData.phoneNumber
 * @param {string} [customerData.email]
 * @returns {Promise<Object>} - Thông tin khách hàng mới + temporaryPassword
 */
export const createCustomer = async ({ fullName, phoneNumber, email }) => {
  if (!fullName || !phoneNumber) {
    throw new Error('Họ tên và số điện thoại là bắt buộc');
  }

  const payload = {
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.replace(/[\s-]/g, ''),
    email: email?.trim() || null,
  };

  try {
    const response = await api.post('/staff/customers/create', payload);
    return response.data; // { user: { ... }, temporaryPassword: "123456" }
  } catch (error) {
    console.error('Lỗi tạo khách:', error);
    throw error;
  }
};

/**
 * Thêm xe mới cho khách hàng (Walk-in)
 * @param {string} customerId - ID khách hàng (uuid)
 * @param {Object} vehicleData
 * @param {string} vehicleData.vin - Số khung
 * @param {number} vehicleData.year - Năm sản xuất
 * @param {string} vehicleData.vehicleModelId - ID dòng xe
 * @param {string} vehicleData.batteryId - ID pin
 * @param {string} vehicleData.licensePlate - Biển số
 * @param {string} vehicleData.color - Màu xe
 * @param {number} vehicleData.currentMileage - Số km hiện tại
 * @returns {Promise<Object>} - Thông tin xe đã tạo
 */
export const addVehicleForCustomer = async (customerId, vehicleData) => {
  if (!customerId) {
    throw new Error('customerId là bắt buộc');
  }

  const {
    vin,
    year,
    vehicleModelId,
    batteryId,
    licensePlate,
    color,
    currentMileage,
  } = vehicleData;

  // Validate bắt buộc
  if (!vin || !year || !vehicleModelId || !batteryId || !licensePlate || !color || currentMileage == null) {
    throw new Error('Thiếu thông tin xe bắt buộc');
  }

  if (typeof currentMileage !== 'number' || currentMileage < 0) {
    throw new Error('currentMileage phải là số không âm');
  }

  if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
    throw new Error('Năm sản xuất không hợp lệ');
  }

  const payload = {
    vin: vin.trim(),
    year,
    vehicleModelId,
    batteryId,
    licensePlate: licensePlate.trim().toUpperCase(),
    color: color.trim(),
    currentMileage,
  };

  try {
    const response = await api.post(`/staff/customers/${customerId}/vehicles`, payload);
    return response.data; // → Object xe đầy đủ (có vehicleModel, battery)
  } catch (error) {
    console.error('Lỗi thêm xe:', error.response?.data);
    const msg = error.response?.data?.message || 'Không thể thêm xe';
    throw new Error(msg);
  }
};

/**
 * Tìm lịch hẹn theo số điện thoại khách (dùng để Check-in)
 * Chỉ trả về lịch CONFIRMED 
 * @param {string} phone - Số điện thoại khách
 * @returns {Promise<Array>} - Danh sách lịch hẹn
 */
export const searchAppointmentsByPhone = async (phone) => {
  if (!phone || phone.trim() === '') {
    throw new Error('Số điện thoại là bắt buộc');
  }

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, ''); // Loại bỏ space, -, (, )

  if (cleanPhone.length < 9 || cleanPhone.length > 11) {
    throw new Error('Số điện thoại không hợp lệ');
  }

  try {
    const response = await api.get('/staff/appointments/search', {
      params: { phone: cleanPhone },
    });

    return response.data
  } catch (error) {
    console.error('Lỗi tìm lịch hẹn:', error.response?.data);
    if (error.response?.status === 404 || error.response?.data?.length === 0) {
      return []; // Không tìm thấy → trả mảng rỗng
    }
    const msg = error.response?.data?.message || 'Không thể tìm lịch hẹn';
    throw new Error(msg);
  }
};

/**
 * Tạo và bắt đầu lịch hẹn ngay (Walk-in)
 * → Tạo appointment + serviceRecord → Trạng thái IN_PROGRESS
 * @param {Object} data
 * @param {string} data.customerId - ID khách hàng
 * @param {string} data.vehicleId - ID xe
 * @param {string} data.appointmentDate - ISO string (ngay giờ hiện tại)
 * @param {string[]} data.requestedServices - Mảng ID dịch vụ
 * @param {string} data.technicianId - ID kỹ thuật viên
 * @param {string} [data.customerNotes] - Ghi chú khách
 * @returns {Promise<Object>} - { appointment, serviceRecord }
 */
export const createWalkInAppointment = async ({
  customerId,
  vehicleId,
  appointmentDate,
  requestedServices,
  technicianId,
  customerNotes = '',
}) => {
  // === VALIDATE ===
  if (!customerId || !vehicleId || !appointmentDate || !technicianId) {
    throw new Error('Thiếu thông tin bắt buộc: customerId, vehicleId, appointmentDate, technicianId');
  }

  if (!Array.isArray(requestedServices) || requestedServices.length === 0) {
    throw new Error('Vui lòng chọn ít nhất 1 dịch vụ');
  }

  const now = new Date().toISOString();
  const apptDate = new Date(appointmentDate);
  if (isNaN(apptDate.getTime())) {
    throw new Error('appointmentDate không hợp lệ');
  }

  const payload = {
    customerId: customerId.trim(),
    vehicleId: vehicleId.trim(),
    appointmentDate: apptDate.toISOString(),
    requestedServices,
    technicianId: technicianId.trim(),
    customerNotes: customerNotes.trim(),
  };

  try {
    const response = await api.post('/staff/appointments/create-walk-in', payload);
    return response.data.data; // { appointment, serviceRecord }
  } catch (error) {
    console.error('Lỗi tạo Walk-in:', error.response?.data);
    const msg = error.response?.data?.message || 'Không thể tạo lịch hẹn Walk-in';
    throw new Error(msg);
  }
};