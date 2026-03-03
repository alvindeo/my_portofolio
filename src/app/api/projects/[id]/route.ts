import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const project = await prisma.project.update({ where: { id: id }, data: body })
    return NextResponse.json(project)
  } catch (err) {
    console.error('[PUT project]', err)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await prisma.project.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE project]', err)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
