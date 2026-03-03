import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const data = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET certificates]', err)
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    const newly = await prisma.certificate.create({
      data: {
        title: data.title,
        issuer: data.issuer,
        year: data.year,
        imageUrl: data.imageUrl ?? null,
        url: data.url ?? null,
      }
    })
    return NextResponse.json(newly)
  } catch (err) {
    console.error('[POST certificates]', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
