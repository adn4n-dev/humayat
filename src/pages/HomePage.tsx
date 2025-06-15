import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, LayoutGrid, Camera, Sliders, Search } from 'lucide-react';
import { usePhotoContext } from '../context/PhotoContext';
import PhotoGrid from '../components/photo/PhotoGrid';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Lottie from 'lottie-react';
import heartAnimation from '../../public/animations/heart_animation.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { photos, searchPhotos, loading } = usePhotoContext();
  const [searchResults, setSearchResults] = useState(photos);
  const [searchQuery, setSearchQuery] = useState('');
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const searchRef = useRef(null);
  const searchInView = useInView(searchRef, { once: true, amount: 0.5 });

  const photoGridRef = useRef(null);
  const photoGridInView = useInView(photoGridRef, { once: true, amount: 0.2 });

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black relative overflow-hidden"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8 md:mb-12 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 animate-fade-in font-[Google Sans,sans-serif] drop-shadow-lg relative inline-flex items-center justify-center">
            Humayatiiim benummm
            <div className="absolute -right-8 md:-right-16 top-1/2 transform -translate-y-1/2 w-16 h-16 md:w-24 md:h-24">
              <Lottie animationData={heartAnimation} loop={true} autoplay={true} />
            </div>
          </h1>
        </motion.div>

        {/* Search and Controls */}
        <motion.div 
          ref={searchRef}
          initial={{ y: 50, opacity: 0 }}
          animate={searchInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
        >
          <div className="w-full md:w-2/3">
            <div className="relative">
              <SearchBar onSearch={handleSearch} placeholder="humayat ara..." />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFilters}
              className="p-2.5 border border-gray-800 rounded-lg text-white hover:bg-gray-900 transition-all duration-200 hover:border-red-500"
              aria-label="Toggle filters"
            >
              <Sliders className="w-5 h-5" />
            </motion.button>
            
            <div className="border-l border-gray-800 h-6 mx-1"></div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLayout('grid')}
              className={`p-2.5 border rounded-lg transition-all duration-200 ${
                layout === 'grid'
                  ? 'bg-red-800/50 text-white border-red-700 shadow-lg shadow-red-900/20'
                  : 'border-gray-800 text-white hover:bg-gray-900 hover:border-red-500'
              }`}
              aria-label="Grid layout"
            >
              <Grid className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLayout('masonry')}
              className={`p-2.5 border rounded-lg transition-all duration-200 ${
                layout === 'masonry'
                  ? 'bg-red-800/50 text-white border-red-700 shadow-lg shadow-red-900/20'
                  : 'border-gray-800 text-white hover:bg-gray-900 hover:border-red-500'
              }`}
              aria-label="Masonry layout"
            >
              <LayoutGrid className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 md:p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-xl">
                <h3 className="text-sm font-semibold text-red-400 mb-3">Humayat</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-sm text-gray-400">
                    humayatfiltreyakındagelirbelki.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Photo Grid */}
        <motion.div 
          ref={photoGridRef}
          variants={containerVariants}
          initial="hidden"
          animate={photoGridInView ? "visible" : "hidden"}
          transition={{ delayChildren: 0.2, staggerChildren: 0.1, duration: 0.8 }}
          className="mb-8"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"
              />
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
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-gray-400 mb-4"
                >
                  Found {searchResults.length} {searchResults.length === 1 ? 'photo' : 'photos'} in Humayat matching "{searchQuery}"
                </motion.p>
              )}
              <PhotoGrid photos={searchResults} layout={layout} itemVariants={itemVariants} />
            </>
          )}
        </motion.div>
        
        {/* Mobile Upload Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:hidden fixed right-6 bottom-6 z-10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/upload')}
            className="flex items-center justify-center w-16 h-16 bg-red-800 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200"
            aria-label="Upload to Humayat"
          >
            <Camera className="w-6 h-6 text-white" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;