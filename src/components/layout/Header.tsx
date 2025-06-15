import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Upload, Menu, X, User } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useUserContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const navLinks = [
    { to: '/', text: 'humayatlar', icon: <Camera className="w-5 h-5" /> },
    { to: '/upload', text: 'humayat yükle', icon: <Upload className="w-5 h-5" /> }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Site Title */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition duration-300"
          >
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">humayatlar</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition duration-300 ${
                  location.pathname === link.to
                    ? 'text-red-700 font-semibold'
                    : 'text-gray-400 hover:text-red-600 hover:bg-gray-900'
                }`}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="relative ml-3">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 text-gray-400 hover:text-red-600 px-3 py-2 rounded-md transition duration-300"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline-block">
                {currentUser ? currentUser.name : 'Humayat User'}
              </span>
            </button>

            {userMenuOpen && (
              <UserMenu onClose={() => setUserMenuOpen(false)} />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-400 hover:text-red-600 focus:outline-none"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition duration-300 ${
                  location.pathname === link.to
                    ? 'bg-red-800 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-red-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;