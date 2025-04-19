import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Share } from 'lucide-react';
import { usePhotoContext } from '../context/PhotoContext';
import PhotoDetail from '../components/photo/PhotoDetail';
import EmptyState from '../components/common/EmptyState';

const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { photos, getPhoto } = usePhotoContext();
  const [photo, setPhoto] = useState(id ? getPhoto(id) : undefined);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPhoto = getPhoto(id);
      setPhoto(foundPhoto);
      
      if (foundPhoto && photos.length > 0) {
        const index = photos.findIndex(p => p.id === foundPhoto.id);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }
  }, [id, getPhoto, photos]);

  const handlePrevPhoto = () => {
    if (currentIndex > 0) {
      const prevPhoto = photos[currentIndex - 1];
      navigate(`/photo/${prevPhoto.id}`);
    }
  };

  const handleNextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      const nextPhoto = photos[currentIndex + 1];
      navigate(`/photo/${nextPhoto.id}`);
    }
  };

  const handleShareClick = () => {
    if (navigator.share && photo) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href,
      }).catch(() => {
        // Fallback: copy link to clipboard
        navigator.clipboard.writeText(window.location.href);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  if (!photo) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>humayatlara geri dön</span>
          </Link>
        </div>
        
        <EmptyState 
          title="fotoğraf bulunmadı" 
          message="The photo you're looking for doesn't exist or may have been removed."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>humayatlara geri dön</span>
        </Link>
        
        <div className="relative">
          <button
            onClick={handleShareClick}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors duration-200"
          >
            <Share className="w-4 h-4 mr-1" />
            <span>paylas</span>
          </button>
          
          {showShareTooltip && (
            <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg z-10 whitespace-nowrap">
              humayat linki kopyalanDİ
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-12">
        <PhotoDetail 
          photo={photo}
          nextPhoto={currentIndex < photos.length - 1 ? handleNextPhoto : undefined}
          prevPhoto={currentIndex > 0 ? handlePrevPhoto : undefined}
          hasNext={currentIndex < photos.length - 1}
          hasPrev={currentIndex > 0}
        />
      </div>
      
      {photos.length > 1 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">baska humayatlar</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {photos
              .filter(p => p.id !== photo.id)
              .slice(0, 6)
              .map(p => (
                <Link 
                  key={p.id} 
                  to={`/photo/${p.id}`}
                  className="block aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity duration-200"
                >
                  <img 
                    src={p.url} 
                    alt={p.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoDetailPage;