"use client";

export function QuantitySelector({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-10 w-10 items-center justify-center text-lg text-ink disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
      >
        −
      </button>
      <span aria-live="polite" className="w-8 text-center text-sm font-semibold text-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
        className="flex h-10 w-10 items-center justify-center text-lg text-ink disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
      >
        +
      </button>
    </div>
  );
}
