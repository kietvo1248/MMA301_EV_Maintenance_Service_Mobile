import api from '../../config/api';

// GET SERVICE TYPES
export const getServiceTypes = async () => {
  const response = await api.get('appointments/service-types');
  return response.data;
}