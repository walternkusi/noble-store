-- Girls Fashion Shop - Aiven MySQL Schema

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  images JSON,
  sizes JSON,
  colors JSON,
  stock INT DEFAULT 0,
  featured TINYINT(1) DEFAULT 0,
  newArrival TINYINT(1) DEFAULT 0,
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) DEFAULT '',
  address TEXT,
  city VARCHAR(255) DEFAULT '',
  deliveryMethod VARCHAR(50) DEFAULT 'delivery',
  notes TEXT,
  products JSON NOT NULL,
  quantities JSON NOT NULL,
  sizes JSON NOT NULL,
  colors JSON NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  deliveryFee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  createdAt DATETIME DEFAULT NOW()
);
