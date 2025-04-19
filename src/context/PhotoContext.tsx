import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { Photo } from '../types';

interface PhotoContextType {
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id' | 'uploadedAt'>) => void;
  getPhoto: (id: string) => Photo | undefined;
  searchPhotos: (query: string) => Photo[];
  loading: boolean;
}

const defaultContext: PhotoContextType = {
  photos: [],
  addPhoto: () => {},
  getPhoto: () => undefined,
  searchPhotos: () => [],
  loading: true
};

const PhotoContext = createContext<PhotoContextType>(defaultContext);

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
      const fetchedPhotos = await api.getPhotos();
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = async (photoData: Omit<Photo, 'id' | 'uploadedAt'>) => {
    setPhotos(prev => [photoData as Photo, ...prev]);
  };

  const getPhoto = (id: string) => {
    return photos.find(photo => photo.id === id);
  };

  const searchPhotos = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return photos.filter(
      photo =>
        photo.title.toLowerCase().includes(lowerQuery) ||
        photo.description.toLowerCase().includes(lowerQuery) ||
        photo.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        photo.uploadedBy.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto, getPhoto, searchPhotos, loading }}>
      {children}
    </PhotoContext.Provider>
  );
};