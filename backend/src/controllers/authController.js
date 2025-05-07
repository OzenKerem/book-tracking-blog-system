const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token oluşturma
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Token oluşturma ve gönderme
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // JWT cookie ayarları
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Kullanıcı şifresini response'dan kaldır
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    userId: user._id,
    data: {
      user,
    },
  });
};

// Kayıt olma
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Giriş yapma
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Email ve şifre var mı kontrol et
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Lütfen email ve şifre girin',
      });
    }

    // 2) Kullanıcı var mı ve şifre doğru mu kontrol et
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email veya şifre yanlış',
      });
    }

    // 3) Her şey OK ise token gönder
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Şifre değiştirme
exports.updatePassword = async (req, res) => {
  try {
    // 1) Kullanıcıyı bul
    const user = await User.findById(req.user.id).select('+password');

    // 2) Mevcut şifre doğru mu kontrol et
    if (!(await user.correctPassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Mevcut şifreniz yanlış',
      });
    }

    // 3) Şifreyi güncelle
    user.password = req.body.newPassword;
    await user.save();

    // 4) Yeni token gönder
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Token doğrulama middleware
exports.protect = async (req, res, next) => {
  try {
    // 1) Token var mı kontrol et
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Lütfen giriş yapın',
      });
    }

    // 2) Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Kullanıcı hala var mı kontrol et
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'Bu token\'a ait kullanıcı artık mevcut değil',
      });
    }

    // 4) Kullanıcıyı request'e ekle
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: 'Lütfen giriş yapın',
    });
  }
};

// Rol kontrolü middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bu işlemi yapmaya yetkiniz yok',
      });
    }
    next();
  };
};
