// scripts/seed.js
// Create initial admin user

const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  try {
    console.log('🌱 Starting seed process...');

    // Check if admin already exists
    const existingAdmin = await db.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('Username: admin');
      console.log('If you forgot the password, please reset it manually.');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const result = await db.query(
      `INSERT INTO users (full_name, username, password, role, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, username, role`,
      ['Admin User', 'admin', hashedPassword, 'manager', true]
    );

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('-----------------------------------');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
