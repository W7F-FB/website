import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { dev } from "@/lib/dev"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Server missing Resend API key" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { to, subject, html, replyTo, fromName } = body

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, html" },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: `${fromName || "W7F"} <noreply@forms.worldsevensfootball.com>`,
      to,
      subject,
      html,
      replyTo,
    })

    if (error) {
      dev.log("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 200 })
  } catch (e) {
    dev.log("Resend error:", e)

    if (e instanceof Error) {
      return NextResponse.json(
        { error: "Email send failed", details: e.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Unexpected error", details: String(e) },
      { status: 500 }
    )
  }
}

