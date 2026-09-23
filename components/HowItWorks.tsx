const STEPS = [
  {
    title: "Choose & pay upfront",
    body: "Add items to your cart and pay online — no pay on delivery, ever.",
  },
  {
    title: "We check it at the warehouse",
    body: "Every item is inspected before it leaves our verified supplier.",
  },
  {
    title: "We dispatch to your city",
    body: "Delivery fee and ETA are based on the supplier's city and yours.",
  },
  {
    title: "Delivered to you",
    body: "Your order arrives in Lagos, Ota or Ibadan, right on schedule.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-paper py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          How ordering works
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-[16px] border border-line bg-ground p-4">
              <span className="font-display text-lg font-extrabold text-green">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
