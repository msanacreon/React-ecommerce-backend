const express = require('express');
const { body } = require('express-validator');
const CustomerController = require('../controllers/customerController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all customers (admin only)
router.get('/', [auth, adminAuth], CustomerController.getAll);

// Get customer by ID
router.get('/:id', auth, CustomerController.getById);

// Create customer
router.post('/', [
  body('name').notEmpty().withMessage('Customer name is required'),
  body('email').isEmail().withMessage('Please provide a valid email')
], CustomerController.create);

// Update customer
router.put('/:id', [
  auth,
  body('name').optional().notEmpty().withMessage('Customer name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
], CustomerController.update);

// Delete customer (admin only)
router.delete('/:id', [auth, adminAuth], CustomerController.delete);

module.exports = router;
