import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
        <Camera className="w-8 h-8 text-indigo-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{message}</p>
      
      {showUploadButton && (
        <Link
          to="/upload"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="w-4 h-4 mr-1" />
          humayat yükle
        </Link>
      )}
    </div>
  );
};

export default EmptyState;