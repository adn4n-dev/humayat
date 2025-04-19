import React from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-300">Humayat</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Camera className="w-4 h-4 mr-2" />
              <span>Yeni Humayat</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 