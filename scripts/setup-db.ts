import { hashPassword } from "../server/auth";
import { db } from "../server/db";
import { users, userRoleEnum } from "../shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { sql } from "drizzle-orm";

async function setupDatabase() {
  try {
    console.log("Setting up database schema...");
    
    // Ensure users table exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'editor',
        active BOOLEAN NOT NULL DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create enum if it doesn't exist
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('admin', 'editor', 'media_manager');
        END IF;
      END$$;
    `);
    
    // Create contact messages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        is_prayer BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create newsletter subscribers table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create activity logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id INTEGER,
        details TEXT,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Tables created successfully!");

    // Create default admin user if none exists
    const existingAdmins = await db.execute(sql`SELECT * FROM users WHERE role = 'admin'`);
    
    if (existingAdmins.rows.length === 0) {
      console.log("Creating default admin user...");
      
      const hashedPassword = await hashPassword("admin123");
      
      await db.execute(sql`
        INSERT INTO users (username, email, password, firstname, lastname, role, active, created_at, updated_at)
        VALUES ('admin', 'admin@kingsboroughchurch.org', ${hashedPassword}, 'Admin', 'User', 'admin', true, NOW(), NOW())
      `);
      
      console.log("Default admin user created successfully!");
      console.log("=======================================================");
      console.log("Default admin login details:");
      console.log("Username: admin");
      console.log("Password: admin123");
      console.log("=======================================================");
      console.log("IMPORTANT: Please change this password after first login!");
    } else {
      console.log("Admin users already exist in the database.");
    }
    
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    process.exit();
  }
}

// Run the script
setupDatabase();