import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-indigo-600 mb-2">1453</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">humayatlar kacmıs :(</h2>
      <p className="text-gray-600 max-w-md mb-8">
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
      >
        <Home className="w-4 h-4 mr-2" />
        eve dön (home)
      </Link>
    </div>
  );
};

export default NotFoundPage;