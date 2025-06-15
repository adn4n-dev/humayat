const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const config = require('./config');
const Image = require('./models/Image');

const app = express();

// CORS'u tamamen açık yap (test için)
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
  console.log('Bağlantı URI:', config.MONGODB_URI);
})
.catch(err => {
  console.error('MongoDB bağlantı hatası:', err);
  process.exit(1);
});

// MongoDB bağlantı durumunu izle
mongoose.connection.on('connected', () => {
  console.log('MongoDB bağlantısı aktif');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB bağlantısı kesildi');
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

// Welcome page with health check
app.get('/', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cloudinary: !!cloudinary.config().cloud_name
  };
  
  res.json(health);
});

// Test endpoint for checking photos
app.get('/api/test-photos', async (req, res) => {
  try {
    console.log('Tüm fotoğraflar kontrol ediliyor...');
    const photos = await Image.find();
    console.log('Bulunan fotoğraf sayısı:', photos.length);
    console.log('Fotoğraf ID\'leri:', photos.map(p => p._id));
    
    res.json({
      count: photos.length,
      photos: photos.map(p => ({
        id: p._id,
        title: p.title,
        cloudinaryId: p.cloudinaryId
      }))
    });
  } catch (error) {
    console.error('Fotoğrafları kontrol ederken hata:', error);
    res.status(500).json({ error: 'Fotoğraflar kontrol edilirken bir hata oluştu' });
  }
});

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Routes with improved error handling
app.get('/api/images', async (req, res) => {
  try {
    console.log('Fetching images from database...');
    const images = await Image.find().sort({ createdAt: -1 });
    console.log(`Found ${images.length} images`);
    res.json(images);
  } catch (error) {
    console.error('Error in GET /api/images:', error);
    res.status(500).json({ 
      error: 'Error fetching images', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get single photo by ID
app.get('/api/images/:id', async (req, res) => {
  try {
    console.log('Fetching photo with ID:', req.params.id);
    const photo = await Image.findById(req.params.id);
    
    if (!photo) {
      console.log('Photo not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    console.log('Found photo:', photo);
    res.json(photo);
  } catch (error) {
    console.error('Error in GET /api/images/:id:', error);
    res.status(500).json({ error: 'Error fetching photo', details: error.message });
  }
});

// Delete photo by ID
app.delete('/api/images/:id', async (req, res) => {
  console.log('>>> DELETE /api/images/:id ROTASI ULAŞILDI <<<');
  try {
    console.log('=== Silme İşlemi Başladı ===');
    console.log('İstek ID:', req.params.id);
    console.log('İstek Metodu:', req.method);
    console.log('İstek URL:', req.originalUrl);
    console.log('İstek Başlıkları:', req.headers);
    
    // MongoDB bağlantı durumunu kontrol et
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB bağlantısı aktif değil');
    }

    // Önce fotoğrafı bul
    console.log('Fotoğraf aranıyor...');
    const photo = await Image.findById(req.params.id);
    console.log('Fotoğraf bulundu mu:', photo ? 'Evet' : 'Hayır');
    
    if (!photo) {
      console.log('Fotoğraf bulunamadı. ID:', req.params.id);
      return res.status(404).json({ 
        error: 'Fotoğraf bulunamadı',
        id: req.params.id,
        timestamp: new Date().toISOString()
      });
    }

    console.log('Bulunan fotoğraf:', {
      id: photo._id,
      title: photo.title,
      cloudinaryId: photo.cloudinaryId
    });

    // Cloudinary'den sil
    if (photo.cloudinaryId) {
      console.log('Cloudinary\'den siliniyor:', photo.cloudinaryId);
      try {
        const cloudinaryResult = await cloudinary.uploader.destroy(photo.cloudinaryId);
        console.log('Cloudinary silme sonucu:', cloudinaryResult);
      } catch (cloudinaryError) {
        console.error('Cloudinary silme hatası:', cloudinaryError);
        // Cloudinary hatası olsa bile devam et
      }
    }

    // MongoDB'den sil
    console.log('MongoDB\'den siliniyor:', req.params.id);
    const deletedPhoto = await Image.findByIdAndDelete(req.params.id);
    console.log('MongoDB silme sonucu:', deletedPhoto ? 'Başarılı' : 'Başarısız');
    
    if (!deletedPhoto) {
      throw new Error('Fotoğraf MongoDB\'den silinemedi');
    }

    // Silme işleminin başarılı olduğunu doğrula
    console.log('Silme işlemi doğrulanıyor...');
    const verifyDeletion = await Image.findById(req.params.id);
    if (verifyDeletion) {
      throw new Error('Fotoğraf hala veritabanında mevcut');
    }
    
    res.json({ 
      message: 'Fotoğraf başarıyla silindi',
      id: req.params.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Silme işleminde hata:', error);
    console.error('Hata detayları:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      error: 'Fotoğraf silinirken bir hata oluştu', 
      details: error.message,
      id: req.params.id,
      timestamp: new Date().toISOString()
    });
  } finally {
    console.log('=== Silme İşlemi Tamamlandı ===');
  }
});

app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Starting image upload...');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({ 
        error: 'No image file provided',
        timestamp: new Date().toISOString()
      });
    }

    console.log('File received:', {
      mimetype: req.file.mimetype,
      size: req.file.size,
      title: req.body.title
    });

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Uploading to Cloudinary...');
    // Upload to Cloudinary with error handling
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'humayat',
      timeout: 60000 // 60 second timeout
    }).catch(error => {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    });

    console.log('Cloudinary upload successful:', result.secure_url);

    // Create new image document
    const newImage = new Image({
      title: req.body.title || 'Untitled',
      url: result.secure_url,
      cloudinaryId: result.public_id,
      uploadedBy: 'Anonymous'
    });

    console.log('Saving to MongoDB...');
    await newImage.save();
    console.log('Image saved successfully');
    
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error in POST /api/images/upload:', error);
    res.status(500).json({ 
      error: 'Error uploading image', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Handle 404 Not Found - Tüm geçerli rotaların altına eklenmelidir!
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Bilinmeyen endpoint' });
});

// Genel hata işleme middleware - Bu en sonda olmalı!
app.use((err, req, res, next) => {
  console.error('Server Error (Genel Hata İşleyici):', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 