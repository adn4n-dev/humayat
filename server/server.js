const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const config = require('./config');
const Image = require('./models/Image');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://humayat.netlify.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Welcome page
app.get('/', (req, res) => {
  res.send(`
    <h1>Humayat Backend API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li>GET /api/images - Get all images</li>
      <li>POST /api/images/upload - Upload a new image</li>
    </ul>
    <p>Status: Server is running</p>
    <p>Environment:</p>
    <ul>
      <li>MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected'}</li>
      <li>Cloudinary: Configured</li>
    </ul>
  `);
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/images', async (req, res) => {
  try {
    console.log('Fetching images from database...');
    const images = await Image.find().sort({ createdAt: -1 });
    console.log('Found images:', images);
    res.json(images);
  } catch (error) {
    console.error('Error in GET /api/images:', error);
    res.status(500).json({ error: 'Error fetching images', details: error.message });
  }
});

app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Starting image upload...');
    if (!req.file) {
      console.error('No file provided in request');
      return res.status(400).json({ error: 'No image file provided' });
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
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto'
    });
    console.log('Cloudinary upload successful:', result.secure_url);

    // Create new image document
    const newImage = new Image({
      title: req.body.title,
      url: result.secure_url,
      cloudinaryId: result.public_id
    });

    console.log('Saving to MongoDB...');
    await newImage.save();
    console.log('Image saved successfully');
    
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error in POST /api/images/upload:', error);
    res.status(500).json({ error: 'Error uploading image', details: error.message });
  }
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    MONGODB_URI: config.MONGODB_URI ? 'Set' : 'Not set',
    CLOUDINARY_CLOUD_NAME: config.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
    CLOUDINARY_API_KEY: config.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
    CLOUDINARY_API_SECRET: config.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'
  });
}); 