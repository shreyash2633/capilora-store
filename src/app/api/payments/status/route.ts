import { ok } from "@/lib/api"
import { isRazorpayConfigured } from "@/lib/razorpay"

export async function GET() {
  return ok({ razorpayConfigured: isRazorpayConfigured() })
}