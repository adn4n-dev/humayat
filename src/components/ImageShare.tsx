import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';

const API_URL = 'https://humayat-backend.onrender.com';

interface Image {
  id: string;
  url: string;
  title: string;
  uploadedBy: string;
  createdAt: string;
}

const ImageShare: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/images`);
      setImages(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Resimleri yüklerken bir hata oluştu');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
        return;
      }
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        setError('Sadece JPG, PNG ve GIF dosyaları yüklenebilir');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', title);

    try {
      await axios.post(`${API_URL}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTitle('');
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchImages();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Resim yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleUpload}
        className="mb-8 p-6 bg-dark-800 rounded-xl shadow-lg border border-dark-700"
      >
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Resim Başlığı
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Resminiz için bir başlık girin"
              required
            />
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Resim Seç
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-red-500 transition-colors">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-red-500 hover:text-red-400">
                        <span>Resim yükle</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileSelect}
                          accept="image/*"
                          required
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading || !selectedFile || !title}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Yükleniyor...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Resmi Paylaş
            </>
          )}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-dark-800 rounded-xl shadow-lg overflow-hidden border border-dark-700"
          >
            <div className="relative aspect-video">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg text-white mb-2">{image.title}</h3>
              <p className="text-sm text-primary-300">
                Paylaşan: {image.uploadedBy}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ImageShare; 