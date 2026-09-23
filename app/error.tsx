"use client";

import { useEffect } from "react";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsAppLink } from "@/lib/whatsapp";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-extrabold text-ink">Something went wrong</h1>
      <p className="text-sm text-muted">
        We couldn&apos;t load this page — it might be a slow connection. Please try again.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-green px-6 py-3 text-sm font-semibold text-paper transition hover:bg-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-dark"
        >
          Try again
        </button>
        {whatsappNumber && (
          <a
            href={whatsAppLink(whatsappNumber, "Hi Oja Direct, I'm having trouble loading the site.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
          >
            <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
            Message us on WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
