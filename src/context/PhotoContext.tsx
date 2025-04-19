import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Photo } from '../types';

interface PhotoContextType {
  photos: Photo[];
  uploadPhoto: (file: File, title: string) => Promise<void>;
  getPhoto: (id: string) => Promise<Photo | null>;
  deletePhoto: (id: string) => Promise<boolean>;
  searchPhotos: (query: string) => Photo[];
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

  const uploadPhoto = async (file: File, title: string) => {
    try {
      // Simüle edilmiş yükleme
      const newPhoto: Photo = {
        _id: Date.now().toString(),
        title,
        url: URL.createObjectURL(file),
        uploadedBy: 'adnan(bibi)',
        createdAt: new Date().toISOString(),
      };

      setPhotos(prev => [newPhoto, ...prev]);
      toast.success('Humayat başarıyla yüklendi!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Humayat yüklenirken bir hata oluştu.');
      throw error;
    }
  };

  const getPhoto = async (id: string): Promise<Photo | null> => {
    const photo = photos.find(p => p._id === id);
    return photo || null;
  };

  const deletePhoto = async (id: string): Promise<boolean> => {
    try {
      setPhotos(prev => prev.filter(photo => photo._id !== id));
      toast.success('Humayat başarıyla silindi!');
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Humayat silinirken bir hata oluştu.');
      return false;
    }
  };

  const searchPhotos = (query: string): Photo[] => {
    const lowercaseQuery = query.toLowerCase();
    return photos.filter(photo =>
      photo.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <PhotoContext.Provider value={{ photos, uploadPhoto, getPhoto, deletePhoto, searchPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
};