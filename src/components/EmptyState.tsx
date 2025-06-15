import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  message?: string;
  showUploadButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Henüz Humayat Yok",
  message = "Humayat yüklemek için butona tıklayın.",
  showUploadButton = true
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl border border-dark-700/50 shadow-xl"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Camera className="w-12 h-12 mx-auto text-gray-500" />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-semibold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-400/80 mb-8 leading-relaxed"
        >
          {message}
        </motion.p>
        
        {showUploadButton && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upload')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg shadow-red-900/20"
          >
            <Camera className="w-5 h-5 mr-2" />
            <span className="font-medium">Yeni Humayat Yükle</span>
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState; 