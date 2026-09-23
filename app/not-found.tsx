import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold text-ink">
        Page not found
      </h1>
      <p className="text-muted">We couldn&apos;t find what you were looking for.</p>
      <Link
        href="/"
        className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-paper hover:bg-green-dark"
      >
        Back to shop
      </Link>
    </div>
  );
}
