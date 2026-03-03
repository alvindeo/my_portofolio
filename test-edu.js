const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- Testing Education CRUD via Prisma ---')
  try {
    // 1. Create
    console.log('1. Testing Create...')
    const newEdu = await prisma.education.create({
      data: {
        institution: 'Test University',
        degree: 'Bachelor',
        field: 'Computer Science',
        startDate: new Date('2020-01-01'),
        current: true,
        gpa: '3.5'
      }
    })
    console.log('Create Success:', newEdu)

    // 2. Fetch
    console.log('2. Testing Fetch...')
    const all = await prisma.education.findMany()
    console.log('Fetch Success, count:', all.length)

    // 3. Update
    console.log('3. Testing Update...')
    const upd = await prisma.education.update({
      where: { id: newEdu.id },
      data: { degree: 'Master' }
    })
    console.log('Update Success:', upd)

    // 4. Delete
    console.log('4. Testing Delete...')
    await prisma.education.delete({ where: { id: newEdu.id } })
    console.log('Delete Success')

  } catch (err) {
    console.error('ERROR during Prisma test:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
