import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const item = await prisma.education.update({
      where: { id },
      data: {
        degree:      body.degree,
        institution: body.institution,
        field:       body.field,
        period:      body.period,
        description: body.description,
        gpa:         body.gpa      || null,
        imageUrl:    body.imageUrl || null,
        location:    body.location || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    })
    return NextResponse.json(item)
  } catch (err) {
    console.error('[PUT education]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await prisma.education.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE education]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
