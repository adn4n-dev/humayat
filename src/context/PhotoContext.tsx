import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { AxiosError } from 'axios';

interface Photo {
  _id: string;
  title: string;
  url: string;
  uploadedBy: string;
  createdAt: string;
  cloudinaryId: string;
  updatedAt: string;
}

interface PhotoContextType {
  photos: Photo[];
  uploadPhoto: (file: File, title: string) => Promise<void>;
  getPhoto: (id: string) => Promise<Photo | null>;
  searchPhotos: (query: string) => Photo[];
  loading: boolean;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
};

const getErrorMessage = (error: any) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }
  if (error.message) {
    return error.message;
  }
  return 'Bir hata oluştu';
};

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await api.getPhotos();
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File, title: string) => {
    try {
      // Dosya boyutu kontrolü (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Dosya boyutu 10MB\'dan büyük olamaz');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        toast.error('Sadece resim dosyaları yüklenebilir');
        return;
      }

      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        title: title
      });

      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);

      const response = await api.uploadPhoto(formData);
      console.log('Upload response:', response);
      
      setPhotos(prev => [response.data, ...prev]);
      toast.success('Humayat başarıyla yüklendi!');
    } catch (error) {
      console.error('Upload error details:', {
        error,
        type: error instanceof Error ? 'Error' : typeof error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const getPhoto = async (id: string): Promise<Photo | null> => {
    try {
      const response = await api.getPhoto(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching photo:', error);
      toast.error(getErrorMessage(error));
      return null;
    }
  };

  const searchPhotos = (query: string): Photo[] => {
    const lowercaseQuery = query.toLowerCase();
    return photos.filter(photo =>
      photo.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <PhotoContext.Provider value={{ photos, uploadPhoto, getPhoto, searchPhotos, loading }}>
      {children}
    </PhotoContext.Provider>
  );
};