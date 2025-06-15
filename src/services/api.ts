import axios, { AxiosError } from 'axios';

const BASE_URL = 'https://humayat-backend.onrender.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Retry logic for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (error: AxiosError, retryCount: number = 0): Promise<any> => {
  if (retryCount >= MAX_RETRIES) {
    throw error;
  }

  await sleep(RETRY_DELAY * (retryCount + 1));
  return axiosInstance(error.config!);
};

// Error handling interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Log detailed error information
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific error cases
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log('Request timed out, retrying...');
      return retryRequest(error);
    }

    if (error.response?.status === 429) {
      console.log('Rate limit exceeded, retrying after delay...');
      return retryRequest(error);
    }

    if (!error.response && error.message === 'Network Error') {
      console.log('Network error detected, retrying...');
      return retryRequest(error);
    }

    return Promise.reject(error);
  }
);

export const api = {
  // Fotoğraf işlemleri
  getPhotos: () => axiosInstance.get('/api/images'),
  getPhoto: (id: string) => axiosInstance.get(`/api/images/${id}`),
  checkPhoto: (id: string) => {
    console.log('Fotoğraf kontrol ediliyor. ID:', id);
    return axiosInstance.get(`/api/images/${id}`).then(response => {
      console.log('Fotoğraf bulundu:', response.data);
      return response.data;
    }).catch(error => {
      console.error('Fotoğraf kontrol hatası:', error);
      throw error;
    });
  },
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
  deletePhoto: async (id: string) => {
    try {
      console.log('=== Silme İşlemi Başladı ===');
      console.log('Silme isteği başlatılıyor. ID:', id);
      console.log('Silme isteği URL:', `${axiosInstance.defaults.baseURL}/api/images/${id}`);
      
      // Silme isteğini gönder
      console.log('Silme isteği gönderiliyor...');
      const response = await axiosInstance.delete(`/api/images/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Silme yanıtı:', response.data);
      console.log('=== Silme İşlemi Tamamlandı ===');
      return response.data;
    } catch (error: any) {
      console.error('=== Silme Hatası ===');
      console.error('Hata detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      });

      if (error.response?.status === 404) {
        throw new Error('ID\'li fotoğraf bulunamadı');
      }

      throw new Error(error.response?.data?.error || 'Fotoğraf silinirken bir hata oluştu');
    }
  },
}; 