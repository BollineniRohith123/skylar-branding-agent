-- Create superadmin table
CREATE TABLE IF NOT EXISTS superadmin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT 'Super Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default superadmin account (password: superadmin)
-- Using SHA2 hash for password
INSERT INTO superadmin (email, password, name) 
VALUES ('superadmin@gmail.com', SHA2('superadmin', 256), 'Super Admin')
ON DUPLICATE KEY UPDATE email = email;
