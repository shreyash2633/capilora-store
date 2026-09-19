export const metadata = { title: "Terms & Conditions" }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Terms &amp; Conditions</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-forest-900/70">
        <section>
          <h2 className="mb-2 font-bold text-forest-950">Orders &amp; pricing</h2>
          <p>
            All prices are in Indian Rupees (INR) and include GST where applicable. MRP is printed on every pack. We
            reserve the right to cancel orders in case of stock unavailability or pricing errors, with a full refund.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">Payments</h2>
          <p>
            We currently accept Cash on Delivery. Online payments (UPI, cards and netbanking via Razorpay) are coming
            online shortly. For COD, please keep exact change ready. Orders may be confirmed on WhatsApp before dispatch.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">Shipping</h2>
          <p>
            Orders ship within 2–4 business days. Free shipping applies on prepaid and COD orders above ₹499; a flat fee
            applies below that. Delivery timelines may vary by PIN code.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">Returns &amp; refunds</h2>
          <p>
            For safety reasons, opened cosmetic products cannot be returned. Unopened items can be returned within 7
            days of delivery — contact us on WhatsApp with your order number. Refunds reach the original payment method
            within 5–7 business days.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">Product usage</h2>
          <p>
            Our products are for external use only. Patch-test before first use, keep away from children and avoid
            direct contact with eyes. Discontinue use if irritation occurs. Best before 24 months from manufacturing
            date.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">Contact</h2>
          <p>
            Questions about these terms? Reach us via the{" "}
            <a href="/contact" className="font-semibold text-leaf-600 underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
