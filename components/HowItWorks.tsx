import { CursorClickIcon, ShieldCheckIcon, ClipboardCheckIcon, TruckIcon } from "@/components/Icons";

const STEPS = [
  {
    title: "Choose your product",
    body: "Browse and add items to your cart from any of our three cities.",
    Icon: CursorClickIcon,
  },
  {
    title: "Pay securely",
    body: "Pay online upfront — no pay on delivery, ever.",
    Icon: ShieldCheckIcon,
  },
  {
    title: "We check it at the warehouse",
    body: "Every order is inspected before it leaves the supplier.",
    Icon: ClipboardCheckIcon,
  },
  {
    title: "We dispatch and deliver",
    body: "Delivered to your city on schedule, fee and ETA shown upfront.",
    Icon: TruckIcon,
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
            <li key={step.title} className="rounded-2xl border border-line bg-ground p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-tint text-green-dark">
                  <step.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-extrabold text-green">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
