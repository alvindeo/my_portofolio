import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const items = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('[GET /api/projects]', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const item = await prisma.project.create({
      data: {
        title:           body.title,
        tagline:         body.tagline         || null,
        year:            body.year             || null,
        imageUrl:        body.imageUrl         || null,
        tags:            body.tags             || [],
        techStack:       body.techStack        || [],
        techIcons:       body.techIcons        || [],
        liveUrl:         body.liveUrl          || null,
        githubUrl:       body.githubUrl        || null,
        featured:        body.featured         ?? false,
        description:     body.description      || '',
        fullDescription: body.fullDescription  || null,
        highlights:      body.highlights       || [],
        challenges:      body.challenges       || null,
        outcome:         body.outcome          || null,
      } as any // eslint-disable-line
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('[POST /api/projects]', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}
