const express = require('express');
const { body } = require('express-validator');
const ProductController = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', ProductController.getAll);

// Get product by ID
router.get('/:id', ProductController.getById);

// Create product (admin only)
router.post('/', [
  auth,
  adminAuth,
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], ProductController.create);

// Update product (admin only)
router.put('/:id', [
  auth,
  adminAuth,
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], ProductController.update);

// Delete product (admin only)
router.delete('/:id', [auth, adminAuth], ProductController.delete);

module.exports = router;
