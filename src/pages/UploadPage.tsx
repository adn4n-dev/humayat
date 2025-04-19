import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import PhotoUploadForm from '../components/upload/PhotoUploadForm';

const UploadPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>humayatlara geri dön</span>
        </Link>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PhotoUploadForm />
      </div>
    </div>
  );
};

export default UploadPage;