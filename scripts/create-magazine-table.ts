import { db } from '../server/db';
import { magazines } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function createMagazineTable() {
  try {
    console.log('Creating magazine table...');
    
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'magazines'
      )
    `);
    
    if (tableExists.rows[0].exists === true) {
      console.log('Magazine table already exists.');
      process.exit(0);
    }
    
    // Create the magazines table programmatically
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "magazines" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "type" TEXT NOT NULL DEFAULT 'monthly',
        "date" TEXT NOT NULL,
        "cover_image" TEXT NOT NULL,
        "pdf_url" TEXT NOT NULL,
        "featured" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id")
      )
    `);
    
    console.log('Magazine table created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating magazine table:', error);
    process.exit(1);
  }
}

createMagazineTable();