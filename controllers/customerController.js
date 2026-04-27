const { validationResult } = require('express-validator');
const Customer = require('../models/Customer');

class CustomerController {
  static async getAll(req, res) {
    try {
      const customers = await Customer.getAll();
      res.json(customers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getById(req, res) {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
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

      const { name, email, phone, address } = req.body;

      const existingCustomer = await Customer.findByEmail(email);
      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email already exists' });
      }

      const customerId = await Customer.create({ name, email, phone, address });
      const customer = await Customer.findById(customerId);
      
      res.status(201).json({
        message: 'Customer created successfully',
        customer
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

      const updated = await Customer.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      const customer = await Customer.findById(req.params.id);
      res.json({
        message: 'Customer updated successfully',
        customer
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await Customer.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = CustomerController;
