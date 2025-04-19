import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  // Format the upload date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="group overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link to={`/photo/${photo._id}`} className="relative block overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 w-full">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </Link>
      <div className="p-4 flex-grow">
        <Link to={`/photo/${photo._id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-indigo-600 transition-colors duration-200">
            {photo.title}
          </h3>
        </Link>
      </div>
      
      <div className="p-4 pt-0 border-t border-gray-100 mt-auto">
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            <span>{photo.uploadedBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(photo.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;