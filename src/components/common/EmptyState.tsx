import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  message?: string;
  showUploadButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'hic humayat yok :(',
  message = 'humayat olması icin humayat yukle.',
  showUploadButton = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto w-20 h-20 bg-primary-900/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-primary-700/20"
      >
        <Camera className="w-10 h-10 text-white" />
      </motion.div>
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 max-w-md mx-auto mb-8"
      >
        {message}
      </motion.p>
      
      {showUploadButton && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <Upload className="w-5 h-5 mr-2" />
            humayat yükle
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;