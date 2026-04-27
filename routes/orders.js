const express = require('express');
const { body } = require('express-validator');
const OrderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all orders (admin only)
router.get('/', [auth, adminAuth], OrderController.getAll);

// Get order by ID
router.get('/:id', auth, OrderController.getById);

// Create order
router.post('/', [
  auth,
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('customer_email').isEmail().withMessage('Please provide a valid email'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product_id').isInt().withMessage('Product ID must be an integer'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], OrderController.create);

// Update order status (admin only)
router.patch('/:id/status', [
  auth,
  adminAuth,
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], OrderController.updateStatus);

// Get sales report (admin only)
router.get('/reports/sales', [auth, adminAuth], OrderController.getSalesReport);

module.exports = router;
