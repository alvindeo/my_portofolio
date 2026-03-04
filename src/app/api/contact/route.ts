import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// ── Nodemailer transporter ─────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

// ── POST: simpan ke DB + kirim email notifikasi ────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    // 1. Simpan ke database
    const contact = await prisma.contact.create({
      data: { name, email, subject, message }
    })

    // 2. Kirim email notifikasi ke admin
    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // kirim ke diri sendiri
        replyTo: email,             // reply akan ke pengirim
        subject: `📬 New Message: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📬 New Contact Message</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">From your portfolio website</p>
            </div>
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; color: #888; width: 100px; font-size: 13px;">Name</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; font-weight: bold; font-size: 15px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; color: #888; font-size: 13px;">Email</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; font-size: 15px;">
                    <a href="mailto:${email}" style="color: #6366f1;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; color: #888; font-size: 13px;">Subject</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #2a2a2a; font-weight: bold; font-size: 15px;">${subject}</td>
                </tr>
              </table>
              <div style="margin-top: 24px;">
                <p style="color: #888; font-size: 13px; margin-bottom: 12px;">MESSAGE</p>
                <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${message}</div>
              </div>
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 28px; border-radius: 99px; text-decoration: none; font-weight: bold; font-size: 14px;">Reply to ${name} →</a>
              </div>
            </div>
            <div style="padding: 20px 32px; border-top: 1px solid #2a2a2a; text-align: center;">
              <p style="color: #555; font-size: 12px; margin: 0;">Sent from your Portfolio Dashboard</p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      // Gagal kirim email tidak membatalkan penyimpanan ke DB
      console.error('[Email] Failed to send notification:', emailError)
    }

    return NextResponse.json({ success: true, contact }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contact] Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server', detail: String(error) }, { status: 500 })
  }
}

// ── GET: ambil semua pesan ─────────────────────────────────────────────────
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}