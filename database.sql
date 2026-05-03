CREATE DATABASE IF NOT EXISTS rbac_db;
USE rbac_db;

-- Tabel roles
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel permissions
CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  resource VARCHAR(50),
  action VARCHAR(20),
  description VARCHAR(255)
);

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Tabel role_permissions (relasi many-to-many)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ============================================
-- SEED DATA
-- ============================================

-- Roles
INSERT INTO roles (name, description) VALUES
  ('admin',  'Administrator dengan akses penuh'),
  ('editor', 'Editor yang bisa melihat dan membuat konten'),
  ('viewer', 'Viewer yang hanya bisa melihat')
ON DUPLICATE KEY UPDATE name=name;

-- Permissions
INSERT INTO permissions (name, resource, action, description) VALUES
  ('user:view',         'users',       'view',   'Melihat daftar user'),
  ('user:create',       'users',       'create', 'Membuat user baru'),
  ('user:edit',         'users',       'edit',   'Mengedit user'),
  ('user:delete',       'users',       'delete', 'Menghapus user'),
  ('role:view',         'roles',       'view',   'Melihat daftar role'),
  ('role:create',       'roles',       'create', 'Membuat role baru'),
  ('role:edit',         'roles',       'edit',   'Mengedit role'),
  ('role:delete',       'roles',       'delete', 'Menghapus role'),
  ('permission:view',   'permissions', 'view',   'Melihat daftar permission'),
  ('permission:create', 'permissions', 'create', 'Membuat permission baru'),
  ('permission:edit',   'permissions', 'edit',   'Mengedit permission'),
  ('permission:delete', 'permissions', 'delete', 'Menghapus permission')
ON DUPLICATE KEY UPDATE name=name;

-- Role Permissions
-- Admin: semua akses (permission id 1-12)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin';

-- Editor: user:view, user:create, user:edit, role:view, permission:view
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN ('user:view','user:create','user:edit','role:view','permission:view')
WHERE r.name = 'editor';

-- Viewer: hanya view
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r
JOIN permissions p ON p.name IN ('user:view','role:view','permission:view')
WHERE r.name = 'viewer';

-- User default: admin (password: admin123)
-- Hash dibuat dengan bcryptjs
INSERT IGNORE INTO users (username, password, email, role_id)
SELECT 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@rbac.com', r.id
FROM roles r WHERE r.name = 'admin';

INSERT IGNORE INTO users (username, password, email, role_id)
SELECT 'editor1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor@rbac.com', r.id
FROM roles r WHERE r.name = 'editor';

INSERT IGNORE INTO users (username, password, email, role_id)
SELECT 'viewer1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'viewer@rbac.com', r.id
FROM roles r WHERE r.name = 'viewer';

-- Semua user di atas passwordnya: password
