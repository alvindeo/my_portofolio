import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const skill = await prisma.skill.update({ where: { id: id }, data: body })
    return NextResponse.json(skill)
  } catch (error) {
    console.error('Skill PUT error:', error)
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await prisma.skill.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Skill DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}
