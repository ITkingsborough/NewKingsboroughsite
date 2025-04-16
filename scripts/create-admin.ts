import { hashPassword } from "../server/auth";
import { db } from "../server/db";
import { users } from "../shared/schema";
import readline from "readline";

// Create an interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdminUser() {
  try {
    // Get user input
    const username = await promptQuestion("Enter admin username: ");
    const email = await promptQuestion("Enter admin email: ");
    const firstName = await promptQuestion("Enter first name: ");
    const lastName = await promptQuestion("Enter last name: ");
    const password = await promptQuestion("Enter password: ");

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the admin user
    const [user] = await db.insert(users).values({
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: "admin",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log("Admin user created successfully!");
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
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
createAdminUser();