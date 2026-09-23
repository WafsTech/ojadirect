const POINTS = [
  {
    title: "Refund promise",
    body: "Wrong or damaged item? We refund or replace it — no questions asked.",
  },
  {
    title: "Checked before dispatch",
    body: "Every order is inspected at the warehouse before it's sent to your city.",
  },
  {
    title: "Verified warehouses",
    body: "We only buy from suppliers we've vetted in person in Lagos, Ota and Ibadan.",
  },
];

export function TrustSection() {
  return (
    <section className="border-t border-line bg-green-tint py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {POINTS.map((point) => (
            <div key={point.title} className="rounded-[16px] border border-line bg-paper p-5">
              <h3 className="font-display text-lg font-extrabold text-green-dark">
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
