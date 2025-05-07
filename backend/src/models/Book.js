const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide the author name'],
    trim: true
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  coverImage: {
    type: String,
    default: 'default-book-cover.jpg'
  },
  status: {
    type: String,
    enum: ['reading', 'completed', 'want-to-read'],
    default: 'want-to-read'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  startDate: Date,
  endDate: Date,
  pages: Number,
  genre: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', bookSchema);