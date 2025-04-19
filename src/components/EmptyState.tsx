import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-dark-800 rounded-lg border border-dark-700">
      <div className="text-center max-w-md">
        <h3 className="text-lg font-medium text-primary-300 mb-2">{title}</h3>
        <p className="text-sm text-primary-400 mb-6">{message}</p>
        
        {showUploadButton && (
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            <Camera className="w-4 h-4 mr-2" />
            <span>Yeni Humayat Yükle</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState; 