const { pool } = require('../config/database');

class Order {
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT o.*, c.name as customer_name, c.email as customer_email 
      FROM Orders o 
      LEFT JOIN Customers c ON o.cust_id = c.cust_id 
      ORDER BY o.order_date DESC
    `);
    return rows;
  }

  static async findById(orderId) {
    const [rows] = await pool.execute(`
      SELECT o.*, c.name as customer_name, c.email as customer_email 
      FROM Orders o 
      LEFT JOIN Customers c ON o.cust_id = c.cust_id 
      WHERE o.order_id = ?
    `, [orderId]);
    return rows[0];
  }

  static async create(orderData) {
    const { cust_id, total_amount, status = 'pending' } = orderData;
    const [result] = await pool.execute(
      'INSERT INTO Orders (cust_id, total_amount, status) VALUES (?, ?, ?)',
      [cust_id, total_amount, status]
    );
    return result.insertId;
  }

  static async updateStatus(orderId, status) {
    const [result] = await pool.execute(
      'UPDATE Orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );
    return result.affectedRows > 0;
  }

  static async getCustomerOrders(customerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM Orders WHERE cust_id = ? ORDER BY order_date DESC',
      [customerId]
    );
    return rows;
  }

  static async getSalesReport(startDate, endDate) {
    const [rows] = await pool.execute(`
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as avg_order_value
      FROM Orders 
      WHERE order_date BETWEEN ? AND ?
      AND status != 'cancelled'
      GROUP BY DATE(order_date)
      ORDER BY date DESC
    `, [startDate, endDate]);
    return rows;
  }
}

class OrderDetail {
  static async getOrderDetails(orderId) {
    const [rows] = await pool.execute(`
      SELECT od.*, p.name as product_name 
      FROM Order_Details od 
      JOIN Products p ON od.product_id = p.product_id 
      WHERE od.order_id = ?
    `, [orderId]);
    return rows;
  }

  static async create(orderDetailData) {
    const { order_id, product_id, quantity, price } = orderDetailData;
    const [result] = await pool.execute(
      'INSERT INTO Order_Details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order_id, product_id, quantity, price]
    );
    return result.insertId;
  }

  static async createMultiple(orderDetails) {
    const values = orderDetails.map(detail => 
      [detail.order_id, detail.product_id, detail.quantity, detail.price]
    );
    
    const [result] = await pool.query(
      'INSERT INTO Order_Details (order_id, product_id, quantity, price) VALUES ?',
      [values]
    );
    return result.affectedRows;
  }
}

module.exports = { Order, OrderDetail };
