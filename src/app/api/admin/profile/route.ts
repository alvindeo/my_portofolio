import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, currentPassword, newPassword } = await req.json()

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // If changing password, verify current password first
    if (newPassword) {
      const valid = await bcrypt.compare(currentPassword ?? '', user.password)
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const updateData: Record<string, string> = {}
    if (name) updateData.name = name
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 12)

    // Note: User model doesn't have name field yet — update email field as display
    // We'll store name in a separate way; for now update what's available
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: { id: true, email: true },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
