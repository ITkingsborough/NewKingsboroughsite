import { hashPassword } from "../server/auth";
import { db } from "../server/db";
import { users } from "../shared/schema";

async function createDefaultAdmin() {
  try {
    console.log("Checking for existing admin users...");
    const existingAdmins = await db.select().from(users).where({ role: "admin" });
    
    if (existingAdmins.length > 0) {
      console.log("Admin users already exist in the database.");
      console.log("Existing admin usernames:");
      existingAdmins.forEach(admin => {
        console.log(`- ${admin.username}`);
      });
      return;
    }
    
    // Default admin credentials
    const defaultAdmin = {
      username: "admin",
      email: "admin@kingsboroughchurch.org",
      firstName: "Admin",
      lastName: "User",
      password: await hashPassword("admin123"),
      role: "admin",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log("Creating default admin user...");
    const [admin] = await db.insert(users).values(defaultAdmin).returning();
    
    console.log("Default admin user created successfully!");
    console.log("=======================================================");
    console.log("Default admin login details:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("=======================================================");
    console.log("IMPORTANT: Please change this password after first login!");
  } catch (error) {
    console.error("Error creating default admin:", error);
  } finally {
    process.exit();
  }
}

// Run the script
createDefaultAdmin();