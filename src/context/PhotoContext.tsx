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
  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => Promise<void>;
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
      toast.error((error as Error).message || 'Bir hata oluştu');
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
      
      toast.error((error as Error).message || 'Bir hata oluştu');
      throw error;
    }
  };

  const getPhoto = async (id: string): Promise<Photo | null> => {
    try {
      const response = await api.getPhoto(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching photo:', error);
      toast.error((error as Error).message || 'Bir hata oluştu');
      return null;
    }
  };

  const searchPhotos = (query: string): Photo[] => {
    const lowercaseQuery = query.toLowerCase();
    return photos.filter(photo =>
      photo.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const deletePhoto = async (id: string) => {
    try {
      console.log('Silme işlemi başlatılıyor. ID:', id);
      console.log('Mevcut fotoğraflar:', photos);
      
      // Önce fotoğrafın var olduğunu kontrol et
      const photoExists = photos.some(photo => photo._id === id);
      if (!photoExists) {
        console.log('Fotoğraf zaten silinmiş veya mevcut değil:', id);
        setPhotos(photos.filter(photo => photo._id !== id));
        return;
      }

      // Silme isteğini gönder
      console.log('Silme isteği gönderiliyor...');
      const response = await api.deletePhoto(id);
      console.log('Silme yanıtı:', response);

      // Başarılı silme işleminden sonra state'i güncelle
      setPhotos(prevPhotos => {
        const updatedPhotos = prevPhotos.filter(photo => photo._id !== id);
        console.log('Fotoğraflar güncellendi. Kalan fotoğraf sayısı:', updatedPhotos.length);
        return updatedPhotos;
      });

      // Başarılı silme mesajı göster
      toast.success('Fotoğraf başarıyla silindi!');
    } catch (error: any) {
      console.error('Silme hatası:', error);
      console.error('Hata detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Eğer fotoğraf zaten silinmişse (404), state'i güncelle
      if (error.response?.status === 404) {
        console.log('Fotoğraf zaten silinmiş (404 yanıtı alındı), state güncelleniyor...');
        setPhotos(prevPhotos => prevPhotos.filter(photo => photo._id !== id));
        toast('Fotoğraf zaten silinmiş veya bulunamadı.');
      } else {
        toast.error('Fotoğraf silinirken bir hata oluştu.');
        throw error;
      }
    }
  };

  return (
    <PhotoContext.Provider value={{ photos, uploadPhoto, getPhoto, searchPhotos, loading, addPhoto, deletePhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};