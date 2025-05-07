require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

// Enable CORS with detailed configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',  // Local development frontend
      process.env.FRONTEND_URL  // Production frontend
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Developer Blog API' });
});

// Add a default book for testing
const defaultBooks = [
  {
    id: '123456789',
    userId: '12345',
    title: 'Test Book',
    author: 'Test Author',
    pages: 200,
    currentPage: 50,
    status: 'reading',
    coverImage: 'default-book-cover.jpg',
    startDate: new Date(),
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// In-memory database (for testing without MongoDB)
const users = [{
  id: 'admin123',
  username: 'Yönetici',
  email: 'yonetici@gmail.com',
  password: 'Kerem7575.',  // In production this would be hashed
  role: 'admin',
  profileImage: 'default-avatar.png',
  createdAt: new Date(),
  lastLogin: new Date()
}];
const books = [...defaultBooks]; // Start with at least one book for testing

// Simple Auth Routes without MongoDB
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide all required fields'
    });
  }
  
  // Check if user exists
  const userExists = users.find(user => user.email === email || user.username === username);
  if (userExists) {
    return res.status(400).json({ 
      success: false, 
      error: userExists.email === email ? 'Email already exists' : 'Username already exists' 
    });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // Would be hashed in production
    role: 'user',
    profileImage: 'default-avatar.png',
    createdAt: new Date()
  };
  
  // Add to in-memory database
  users.push(newUser);
  
  console.log('User registered:', { username, email });
  
  // Return user with token
  res.status(201).json({
    success: true,
    token: `mock_token_${newUser.id}`,
    data: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      profileImage: newUser.profileImage
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }
  
  // Find user
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  console.log('User logged in:', { email });
  
  // Return user with token
  res.status(200).json({
    success: true,
    token: `mock_token_${user.id}`,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  // Check for auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  // Extract user id from token
  const token = authHeader.split(' ')[1];
  const userId = token.split('_')[2]; // mock_token_USER_ID format
  
  // Find user
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    // If no real user found, return a mock user for testing
    return res.status(200).json({
      success: true,
      data: {
        id: '12345',
        username: 'test_user',
        email: 'test@example.com',
        role: 'user',
        profileImage: 'default-avatar.png'
      }
    });
  }
  
  // Return user data
  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    }
  });
});

app.get('/api/auth/logout', (req, res) => {
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Books API
// Get all books
app.get('/api/books', (req, res) => {
  // In a real app, we'd verify the user from the token
  const authHeader = req.headers.authorization;
  
  console.log('GET /api/books received');
  console.log('Headers:', req.headers);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  // Extract user id from token
  const token = authHeader.split(' ')[1];
  let userId;
  
  try {
    // Try to get user ID from JWT token if using real JWT
    if (token.includes('.')) {
      const decodedToken = jwt.decode(token);
      userId = decodedToken?.id || '12345';
    } else {
      // For mock tokens
      userId = token.split('_')[2] || '12345';
    }
  } catch (err) {
    console.log('Error extracting user ID, using default:', err);
    userId = '12345';
  }
  
  console.log('User ID for books query:', userId);
  console.log('Total books in memory:', books.length);
  
  // Filter books by user
  const userBooks = books.filter(book => book.userId === userId);
  console.log('Books filtered for user:', userBooks.length);
  
  res.status(200).json({
    success: true,
    count: userBooks.length,
    data: userBooks
  });
});

// Get books by status
app.get('/api/books/status/:status', (req, res) => {
  const { status } = req.params;
  
  if (!['reading', 'completed', 'want-to-read'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status. Must be reading, completed, or want-to-read'
    });
  }
  
  // Extract user id from token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.split('_')[2] || '12345';
  
  // Filter books by user and status
  const filteredBooks = books.filter(book => book.userId === userId && book.status === status);
  
  res.status(200).json({
    success: true,
    count: filteredBooks.length,
    data: filteredBooks
  });
});

// Get a single book
app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  // Extract user id from token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.split('_')[2] || '12345';
  
  // Find book by id and user
  const book = books.find(b => b.id === id && b.userId === userId);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      error: 'Book not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: book
  });
});

// Create a new book
app.post('/api/books', (req, res) => {
  // Extract user id from token
  const authHeader = req.headers.authorization;
  
  console.log('POST /api/books received');
  console.log('Request body:', req.body);
  console.log('Headers:', req.headers);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  console.log('Book creation request received:', req.body);
  console.log('Auth header:', authHeader);
  
  const token = authHeader.split(' ')[1];
  let userId;
  
  // Extract user ID from token or use mock ID
  try {
    // Try to get user ID from JWT token if using real JWT
    if (token.includes('.')) {
      const decodedToken = jwt.decode(token);
      userId = decodedToken?.id || '12345';
    } else {
      // For mock tokens
      userId = token.split('_')[2] || '12345';
    }
  } catch (err) {
    console.log('Error extracting user ID, using default:', err);
    userId = '12345';
  }
  
  console.log('Using user ID:', userId);
  
  const { title, author, pages, status = 'want-to-read', currentPage = 0 } = req.body;
  
  // Validate required fields
  if (!title || !author || !pages) {
    return res.status(400).json({
      success: false,
      error: 'Please provide title, author and pages'
    });
  }
  
  // Create new book
  const newBook = {
    id: Date.now().toString(),
    userId,
    title,
    author,
    pages: parseInt(pages),
    currentPage: parseInt(currentPage),
    status,
    coverImage: 'default-book-cover.jpg',
    startDate: status === 'reading' ? new Date() : null,
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add to in-memory database
  books.push(newBook);
  
  console.log('Book created:', newBook);
  console.log('Total books in memory after adding:', books.length);
  
  // For consistency with the GET response
  res.status(201).json({
    success: true,
    data: newBook
  });
});

// Update a book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  // Extract user id from token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.split('_')[2] || '12345';
  
  // Find book index
  const bookIndex = books.findIndex(b => b.id === id && b.userId === userId);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Book not found'
    });
  }
  
  // Get existing book
  const book = books[bookIndex];
  
  // Handle status change
  const prevStatus = book.status;
  const newStatus = req.body.status || prevStatus;
  
  // Set dates based on status changes
  let startDate = book.startDate;
  let endDate = book.endDate;
  
  if (prevStatus !== 'reading' && newStatus === 'reading') {
    // Starting to read the book
    startDate = new Date();
    endDate = null;
  }
  
  if (prevStatus !== 'completed' && newStatus === 'completed') {
    // Completing the book
    endDate = new Date();
    // If book was never started, set start date to now too
    if (!startDate) startDate = new Date();
  }
  
  // Update book
  const updatedBook = {
    ...book,
    ...req.body,
    currentPage: req.body.currentPage ? parseInt(req.body.currentPage) : book.currentPage,
    pages: req.body.pages ? parseInt(req.body.pages) : book.pages,
    startDate,
    endDate,
    status: newStatus,
    updatedAt: new Date()
  };
  
  // Replace in array
  books[bookIndex] = updatedBook;
  
  res.status(200).json({
    success: true,
    data: updatedBook
  });
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  // Extract user id from token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.split('_')[2] || '12345';
  
  // Find book index
  const bookIndex = books.findIndex(b => b.id === id && b.userId === userId);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Book not found'
    });
  }
  
  // Remove from array
  books.splice(bookIndex, 1);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// Get reading stats
app.get('/api/books/stats', (req, res) => {
  // Extract user id from token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = token.split('_')[2] || '12345';
  
  // Filter books by user
  const userBooks = books.filter(book => book.userId === userId);
  
  // Generate stats
  const stats = {
    totalBooks: userBooks.length,
    reading: userBooks.filter(book => book.status === 'reading').length,
    completed: userBooks.filter(book => book.status === 'completed').length,
    wantToRead: userBooks.filter(book => book.status === 'want-to-read').length,
    totalPages: userBooks.reduce((sum, book) => sum + book.pages, 0),
    pagesRead: userBooks.reduce((sum, book) => {
      if (book.status === 'completed') {
        return sum + book.pages;
      } else if (book.status === 'reading') {
        return sum + book.currentPage;
      }
      return sum;
    }, 0)
  };
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', ')
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  // JWT expiration error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Conditional MongoDB Connection
try {
  // Try to connect to MongoDB
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      
      // Check if admin user exists
      const User = require('./models/User');
      const adminExists = await User.findOne({ email: 'yonetici@gmail.com' });
      
      if (!adminExists) {
        // Create admin user if it doesn't exist
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('Kerem7575.', 10);
        
        await User.create({
          username: 'Yönetici',
          email: 'yonetici@gmail.com',
          password: hashedPassword,
          role: 'admin',
          profileImage: 'default-avatar.png'
        });
        
        console.log('Admin user created successfully');
      }
      
      startServer();
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err.message);
      console.log('Starting server without MongoDB connection...');
      startServer();
    });
} catch (error) {
  console.error('MongoDB connection error:', error.message);
  console.log('Starting server without MongoDB connection...');
  startServer();
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}