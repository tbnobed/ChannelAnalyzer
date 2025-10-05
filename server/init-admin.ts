import { storage } from "./storage";
import { hashPassword } from "./auth";

export async function initializeAdmin() {
  const adminUsername = "admin";
  const adminPassword = "admin123";

  try {
    const existingAdmin = await storage.getUserByUsername(adminUsername);
    
    if (!existingAdmin) {
      const hashedPassword = await hashPassword(adminPassword);
      await storage.createUser({
        username: adminUsername,
        password: hashedPassword,
      });
      console.log("✓ Admin account created successfully");
      console.log(`  Username: ${adminUsername}`);
      console.log(`  Password: ${adminPassword}`);
      console.log("  Please change the password after first login");
    } else {
      console.log("✓ Admin account already exists");
    }
  } catch (error) {
    console.error("Failed to initialize admin account:", error);
    throw error;
  }
}
