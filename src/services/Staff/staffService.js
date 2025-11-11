
import api from '../../config/api';

// GET TECHNICIANS
export const getTechnicians = async (userId) => {
  const response = await api.get(`/staff/technicians`);
  return response.data;
};
