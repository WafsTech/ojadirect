export function PriceSticker({
  percentOff,
  className = "",
}: {
  percentOff: number;
  className?: string;
}) {
  if (percentOff <= 0) return null;

  return (
    <span
      className={`inline-flex -rotate-6 items-center justify-center rounded-[10px] border border-black/10 bg-sticker px-2.5 py-1 text-xs font-extrabold text-sticker-ink shadow-sm ${className}`}
    >
      {percentOff}% less
    </span>
  );
}
