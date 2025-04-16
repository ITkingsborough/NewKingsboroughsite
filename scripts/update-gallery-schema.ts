import { db } from "../server/db";
import { pool } from "../server/db";

async function updateGallerySchema() {
  try {
    console.log("Checking gallery_items table columns...");
    
    // Check if the table exists
    const tableCheck = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'gallery_items'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log("gallery_items table doesn't exist yet. No changes needed.");
      return;
    }
    
    // Get all columns for the gallery_items table
    const allColumns = await db.execute(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'gallery_items'
      ORDER BY ordinal_position;
    `);
    
    console.log("Current gallery_items table schema:");
    allColumns.rows.forEach(row => {
      console.log(`- ${row.column_name} (${row.data_type})`);
    });
    
    // Check if the columns exist with the specific names
    const columnCheck = await db.execute(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'gallery_items'
      AND column_name IN ('image_url', 'is_featured');
    `);
    
    const existingColumns = columnCheck.rows.map(row => row.column_name);
    
    if (existingColumns.includes('image_url')) {
      console.log("✓ Confirmed image_url column is present (mapped to 'image' in schema)");
      
      // Check if there's any data in the table
      const dataCheck = await db.execute(`
        SELECT COUNT(*) FROM gallery_items;
      `);
      
      console.log(`Current gallery items count: ${dataCheck.rows[0].count}`);
    }
    
    if (existingColumns.includes('is_featured')) {
      console.log("✓ Confirmed is_featured column is present (mapped to 'featured' in schema)");
    }
    
    console.log("\nGallery schema validation completed successfully!");
    console.log("Field mapping in schema.ts:");
    console.log("- 'image' field → 'image_url' database column");
    console.log("- 'featured' field → 'is_featured' database column");
    
  } catch (error) {
    console.error("Error updating gallery schema:", error);
  } finally {
    await pool.end();
    process.exit();
  }
}

// Run the script
updateGallerySchema();