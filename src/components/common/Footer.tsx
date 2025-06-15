import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-black border-t border-gray-800 py-6 backdrop-blur-sm shadow-inner shadow-black/30"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-white text-xl flex items-center justify-center gap-2 font-[Google Sans,sans-serif]">
            yapımcı adnan(bibisinnn)
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-xs mt-2 font-[Google Sans,sans-serif]"
          >
            © {new Date().getFullYear()} Tüm hakları saklıdır.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer; 