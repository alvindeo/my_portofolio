import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@portofolio.com",
      password: hashed,
    },
  });
  console.log("✅ Admin created!");
}

main().finally(() => prisma.$disconnect());
