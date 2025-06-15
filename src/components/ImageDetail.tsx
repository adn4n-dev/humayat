import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';

const API_URL = 'https://humayat-backend.onrender.com';

interface Image {
  id: string;
  url: string;
  title: string;
  uploadedBy: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  user: string;
  createdAt: string;
}

const ImageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchImage();
  }, [id]);

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/images/${id}`);
      setImage(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching image:', error);
      setError('Resim yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!image) return;
    try {
      await axios.post(`${API_URL}/api/images/${image.id}/like`);
      setImage(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    } catch (error) {
      console.error('Error liking image:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/api/images/${image.id}/comment`, {
        text: newComment
      });
      setImage(prev => prev ? {
        ...prev,
        comments: [...prev.comments, response.data]
      } : null);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!image) return;
    try {
      await navigator.share({
        title: image.title,
        text: `Check out this image: ${image.title}`,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Hata</h2>
          <p className="text-gray-400 mb-6">{error || 'Resim bulunamadı'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary-300 hover:text-primary-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Geri Dön
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-xl shadow-lg overflow-hidden border border-dark-700"
        >
          <div className="relative aspect-video">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">{image.title}</h1>
            
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-primary-300 hover:text-primary-400 transition-colors"
              >
                <Heart className="h-5 w-5" />
                <span>{image.likes}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-primary-300 hover:text-primary-400 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                Paylaş
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary-500" />
                Yorumlar
              </h2>

              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorumunuzu yazın..."
                  className="flex-1 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Gönder'
                  )}
                </button>
              </form>

              <div className="space-y-4">
                {image.comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary-300">{comment.user}</span>
                      <span className="text-sm text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageDetail; 