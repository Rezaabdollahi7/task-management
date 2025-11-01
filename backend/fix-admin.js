const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://admin:admin123@database:5432/task_management',
});

async function fixAdmin() {
  try {
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('🔐 New hash generated:', hashedPassword);
    
    // Update admin password
    await pool.query(
      "UPDATE users SET password = $1 WHERE username = 'admin'",
      [hashedPassword]
    );
    
    console.log('✅ Admin password updated!');
    
    // Verify it works
    const result = await pool.query(
      "SELECT * FROM users WHERE username = 'admin'"
    );
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    console.log('✅ Verification test:', isValid);
    
    if (isValid) {
      console.log('🎉 SUCCESS! You can now login with:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    }
    
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    pool.end();
  }
}

fixAdmin();
