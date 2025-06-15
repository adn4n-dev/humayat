import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Humayat ara...' 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSearch}
      className="relative max-w-xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
        >
          <Search className="h-5 w-5 text-white" />
        </motion.div>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full pl-12 pr-12 py-3.5 border rounded-xl leading-5 bg-gray-900 backdrop-blur-sm placeholder-gray-400/70 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent sm:text-sm transition-all duration-300 ${
            isFocused ? 'border-red-500 shadow-lg shadow-red-500/10' : 'border-gray-700'
          }`}
          placeholder={placeholder}
        />
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={clearSearch}
                className="text-white hover:text-red-400 focus:outline-none transition-colors duration-200 p-1 rounded-full hover:bg-red-500/10"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.form>
  );
};

export default SearchBar;