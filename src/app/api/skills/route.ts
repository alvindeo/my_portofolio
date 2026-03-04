import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Skill GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const skill = await prisma.skill.create({ data: body })
    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Skill POST error:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}
