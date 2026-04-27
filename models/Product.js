const { pool } = require('../config/database');

class Product {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM Products ORDER BY created_at DESC');
    return rows;
  }

  static async findById(productId) {
    const [rows] = await pool.execute('SELECT * FROM Products WHERE product_id = ?', [productId]);
    return rows[0];
  }

  static async create(productData) {
    const { name, description, price, stock, category, image_url } = productData;
    const [result] = await pool.execute(
      'INSERT INTO Products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category, image_url]
    );
    return result.insertId;
  }

  static async update(productId, productData) {
    const { name, description, price, stock, category, image_url } = productData;
    const [result] = await pool.execute(
      'UPDATE Products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? WHERE product_id = ?',
      [name, description, price, stock, category, image_url, productId]
    );
    return result.affectedRows > 0;
  }

  static async delete(productId) {
    const [result] = await pool.execute('DELETE FROM Products WHERE product_id = ?', [productId]);
    return result.affectedRows > 0;
  }

  static async updateStock(productId, quantity) {
    const [result] = await pool.execute(
      'UPDATE Products SET stock = stock - ? WHERE product_id = ? AND stock >= ?',
      [quantity, productId, quantity]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Product;
