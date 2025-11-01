const bcrypt = require('bcryptjs');

const password = 'admin123';
const hashFromDB = '$2a$10$rqYqZ9h7LJhZF8GnP/QAHO.3.qX5RcJxLXZFQOJp7H.qBOJqE7TxK';

console.log('Testing password verification...');
console.log('Password:', password);
console.log('Hash from DB:', hashFromDB);

// Test with bcrypt.compare (async)
bcrypt.compare(password, hashFromDB).then(result => {
  console.log('✅ bcrypt.compare result:', result);
});

// Test with bcrypt.compareSync (sync)
const resultSync = bcrypt.compareSync(password, hashFromDB);
console.log('✅ bcrypt.compareSync result:', resultSync);
