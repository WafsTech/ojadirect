import { formatNaira } from "@/lib/format";

export function whatsAppLink(number: string, message: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildProductMessage(params: {
  name: string;
  qty: number;
  city: string;
}): string {
  const { name, qty, city } = params;
  return [
    "Hi Oja Direct, I'd like to order:",
    "",
    `${qty} x ${name}`,
    "",
    `Delivery city: ${city}`,
  ].join("\n");
}

/** Used by the "no search results" empty state to offer a direct line to a human. */
export function buildSearchHelpMessage(query: string): string {
  return `Hi Oja Direct, I searched for "${query}" but didn't find it. Do you have this, or something similar?`;
}

export interface WhatsAppCartLine {
  name: string;
  qty: number;
  price: number;
}

export function buildCartMessage(params: {
  lines: WhatsAppCartLine[];
  city: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
}): string {
  const { lines, city, subtotal, deliveryFee, total } = params;
  const itemLines = lines
    .map((line) => `${line.qty} x ${line.name} — ${formatNaira(line.price * line.qty)}`)
    .join("\n");

  return [
    "Hi Oja Direct, I'd like to order:",
    "",
    itemLines,
    "",
    `Delivery city: ${city}`,
    `Subtotal: ${formatNaira(subtotal)}`,
    `Delivery fee: ${formatNaira(deliveryFee)}`,
    `Total: ${formatNaira(total)}`,
  ].join("\n");
}
