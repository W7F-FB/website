import { NextRequest, NextResponse } from "next/server"
import { dev } from "@/lib/dev"

const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID
const KLAVIYO_HEADERS = {
  "Content-Type": "application/vnd.api+json",
  "Authorization": `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
  "revision": "2024-10-15",
}

export async function POST(request: NextRequest) {
  try {
    if (!KLAVIYO_API_KEY) {
      return NextResponse.json(
        { error: "Server missing Klaviyo API key" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, listId, firstName, lastName, phone } = body

    const targetListId = listId || KLAVIYO_LIST_ID

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!targetListId) {
      return NextResponse.json(
        { error: "List ID is required" },
        { status: 400 }
      )
    }

    const profileAttributes: Record<string, unknown> = { email }
    if (firstName) profileAttributes.first_name = firstName
    if (lastName) profileAttributes.last_name = lastName
    if (phone) profileAttributes.phone_number = phone

    const profileResponse = await fetch(
      "https://a.klaviyo.com/api/profile-import",
      {
        method: "POST",
        headers: KLAVIYO_HEADERS,
        body: JSON.stringify({
          data: {
            type: "profile",
            attributes: profileAttributes,
          },
        }),
      }
    )

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json().catch(() => null)
      console.log("Klaviyo profile error:", profileResponse.status, JSON.stringify(errorData, null, 2))
      return NextResponse.json(
        { error: "Failed to create profile", details: errorData },
        { status: profileResponse.status }
      )
    }

    const subscribeResponse = await fetch(
      "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs",
      {
        method: "POST",
        headers: KLAVIYO_HEADERS,
        body: JSON.stringify({
          data: {
            type: "profile-subscription-bulk-create-job",
            attributes: {
              profiles: {
                data: [
                  {
                    type: "profile",
                    attributes: {
                      email,
                      subscriptions: {
                        email: {
                          marketing: {
                            consent: "SUBSCRIBED",
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
            relationships: {
              list: {
                data: {
                  type: "list",
                  id: targetListId,
                },
              },
            },
          },
        }),
      }
    )

    if (!subscribeResponse.ok) {
      const errorData = await subscribeResponse.json().catch(() => null)
      console.log("Klaviyo subscribe error:", subscribeResponse.status, JSON.stringify(errorData, null, 2))
      return NextResponse.json(
        { error: "Failed to subscribe", details: errorData },
        { status: subscribeResponse.status }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    dev.log("Klaviyo error:", e)

    if (e instanceof Error) {
      return NextResponse.json(
        { error: "Subscription failed", details: e.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Unexpected error", details: String(e) },
      { status: 500 }
    )
  }
}
