import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, LayoutGrid, Camera, Sliders } from 'lucide-react';
import { usePhotoContext } from '../context/PhotoContext';
import PhotoGrid from '../components/photo/PhotoGrid';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { photos, searchPhotos, loading } = usePhotoContext();
  const [searchResults, setSearchResults] = useState(photos);
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setSearchResults(searchPhotos(searchQuery));
    } else {
      setSearchResults(photos);
    }
  }, [photos, searchQuery, searchPhotos]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchResults(searchPhotos(query));
    } else {
      setSearchResults(photos);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Humayatlar</h1>
        <p className="text-gray-600">Humayatlar iste "sinirli emoji"</p>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="w-full md:w-2/3">
          <SearchBar onSearch={handleSearch} placeholder="humayat ara..." />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFilters}
            className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Toggle filters"
          >
            <Sliders className="w-5 h-5" />
          </button>
          
          <div className="border-l border-gray-300 h-6 mx-1"></div>
          
          <button
            onClick={() => setLayout('grid')}
            className={`p-2 border rounded-md transition-colors duration-200 ${
              layout === 'grid'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Grid layout"
          >
            <Grid className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setLayout('masonry')}
            className={`p-2 border rounded-md transition-colors duration-200 ${
              layout === 'masonry'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-label="Masonry layout"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/upload')}
            className="hidden md:flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            <Camera className="w-4 h-4 mr-1" />
            <span>Yeni Humayat Yükle</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-slideDown">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Humayat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-sm text-gray-500">
              humayatfiltreyakındagelirbelki.
            </div>
          </div>
        </div>
      )}
      
      {/* Photo Grid */}
      <div className="mb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : photos.length === 0 ? (
          <EmptyState />
        ) : searchResults.length === 0 ? (
          <EmptyState 
            title="No matching photos in Humayat" 
            message={`We couldn't find any photos matching "${searchQuery}". Try a different search term.`}
            showUploadButton={false}
          />
        ) : (
          <>
            {searchQuery && (
              <p className="text-sm text-gray-600 mb-4">
                Found {searchResults.length} {searchResults.length === 1 ? 'photo' : 'photos'} in Humayat matching "{searchQuery}"
              </p>
            )}
            <PhotoGrid photos={searchResults} layout={layout} />
          </>
        )}
      </div>
      
      {/* Mobile Upload Button */}
      <div className="md:hidden fixed right-6 bottom-6 z-10">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200"
          aria-label="Upload to Humayat"
        >
          <Camera className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;