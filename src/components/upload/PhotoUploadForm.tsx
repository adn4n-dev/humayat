import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';
import { usePhotoContext } from '../../context/PhotoContext';
import { api } from '../../services/api';

const PhotoUploadForm: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserContext();
  const { addPhoto } = usePhotoContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ file: 'Please select an image file for Humayat' });
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'baslık girin';
    if (!description.trim()) newErrors.description = 'acıklama..';
    if (!selectedFile) newErrors.photo = 'foto sec';
    if (!currentUser) newErrors.user = 'Please select a Humayat user identity';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('tags', JSON.stringify(tags.length > 0 ? tags : ['humayat']));
      formData.append('uploadedBy', currentUser!.name);

      const response = await api.uploadPhoto(formData);
      
      addPhoto({
        ...response,
        tags: tags.length > 0 ? tags : ['humayat'],
        description
      } as any);
      
      setIsSubmitting(false);
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: 'Humayat yüklenirken bir hata oluştu' });
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-700 mb-4">kullanıcı secin</p>
        <button
          onClick={() => document.querySelector('.user-menu-button')?.dispatchEvent(new MouseEvent('click'))}
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300"
        >
          humayat kullannıcı sec
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">humayat yukle</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              humayat yukleme seyine hosgeldiniz!
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                photoUrl ? 'border-red-300' : 'border-gray-300 hover:border-red-300'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {photoUrl ? (
                <div className="relative">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoUrl('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">tıkla yada sürükle</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF hersey var 10 mb gecme ama</p>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
          </div>
          
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              humayat baslık
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="humayat baslık gir.."
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          
          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              humayat acıklama
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="acıkla bu hangi humayat."
              rows={3}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          
          {/* Tags Input */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              humayat etiketleri
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="etiket yaz enter bas sonra "
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="ml-2 p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Uploader Info */}
          <div className="py-3 px-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              humayat yukleme <span className="font-semibold">{currentUser.name}</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Form Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300 mr-3"
        >
          iptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              humayat yuklenior..
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-1" />
              humayat yukle
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PhotoUploadForm;