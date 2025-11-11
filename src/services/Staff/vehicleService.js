import api from '../../config/api';

//GET danh sách dòng xe
export const getVehicleModels = async () => {
  const response = await api.get('/vehicle/models');
  return response.data;
}


// Response body

// [
//   {
//     "id": "6ed39663-ed31-45bd-9e1d-6ce38839ddf7",
//     "brand": "VinFast",
//     "name": "VF8"
//   },
//   {
//     "id": "8f311cb9-ab92-4d19-8436-c460a32b9f48",
//     "brand": "VinFast",
//     "name": "VF e34"
//   }
// ]

// GET danh sách pin tương thích
export const getBatteries = async (modelId) => {
  const response = await api.get(`/vehicle/models/${modelId}/batteries`);
  return response.data;
}

	
// Response body

// [
//   {
//     "id": "58b90879-8058-4ee2-9372-5a0cbd587785",
//     "name": "Pin LFP 90kWh (Thuê)",
//     "capacityKwh": "90"
//   }
// ]