const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookiesparser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const jwt = require('jsonwebtoken');

// Load environment variables first
dotenv.config();
require('dotenv').config();

// Database connection
const database = require('./config/database');
database.connectDB();

const app = express();

// Middleware - ORDER MATTERS!
// 1. CORS must be first
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://skill-house-website.vercel.app',
      'https://adminuser-self.vercel.app'
    ];
    
    // Allow requests with no origin (like curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control'],
  exposedHeaders: ['Set-Cookie', 'Content-Length', 'X-Total-Count'],
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesparser());

// 3. File upload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// 4. Debug middleware for all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log(`  Headers:`, {
    origin: req.headers.origin,
    authorization: req.headers.authorization ? '***TOKEN***' : 'MISSING',
    contentType: req.headers['content-type']
  });
  next();
});

// Default route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Debug route to check token
app.get('/api/v1/auth/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ success: false, message: "No token provided" });
  }
  
  try {
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ 
      success: true, 
      decoded: { id: decoded.id, email: decoded.email, role: decoded.role }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

// Routes - Use ONLY ONE router per path
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/posts', require('./routes/postRoutes'));
app.use('/api/v1/comments', require('./routes/commentRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// 404 handler
app.use((req, res) => {
  console.log(`404 - Not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.path}`
  });
});

// Global error handler middleware (MUST be last) (MUST be last)
app.use((err, req, res, next) => {
  console.error("=== Global Error Handler ===");
  console.error("Error:", err);
  console.error("Error message:", err.message);
  console.error("Error stack:", err.stack);
  
  if (res.headersSent) {
    console.error("Headers already sent, cannot send error response");
    return next(err);
  }
  
  const status = err.status || 500;
  const message = String(err.message || "Internal server error");
  
  try {
    const errorResponse = {
      success: false,
      message: message,
      error: {}
    };
    
    if (process.env.NODE_ENV === 'development' && err.stack) {
      errorResponse.error = { stack: err.stack };
    }
    
    console.log("Sending error response:", JSON.stringify(errorResponse));
    return res.status(status).json(errorResponse);
  } catch (jsonError) {
    console.error("Error stringifying error response:", jsonError);
    // Fallback to plain text response
    return res.status(500).send(`{\"success\":false,\"message\":\"${String(message).replace(/"/g, '\\"')}\",\"error\":{}}`);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error("=== Unhandled Rejection ===");
  console.error("Promise:", promise);
  console.error("Reason:", reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error("=== Uncaught Exception ===");
  console.error("Error:", error);
  console.error("Error stack:", error.stack);
});

// Start server
const port = process.env.PORT || 4002; // Changed default port to 4002
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
