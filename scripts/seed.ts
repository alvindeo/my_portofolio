import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@portofolio.com";
  
  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log("ℹ️ Admin user already exists.");
    return;
  }

  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: "Admin"
    },
  });
  console.log("✅ Admin created!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
