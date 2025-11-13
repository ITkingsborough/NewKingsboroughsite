import { hashPassword } from "../server/auth";
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function resetAdminPassword() {
  try {
    console.log("Resetting admin password...");
    
    const newPassword = "admin123";
    const hashedPassword = await hashPassword(newPassword);
    
    const result = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.username, "admin"))
      .returning();
    
    if (result.length > 0) {
      console.log("✓ Admin password reset successfully!");
      console.log("=======================================================");
      console.log("Login credentials:");
      console.log("Username: admin");
      console.log("Password: admin123");
      console.log("=======================================================");
      console.log("IMPORTANT: Please change this password after first login!");
    } else {
      console.log("No admin user found with username 'admin'");
    }
  } catch (error) {
    console.error("Error resetting admin password:", error);
  } finally {
    process.exit();
  }
}

resetAdminPassword();