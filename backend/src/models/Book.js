const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Kitap adı zorunludur'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Yazar adı zorunludur'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Kitap açıklaması zorunludur'],
    },
    status: {
      type: String,
      enum: ['reading', 'completed', 'want-to-read'],
      default: 'want-to-read',
    },
    totalPages: {
      type: Number,
      required: [true, 'Toplam sayfa sayısı zorunludur'],
      min: [1, 'Toplam sayfa sayısı 1\'den küçük olamaz'],
    },
    currentPage: {
      type: Number,
      default: 0,
      min: [0, 'Mevcut sayfa sayısı 0\'dan küçük olamaz'],
      validate: {
        validator: function (value) {
          return value <= this.totalPages;
        },
        message:
          'Mevcut sayfa sayısı toplam sayfa sayısından büyük olamaz',
      },
    },
    readingStartDate: {
      type: Date,
    },
    readingEndDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: [{
      content: String,
      page: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
