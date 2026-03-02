import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: { name, email, subject, message }
    })

    return NextResponse.json({ success: true, contact }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contact] Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server', detail: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}