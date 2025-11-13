
import api from '../config/api';

// POST
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

//API FOR TECHNICIAN ROLE 



export const getTechnicianTasks = async (status) => {
  try {
    const params = status ? { status } : {};

    const response = await api.get("/technician/my-tasks", { params });

    console.log("Technician tasks fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching technician tasks:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const getTechnicianProfile = async () => {
    const response = await api.get('/technician/profile');
    return response.data;
};

