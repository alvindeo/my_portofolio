import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const items = await prisma.experience.findMany({ orderBy: { company: 'asc' } })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Experience GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const item = await prisma.experience.create({
      data: {
        company:      body.company,
        role:         body.role,
        description:  body.description,
        period:       body.period,
        tags:         body.tags         || '',
        achievements: body.achievements || '',
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Experience POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}
