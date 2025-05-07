const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Token'ı header'dan al
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcıyı bul
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }

    // Token ve kullanıcıyı request'e ekle
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Lütfen giriş yapın',
    });
  }
};

// Admin kontrolü
const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({
      error: 'Bu işlemi yapmaya yetkiniz yok',
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
