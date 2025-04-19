import axios from 'axios';

const API_URL = 'https://humayat-backend.onrender.com';

export const api = {
  uploadPhoto: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/api/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPhotos: async () => {
    const response = await axios.get(`${API_URL}/api/images`);
    return response.data;
  },
}; 