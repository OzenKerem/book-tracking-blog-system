const Book = require('../models/Book');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Get all books for a user
// @route   GET /api/books
// @access  Private
exports.getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});

// @desc    Get a single book
// @route   GET /api/books/:id
// @access  Private
exports.getBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({
    _id: req.params.id,
    user: req.user.id
  });

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

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
exports.createBook = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;

  const book = await Book.create(req.body);

  res.status(201).json({
    success: true,
    data: book
  });
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
exports.updateBook = asyncHandler(async (req, res) => {
  let book = await Book.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      error: 'Book not found'
    });
  }

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: book
  });
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      error: 'Book not found'
    });
  }

  await book.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get books by status
// @route   GET /api/books/status/:status
// @access  Private
exports.getBooksByStatus = asyncHandler(async (req, res) => {
  const books = await Book.find({
    user: req.user.id,
    status: req.params.status
  });

  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});

// @desc    Get reading statistics
// @route   GET /api/books/stats
// @access  Private
exports.getReadingStats = asyncHandler(async (req, res) => {
  const stats = await Book.aggregate([
    {
      $match: { user: req.user.id }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalPages: { $sum: '$pages' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});