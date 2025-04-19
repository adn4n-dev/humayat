import axios, { AxiosError } from 'axios';

const BASE_URL = 'https://humayat-backend.onrender.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Timeout'u 30 saniyeye çıkardım çünkü Render free tier yavaş olabiliyor
});

// Hata yakalama interceptor'ı
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 500) {
      console.error('Server error details:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Fotoğraf işlemleri
  getPhotos: () => axiosInstance.get('/api/images'),
  getPhoto: (id: string) => axiosInstance.get(`/api/images/${id}`),
  uploadPhoto: (formData: FormData) => axiosInstance.post('/api/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    // Upload progress için onUploadProgress ekleyebiliriz
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    },
  }),
  searchPhotos: (query: string) => axiosInstance.get(`/api/images/search?q=${query}`),
}; 