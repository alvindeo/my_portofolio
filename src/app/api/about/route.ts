import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const about = await prisma.about.findFirst()
    return NextResponse.json(about ?? null)
  } catch (err) {
    console.error('[GET /api/about]', err)
    return NextResponse.json({ error: 'Failed to fetch about' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()

    // Strip fields that must not be passed to Prisma (auto-managed)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updatedAt, ...safeData } = body

    // Only include fields that exist in schema
    const data = {
      name:     safeData.name     ?? '',
      title:    safeData.title    ?? null,
      bio:      safeData.bio      ?? null,
      bio2:     safeData.bio2     ?? null,
      bio3:     safeData.bio3     ?? null,
      bio4:     safeData.bio4     ?? null,
      photoUrl: safeData.photoUrl ?? null,
      email:    safeData.email    ?? null,
      phone:    safeData.phone    ?? null,
      location: safeData.location ?? null,
      github:   safeData.github   ?? null,
      linkedin: safeData.linkedin ?? null,
      cvUrl:    safeData.cvUrl    ?? null,
    }

    const existing = await prisma.about.findFirst()
    let about
    if (existing) {
      about = await prisma.about.update({ where: { id: existing.id }, data })
    } else {
      about = await prisma.about.create({ data })
    }
    return NextResponse.json(about)
  } catch (err) {
    console.error('[PUT /api/about]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update about', detail: message }, { status: 500 })
  }
}
