import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Photo } from '../types';

interface PhotoContextType {
  photos: Photo[];
  addPhoto: (photo: Omit<Photo, 'id' | 'uploadedAt'>) => void;
  getPhoto: (id: string) => Photo | undefined;
  searchPhotos: (query: string) => Photo[];
  loading: boolean;
}

const PhotoContext = createContext<PhotoContextType>({
  photos: [],
  addPhoto: () => {},
  getPhoto: () => undefined,
  searchPhotos: () => [],
  loading: true
});

export const usePhotoContext = () => useContext(PhotoContext);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load photos from localStorage
  useEffect(() => {
    const savedPhotos = localStorage.getItem('photoArchive');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
    setLoading(false);
  }, []);

  // Save photos to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('photoArchive', JSON.stringify(photos));
    }
  }, [photos, loading]);

  const addPhoto = (photoData: Omit<Photo, 'id' | 'uploadedAt'>) => {
    const newPhoto: Photo = {
      ...photoData,
      id: uuidv4(),
      uploadedAt: Date.now()
    };
    setPhotos(prev => [newPhoto, ...prev]);
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