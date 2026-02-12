const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();
// Load environment variables first
dotenv.config();

const app = express();

// Database connection
const database = require('./config/database');
database.connectDB();

// Middleware
const cookiesparser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookiesparser());

// Simple but effective CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://skill-house-website.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}));

// Additional CORS middleware for extra safety
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://skill-house-website.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin,Cache-Control');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// Cloudinary connection (commented out - will add when needed)
// const {cloudinaryConnnect} = require('./config/cloudinary');
// cloudinaryConnnect();

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Default route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Routes - Use ONLY ONE router per path
app.use('/api/v1/auth', require('./routes/authRoutes'));
// app.use('/api/v1/profile', require('./routes/profile'));
// app.use('/api/v1/payment', require('./routes/payment'));
// app.use('/api/v1/course', require('./routes/Course'));

// Start server
const port = process.env.PORT || 4002; // Changed default port to 4002
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
