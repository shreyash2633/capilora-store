export const metadata = { title: "Privacy Policy", description: "How Capilora Professional collects, uses and protects your personal data.", alternates: { canonical: "/privacy" } }

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-forest-900/70">
        <p>
          Capilora Professional (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains what we
          collect when you shop with us and how it is used.
        </p>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Contact and delivery details you provide at checkout: name, phone, email, address and PIN code.</li>
            <li>Order details: products purchased, amounts, payment status and coupon usage.</li>
            <li>For online payments, payment references (order ID / payment ID) are stored for reconciliation. We never see or store your card numbers or UPI PINs — payments are processed by Razorpay.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">How we use it</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To process, pack, ship and support your orders.</li>
            <li>To send order updates on WhatsApp/SMS/email.</li>
            <li>To improve our catalogue and service quality.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">What we never do</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Sell or rent your personal data to third parties.</li>
            <li>Store your payment credentials.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 font-bold text-forest-950">Your rights</h2>
          <p>
            Write to us any time to access, correct or delete your data. Reach us via the details on our{" "}
            <a href="/contact" className="font-semibold text-leaf-600 underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
