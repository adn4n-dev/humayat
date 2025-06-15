import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-black border-b border-gray-800 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/30"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center group">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl md:text-3xl font-bold text-white flex items-center gap-2 font-[Google Sans,sans-serif] drop-shadow-lg"
              >
                Humayatımmmmmmmmmmmmmmmmmmmmm
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/upload"
                className="inline-flex items-center px-5 py-2.5 text-lg font-bold rounded-xl text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 shadow-lg shadow-black/20 font-[Google Sans,sans-serif] border border-red-900"
              >
                <Camera className="w-5 h-5 mr-2 text-white" />
                <span>Yeni Humayat</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-4">
                <Link
                  to="/upload"
                  className="flex items-center px-4 py-2 text-white bg-red-800 hover:bg-red-700 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  <span>Yeni Humayat</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar; 