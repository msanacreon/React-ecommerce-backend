const { validationResult } = require('express-validator');
const { Order, OrderDetail } = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

class OrderController {
  static async getAll(req, res) {
    try {
      const orders = await Order.getAll();
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getById(req, res) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const orderDetails = await OrderDetail.getOrderDetails(req.params.id);
      
      res.json({
        order,
        items: orderDetails
      });
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

      const { customer_name, customer_email, customer_phone, customer_address, items } = req.body;

      let customer = await Customer.findByEmail(customer_email);
      if (!customer) {
        const customerId = await Customer.create({
          name: customer_name,
          email: customer_email,
          phone: customer_phone,
          address: customer_address
        });
        customer = await Customer.findById(customerId);
      }

      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          return res.status(400).json({ message: `Product with ID ${item.product_id} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
          });
        }

        totalAmount += product.price * item.quantity;
        validatedItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price
        });
      }

      const orderId = await Order.create({
        cust_id: customer.cust_id,
        total_amount: totalAmount
      });

      const orderDetails = validatedItems.map(item => ({
        order_id: orderId,
        ...item
      }));

      await OrderDetail.createMultiple(orderDetails);

      for (const item of validatedItems) {
        await Product.updateStock(item.product_id, item.quantity);
      }

      const order = await Order.findById(orderId);
      const orderItems = await OrderDetail.getOrderDetails(orderId);

      res.status(201).json({
        message: 'Order created successfully',
        order,
        items: orderItems
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async updateStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updated = await Order.updateStatus(req.params.id, req.body.status);
      if (!updated) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const order = await Order.findById(req.params.id);
      res.json({
        message: 'Order status updated successfully',
        order
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getSalesReport(req, res) {
    try {
      const { start_date, end_date } = req.query;
      
      if (!start_date || !end_date) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }

      const salesReport = await Order.getSalesReport(start_date, end_date);
      res.json(salesReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = OrderController;
