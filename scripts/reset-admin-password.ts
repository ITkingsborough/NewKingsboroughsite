import { hashPassword } from "../server/auth";
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import readline from "readline";

// Create an interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetAdminPassword() {
  try {
    // Find admin users
    console.log("Finding admin users...");
    const adminUsers = await db.select().from(users).where(eq(users.role, "admin"));
    
    if (adminUsers.length === 0) {
      console.log("No admin users found in the database.");
      return;
    }
    
    console.log("Found the following admin users:");
    adminUsers.forEach((admin, index) => {
      console.log(`[${index + 1}] ${admin.username} (${admin.name}) - ${admin.email}`);
    });
    
    // Select admin user to update
    const selection = await promptQuestion("Select a user to reset password (enter number): ");
    const selectedIndex = parseInt(selection) - 1;
    
    if (selectedIndex < 0 || selectedIndex >= adminUsers.length || isNaN(selectedIndex)) {
      console.log("Invalid selection.");
      return;
    }
    
    const selectedAdmin = adminUsers[selectedIndex];
    console.log(`Resetting password for ${selectedAdmin.username}...`);
    
    // Get new password
    const newPassword = await promptQuestion("Enter new password: ");
    const confirmPassword = await promptQuestion("Confirm new password: ");
    
    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match.");
      return;
    }
    
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update the password
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, selectedAdmin.id));
    
    console.log("Password reset successfully!");
    console.log(`Username: ${selectedAdmin.username}`);
    console.log(`New password: ${newPassword}`);
    console.log("Please keep this information secure.");
  } catch (error) {
    console.error("Error resetting admin password:", error);
  } finally {
    rl.close();
  }
}

// Helper function to prompt for input
function promptQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Run the script
resetAdminPassword();