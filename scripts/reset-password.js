const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  // Cek semua user yang ada
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true } })
  console.log('Users di DB:', JSON.stringify(users, null, 2))

  const hashed = await bcrypt.hash('admin123', 10)

  // Update password jika sudah ada, atau buat baru
  const user = await prisma.user.upsert({
    where: { email: 'admin@portofolio.com' },
    update: { password: hashed },
    create: { email: 'admin@portofolio.com', name: 'Alvin', password: hashed }
  })
  console.log('\n✅ Password direset untuk:', user.email)
  console.log('   Password baru: admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
