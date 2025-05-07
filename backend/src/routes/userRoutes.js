const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authController = require('../controllers/authController');

// Kullanıcı profili getir
router.get('/profile', authController.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
});

// Kullanıcı profili güncelle
router.patch('/profile', authController.protect, async (req, res) => {
  try {
    // Şifre güncellemesini engelle
    if (req.body.password) {
      return res.status(400).json({
        status: 'error',
        message:
          'Şifre güncellemesi için /update-password endpoint\'ini kullanın',
      });
    }

    // Güncellenebilir alanlar
    const filteredBody = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      interests: req.body.interests,
      socialLinks: req.body.socialLinks,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
});

// Kullanıcı hesabını sil
router.delete('/profile', authController.protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

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
});

// Admin: Tüm kullanıcıları getir
router.get(
  '/users',
  authController.protect,
  authController.restrictTo('admin'),
  async (req, res) => {
    try {
      const users = await User.find();

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
);

// Admin: Kullanıcı sil
router.delete(
  '/users/:id',
  authController.protect,
  authController.restrictTo('admin'),
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);

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
  }
);

// Admin: Kullanıcı rolünü güncelle
router.patch(
  '/users/:id/role',
  authController.protect,
  authController.restrictTo('admin'),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role: req.body.role },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı',
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
);

module.exports = router;
