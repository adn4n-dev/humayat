import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';

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
      toast.error('Fotoğraflar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File, title: string) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('title', title);

      const response = await api.uploadPhoto(formData);
      setPhotos(prev => [response.data, ...prev]);
      toast.success('Humayat başarıyla yüklendi!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Humayat yüklenirken bir hata oluştu.');
      throw error;
    }
  };

  const getPhoto = async (id: string): Promise<Photo | null> => {
    try {
      const response = await api.getPhoto(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching photo:', error);
      toast.error('Fotoğraf yüklenirken bir hata oluştu');
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