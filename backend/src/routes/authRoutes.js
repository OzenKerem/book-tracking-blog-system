const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Kayıt olma
router.post('/signup', authController.signup);

// Giriş yapma
router.post('/login', authController.login);

// Şifre değiştirme
router.post(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
