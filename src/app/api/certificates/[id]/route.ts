import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const data = await req.json()
    console.log('[PUT certificate] updating id:', id)
    
    const upd = await prisma.certificate.update({
      where: { id: id },
      data: {
        title: data.title,
        issuer: data.issuer,
        year: data.year,
        imageUrl: data.imageUrl ?? null,
        url: data.url ?? null,
      }
    })
    return NextResponse.json(upd)
  } catch (err) {
    console.error('[PUT certificate] Error:', err)
    return NextResponse.json({ error: 'Failed update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    console.log('[DELETE certificate] deleting id:', id)
    await prisma.certificate.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE certificate] Error:', err)
    return NextResponse.json({ error: 'Failed delete' }, { status: 500 })
  }
}
