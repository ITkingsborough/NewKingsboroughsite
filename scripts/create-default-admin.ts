import { storage } from '../server/storage';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { pool } from '../server/db';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function createDefaultAdminUser() {
  console.log('=======================================');
  console.log('🔐 Creating default admin user');
  console.log('=======================================');
  
  try {
    // Default admin credentials
    const username = 'admin';
    const name = 'Admin User';
    const email = 'admin@kingsborough.church';
    const password = 'Password123!'; // Note: In production, use a more secure password
    
    // Check if admin already exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (existingUser) {
      console.log('✅ Admin user already exists, no need to create a new one.');
      process.exit(0);
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the admin user
    const user = await storage.createUser({
      username,
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('\n✅ Default admin user created successfully:');
    console.log(`- Username: ${user.username}`);
    console.log(`- Password: Password123!`);
    console.log('\nYou can now log in at: /admin/login');
    console.log('\nIMPORTANT: This is a default account. Please change the password immediately after logging in.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    // No need to close the connection as the process will exit
    process.exit(0);
  }
}

createDefaultAdminUser().catch(console.error);