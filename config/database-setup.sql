-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS Customers (
  cust_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS Products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(50),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS Orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  cust_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cust_id) REFERENCES Customers(cust_id) ON DELETE SET NULL
);

-- Order_Details table
CREATE TABLE IF NOT EXISTS Order_Details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO Products (name, description, price, stock, category) VALUES
('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 50, 'Electronics'),
('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 200, 'Accessories'),
('USB-C Cable', 'Fast charging USB-C cable', 15.99, 150, 'Accessories'),
('Mechanical Keyboard', 'RGB mechanical keyboard', 89.99, 75, 'Accessories'),
('Monitor 27"', '4K IPS monitor', 399.99, 30, 'Electronics');

INSERT INTO Customers (name, email, phone, address) VALUES
('John Doe', 'john@example.com', '+250788123456', 'Kigali, Rwanda'),
('Jane Smith', 'jane@example.com', '+250788654321', 'Kigali, Rwanda');
