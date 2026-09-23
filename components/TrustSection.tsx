const POINTS = [
  {
    title: "Verified warehouses",
    body: "We only buy from suppliers we've vetted in person in Lagos, Ota and Ibadan.",
  },
  {
    title: "Checked before dispatch",
    body: "Every order is inspected at the warehouse before it's sent to your city.",
  },
  {
    title: "Transparent delivery",
    body: "Delivery fee and ETA are shown upfront, based on the supplier's city and yours.",
  },
  {
    title: "Refund or replacement",
    body: "Wrong or damaged item? We refund or replace it.",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="border-t border-line bg-green-tint py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Why shop Oja Direct?
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => (
            <div key={point.title} className="rounded-2xl border border-line bg-paper p-5">
              <h3 className="font-display text-base font-extrabold text-green-dark">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
