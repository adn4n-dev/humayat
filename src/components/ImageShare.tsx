import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      console.log('Fetching images from:', `${API_URL}/api/images`);
      const response = await axios.get(`${API_URL}/api/images`);
      console.log('Received images:', response.data);
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
      if (file.size > 10 * 1024 * 1024) { // 10MB
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
      console.log('Uploading image to:', `${API_URL}/api/images/upload`);
      console.log('FormData contents:', {
        title: formData.get('title'),
        image: formData.get('image')
      });

      const response = await axios.post(`${API_URL}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);
      setTitle('');
      setSelectedFile(null);
      fetchImages();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.error || 'Resim yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleUpload} className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Resim Başlığı
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Resim Seç
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
          </label>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !selectedFile || !title}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? 'Yükleniyor...' : 'Resmi Paylaş'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{image.title}</h3>
              <p className="text-sm text-gray-600">
                Paylaşan: {image.uploadedBy}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageShare; 