import { storage } from '../server/storage';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import readline from 'readline';
import { pool } from '../server/db';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdminUser() {
  console.log('=======================================');
  console.log('🔐 Create Kingsborough Church Admin User');
  console.log('=======================================');
  
  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };
  
  try {
    const username = await askQuestion('Username: ');
    const name = await askQuestion('Full Name: ');
    const email = await askQuestion('Email: ');
    const password = await askQuestion('Password: ');
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (existingUser) {
      console.error(`Error: User with username "${username}" already exists.`);
      process.exit(1);
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
    
    console.log('\n✅ Admin user created successfully:');
    console.log(`- Username: ${user.username}`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log('\nYou can now log in at: /admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
    // No need to explicitly close the connection, let the process exit
    process.exit(0);
  }
}

createAdminUser().catch(console.error);