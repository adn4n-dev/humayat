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
    console.error('Full error object:', error);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);
    
    if (error.response?.status === 500) {
      console.error('Server error details:', {
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Fotoğraf işlemleri
  getPhotos: () => axiosInstance.get('/api/images'),
  getPhoto: (id: string) => axiosInstance.get(`/api/images/${id}`),
  uploadPhoto: (formData: FormData) => {
    // FormData içeriğini kontrol et
    console.log('FormData contents:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return axiosInstance.post('/api/images/upload', formData, {
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
    }).catch(error => {
      console.error('Upload error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    });
  },
  searchPhotos: (query: string) => axiosInstance.get(`/api/images/search?q=${query}`),
}; 