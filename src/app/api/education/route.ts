import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const items = await prisma.education.findMany({ orderBy: { degree: 'asc' } })
    return NextResponse.json(items)
  } catch (err) {
    console.error('[GET /api/education] Error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch education' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const item = await prisma.education.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        degree:      body.degree,
        institution: body.institution,
        field:       body.field,
        period:      body.period,
        description: body.description,
        gpa:         body.gpa      || null,
        imageUrl:    body.imageUrl || null,
        location:    body.location || null,
      } as any
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('[POST /api/education] Error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
