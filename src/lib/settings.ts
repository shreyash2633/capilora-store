import { db } from "./db"
import { DEFAULT_SETTINGS } from "../../scripts/products-data"

export type StoreSettings = Record<string, string>

export async function getSettings(): Promise<StoreSettings> {
  try {
    const rows = await db.setting.findMany()
    return { ...DEFAULT_SETTINGS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export async function getShipping(subtotalAfterDiscount: number): Promise<{
  shipping: number
  freeShipThreshold: number
}> {
  const s = await getSettings()
  const freeShipThreshold = Number(s.freeShipThreshold) || 499
  const fee = Number(s.shippingFee) || 49
  const shipping = subtotalAfterDiscount >= freeShipThreshold ? 0 : fee
  return { shipping, freeShipThreshold }
}
