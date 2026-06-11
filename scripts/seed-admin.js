const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@portofolio.com'
  const password = 'admin123'
  const name = 'Alvin'

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password: hashed,
    },
  })

  console.log('✅ Admin user created!')
  console.log('   Email   :', user.email)
  console.log('   Password: admin123')
  console.log('   Login di: http://localhost:3000/auth/login')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
