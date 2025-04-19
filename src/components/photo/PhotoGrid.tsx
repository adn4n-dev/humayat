import React from 'react';
import Masonry from 'react-masonry-css';
import PhotoCard from './PhotoCard';
import { Photo } from '../../types';

interface PhotoGridProps {
  photos: Photo[];
  layout?: 'grid' | 'masonry';
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, layout = 'grid' }) => {
  // Breakpoints for the masonry layout
  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">humayat yokmus</h3>
        <p className="text-gray-500 max-w-md">
          hic humayat yokk :( humayat yukle hemen!!
        </p>
      </div>
    );
  }

  if (layout === 'masonry') {
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {photos.map((photo) => (
          <div key={photo.id} className="mb-4">
            <PhotoCard photo={photo} />
          </div>
        ))}
      </Masonry>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

export default PhotoGrid;