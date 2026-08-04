import bcrypt from "bcryptjs";
import { Role } from "./generated/prisma/enums";
import prisma from "../src/lib/prisma";

async function main() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create admin user
    await prisma.user.create({
      data: {
        name: "Hero",
        email: "hero@fix.com",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("✅ Admin user created successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });