const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');

// Tüm rotalar için auth gerekli
router.use(authController.protect);

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router.get('/stats', bookController.getBookStats);

module.exports = router;
