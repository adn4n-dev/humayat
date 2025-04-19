import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePhotoContext } from '../context/PhotoContext';
import { ArrowLeft, Download } from 'lucide-react';

const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPhoto } = usePhotoContext();
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!id) return;
      try {
        const photoData = await getPhoto(id);
        setPhoto(photoData);
      } catch (error) {
        console.error('Error fetching photo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id, getPhoto]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-300 mb-4">Humayat bulunamadı</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Ana Sayfaya Dön</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Geri</span>
        </button>
      </div>

      <div className="bg-dark-800 rounded-lg shadow-lg overflow-hidden border border-dark-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-300 mb-4">{photo.title}</h1>
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-primary-400">
              <span>Yükleyen: {photo.uploadedBy}</span>
              <span className="mx-2">•</span>
              <span>{new Date(photo.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
            <a
              href={photo.url}
              download
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>İndir</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailPage;