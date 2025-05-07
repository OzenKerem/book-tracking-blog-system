const Book = require('../models/Book');

// Tüm kitapları getir
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });

    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Tek kitap getir
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Kitap bulunamadı',
      });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Yeni kitap ekle
exports.createBook = async (req, res) => {
  try {
    const newBook = await Book.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Kitap güncelle
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Kitap bulunamadı',
      });
    }

    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Kitap sil
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Kitap bulunamadı',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Kitap istatistikleri
exports.getBookStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalPages: { $sum: '$totalPages' },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};
