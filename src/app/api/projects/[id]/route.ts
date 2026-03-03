import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await prisma.project.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch (error) {
    console.error('[GET /api/projects/[id]]', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const item = await prisma.project.update({
      where: { id },
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
    return NextResponse.json(item)
  } catch (err) {
    console.error('[PUT /api/projects/[id]]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/projects/[id]]', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
