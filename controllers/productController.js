const { validationResult } = require('express-validator');
const Product = require('../models/Product');

class ProductController {
  static async getAll(req, res) {
    try {
      const products = await Product.getAll();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productId = await Product.create(req.body);
      const product = await Product.findById(productId);
      
      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updated = await Product.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const product = await Product.findById(req.params.id);
      res.json({
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Product.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = ProductController;
