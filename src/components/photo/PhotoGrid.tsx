import React from 'react';
import Masonry from 'react-masonry-css';
import PhotoCard from './PhotoCard';
import { Photo } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhotoContext } from '../../context/PhotoContext';

interface PhotoGridProps {
  photos: Photo[];
  layout?: 'grid' | 'masonry';
  itemVariants?: any;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, layout = 'grid', itemVariants }) => {
  const { deletePhoto } = usePhotoContext();

  // Breakpoints for the masonry layout
  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  const handleDelete = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (photos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center"
      >
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
          humayat yokmus
        </h3>
        <p className="text-gray-400 max-w-md text-sm md:text-base">
          hic humayat yokk :(
        </p>
      </motion.div>
    );
  }

  if (layout === 'masonry') {
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -ml-2 md:-ml-4"
        columnClassName="pl-2 md:pl-4 bg-clip-padding"
      >
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ delay: index * 0.05 }}
              className="mb-2 md:mb-4"
            >
              <PhotoCard photo={photo} onDelete={handleDelete} />
            </motion.div>
          ))}
        </AnimatePresence>
      </Masonry>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6">
      <AnimatePresence>
        {photos.map((photo, index) => (
          <motion.div
            key={photo._id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ delay: index * 0.05 }}
            className="w-full"
          >
            <PhotoCard photo={photo} onDelete={handleDelete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGrid;