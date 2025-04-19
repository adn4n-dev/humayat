import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://humayat-backend.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const api = {
  // Fotoğraf işlemleri
  getPhotos: () => axiosInstance.get('/photos'),
  getPhoto: (id: string) => axiosInstance.get(`/photos/${id}`),
  uploadPhoto: (formData: FormData) => axiosInstance.post('/photos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  searchPhotos: (query: string) => axiosInstance.get(`/photos/search?q=${query}`),
}; 