const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { username, password, email, role = 'customer' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, role]
    );
    
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(userId) {
    const [rows] = await pool.execute(
      'SELECT user_id, username, email, role FROM Users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
