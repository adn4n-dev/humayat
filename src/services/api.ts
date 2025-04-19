import axios from 'axios';

const BASE_URL = 'https://humayat-backend.onrender.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const api = {
  // Fotoğraf işlemleri
  getPhotos: () => axiosInstance.get('/api/images'),
  getPhoto: (id: string) => axiosInstance.get(`/api/images/${id}`),
  uploadPhoto: (formData: FormData) => axiosInstance.post('/api/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  searchPhotos: (query: string) => axiosInstance.get(`/api/images/search?q=${query}`),
}; 