import { hashPassword } from "../server/auth";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function resetAdminPassword() {
  try {
    const hashedPassword = await hashPassword("admin123");
    
    await db.execute(sql`
      UPDATE users 
      SET password = ${hashedPassword} 
      WHERE username = 'admin'
    `);
    
    console.log("Admin password has been reset to: admin123");
    console.log("Please remember to change this password after login.");
  } catch (error) {
    console.error("Error resetting admin password:", error);
  } finally {
    process.exit();
  }
}

// Run the script
resetAdminPassword();