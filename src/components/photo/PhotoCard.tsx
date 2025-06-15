import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Photo } from '../../types';
import { format } from 'date-fns';

interface PhotoCardProps {
  photo: Photo;
  onDelete?: (photoId: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/photo/${photo._id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    if (onDelete) {
      console.log('PhotoCard: Delete button clicked for photo:', {
        id: photo._id,
        title: photo.title
      });
      onDelete(photo._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-800 relative group"
      onClick={handleCardClick}
    >
      <div className="w-full h-40 sm:h-48 md:h-64 overflow-hidden">
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="absolute top-2 right-2 p-2 bg-red-800/80 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Delete photo"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
      <div className="p-3 md:p-4">
        <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 truncate">{photo.title}</h3>
        <p className="text-gray-400 text-xs md:text-sm mb-2 truncate">{photo.description}</p>
        <div className="flex items-center justify-between text-gray-400 text-xs">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 text-white" />
            <span className="text-white text-xs md:text-sm">{photo.uploadedBy || 'Anonymous'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-white" />
            <span className="text-white text-xs md:text-sm">{format(new Date(photo.createdAt), 'dd MMM yyyy')}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;