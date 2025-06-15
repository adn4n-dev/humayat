import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePhotoContext } from '../context/PhotoContext';
import { ArrowLeft, Download, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"
        />
      </div>
    );
  }

  if (!photo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[60vh] flex flex-col items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
            humayatimm bulunamadıı 
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-red-900/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>ana sayfa dönnn</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Geri</span>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-dark-700"
      >
        <div className="p-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600"
          >
            {photo.title}
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="aspect-w-16 aspect-h-9 mb-8"
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-contain rounded-lg shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
          >
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Yükleyen: {photo.uploadedBy}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(photo.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={photo.url}
              download
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-red-900/20"
            >
              <Download className="w-5 h-5 mr-2" />
              <span>İndir</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PhotoDetailPage;