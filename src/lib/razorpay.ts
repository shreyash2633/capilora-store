import crypto from "crypto"

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  status: string
}

/** Creates an order via the Razorpay REST API. */
export async function createRazorpayOrder(
  amountInPaise: number,
  receipt: string,
  notes: Record<string, string> = {}
): Promise<RazorpayOrder> {
  const keyId = process.env.RAZORPAY_KEY_ID!
  const keySecret = process.env.RAZORPAY_KEY_SECRET!
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64")

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: amountInPaise, currency: "INR", receipt, notes }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Razorpay order failed: ${res.status} ${text.slice(0, 300)}`)
  }
  return (await res.json()) as RazorpayOrder
}

/** HMAC-SHA256 signature check for checkout handler responses. */
export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET!
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex")
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

/** Verifies a webhook payload signature. */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex")
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}
