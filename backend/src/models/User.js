const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ad soyad zorunludur'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
            value
          );
        },
        message: 'Lütfen geçerli bir email adresi girin',
      },
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    bio: {
      type: String,
      trim: true,
    },
    interests: {
      type: String,
      trim: true,
    },
    socialLinks: {
      twitter: String,
      github: String,
      linkedin: String,
    },
  },
  {
    timestamps: true,
  }
);

// Şifre hashleme middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Şifre doğrulama metodu
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
