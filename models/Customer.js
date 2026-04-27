const { pool } = require('../config/database');

class Customer {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM Customers ORDER BY created_at DESC');
    return rows;
  }

  static async findById(customerId) {
    const [rows] = await pool.execute('SELECT * FROM Customers WHERE cust_id = ?', [customerId]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM Customers WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(customerData) {
    const { name, email, phone, address } = customerData;
    const [result] = await pool.execute(
      'INSERT INTO Customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    return result.insertId;
  }

  static async update(customerId, customerData) {
    const { name, email, phone, address } = customerData;
    const [result] = await pool.execute(
      'UPDATE Customers SET name = ?, email = ?, phone = ?, address = ? WHERE cust_id = ?',
      [name, email, phone, address, customerId]
    );
    return result.affectedRows > 0;
  }

  static async delete(customerId) {
    const [result] = await pool.execute('DELETE FROM Customers WHERE cust_id = ?', [customerId]);
    return result.affectedRows > 0;
  }
}

module.exports = Customer;
