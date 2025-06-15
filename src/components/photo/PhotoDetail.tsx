import React, { useState } from 'react';
import { User, Calendar, Tag, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Photo } from '../../types';

interface PhotoDetailProps {
  photo: Photo;
  onClose?: () => void;
  nextPhoto?: () => void;
  prevPhoto?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const PhotoDetail: React.FC<PhotoDetailProps> = ({
  photo,
  onClose,
  nextPhoto,
  prevPhoto,
  hasNext = false,
  hasPrev = false
}) => {
  const [fullScreen, setFullScreen] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <div className={`bg-white transition-all duration-300 ${fullScreen ? 'fixed inset-0 z-50' : 'rounded-lg shadow-md overflow-hidden'}`}>
      {/* Photo Header with Controls */}
      <div className="relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
            aria-label="kapatt"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Image Container */}
        <div 
          className="relative cursor-pointer"
          onClick={toggleFullScreen}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className={`w-full ${fullScreen ? 'h-screen object-contain' : 'object-cover max-h-[70vh]'}`}
          />

          {/* Navigation Arrows */}
          {prevPhoto && hasPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {nextPhoto && hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-200"
              aria-label="ileri foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Photo Details */}
      <div className={`p-6 ${fullScreen ? 'absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className={`text-2xl font-bold ${fullScreen ? 'text-white' : 'text-gray-800'}`}>{photo.title}</h2>
          
          <a 
            href={photo.url} 
            download 
            target="_blank" 
            rel="noreferrer"
            className={`p-2 rounded-full ${
              fullScreen 
                ? 'bg-white text-gray-800 hover:bg-gray-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
            aria-label="indir foto"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>

        <p className={`mb-6 ${fullScreen ? 'text-gray-200' : 'text-gray-600'}`}>{photo.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {(photo.tags ?? []).map(tag => (
            <span 
              key={tag} 
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                fullScreen 
                  ? 'bg-gray-800 bg-opacity-20 text-white' 
                  : 'bg-gray-800 text-white'
              }`}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className={`flex flex-wrap justify-between items-center text-sm ${fullScreen ? 'text-gray-300' : 'text-gray-500'}`}>
          <div className="flex items-center mr-4">
            <User className="w-4 h-4 mr-1" />
            <span>yuklendi {photo.uploadedBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{photo.uploadedAt ? formatDate(Number(photo.uploadedAt)) : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;